import { buildUrl, getUserRefreshPath } from "./config";
import { userAuthRefresh } from "./authApi";
import { getAccessToken, getRefreshToken, hasAccessToken } from "@/lib/auth/tokenStorage";
import { useAuthStore } from "@/stores/authStore";

const AUTH_HEADER = "Authorization";

class UnauthenticatedError extends Error {
  name = "UnauthenticatedError";
}

let refreshInFlight: Promise<void> | null = null;

function isRefreshRequest(url: string, base: string): boolean {
  const path = getUserRefreshPath();
  return url.includes(path) || url === buildUrl(path) || (base && url === `${base.replace(/\/$/, "")}${path}`);
}

/**
 * One refresh at a time; updates cookies and bumps auth version in the store.
 */
async function refreshAccessTokenWithMutex(): Promise<void> {
  if (refreshInFlight) {
    await refreshInFlight;
    return;
  }

  const rt = getRefreshToken();
  if (!rt) {
    useAuthStore.getState().logout();
    throw new UnauthenticatedError("No refresh token");
  }

  refreshInFlight = (async () => {
    try {
      await userAuthRefresh(rt);
      useAuthStore.getState().bumpSession();
    } catch {
      useAuthStore.getState().logout();
      throw new UnauthenticatedError("Session expired");
    } finally {
      refreshInFlight = null;
    }
  })();

  await refreshInFlight;
}

type ApiFetchOptions = {
  /**
   * When true (default), sends Bearer access token and enforces a token exists.
   * Set false for public API routes.
   */
  requireAuth?: boolean;
};

/**
 * Appends path to VITE_API_BASE_URL, sends JSON + credentials (cookies) by default.
 * With `requireAuth: true` (default): adds `Authorization: Bearer <accessToken>`, requires a valid access token,
 * and on 401 attempts one refresh and retries the same request once.
 */
export async function apiFetch(
  path: string,
  init: RequestInit = {},
  options: ApiFetchOptions = {},
): Promise<Response> {
  const { requireAuth = true } = options;
  const base = import.meta.env.VITE_API_BASE_URL ?? "";
  const fullUrl = buildUrl(path);

  if (requireAuth) {
    if (!hasAccessToken() && getRefreshToken()) {
      try {
        await refreshAccessTokenWithMutex();
      } catch {
        throw new UnauthenticatedError("Session expired. Sign in again.");
      }
    }
    if (!hasAccessToken()) {
      throw new UnauthenticatedError("Missing access token. Sign in first.");
    }
  }

  const run = () => {
    const headers = new Headers(init.headers);
    if (requireAuth) {
      const t = getAccessToken();
      if (t) {
        headers.set(AUTH_HEADER, `Bearer ${t}`);
      }
    }
    if (init.body !== undefined && !headers.has("Content-Type") && typeof init.body === "string") {
      headers.set("Content-Type", "application/json");
    }
    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    return fetch(fullUrl, {
      ...init,
      headers,
      credentials: init.credentials ?? "include",
    });
  };

  let res = await run();

  if (requireAuth && res.status === 401 && !isRefreshRequest(fullUrl, base)) {
    if (getRefreshToken()) {
      try {
        await refreshAccessTokenWithMutex();
        res = await run();
        if (res.status === 401) {
          useAuthStore.getState().logout();
        }
      } catch {
        throw new UnauthenticatedError("Session expired. Sign in again.");
      }
    } else {
      useAuthStore.getState().logout();
    }
  }

  return res;
}

/**
 * `apiFetch` and parse JSON, or throw with status text.
 */
export async function apiJson<T = unknown>(path: string, init: RequestInit = {}, options: ApiFetchOptions = {}): Promise<T> {
  const res = await apiFetch(path, init, options);
  const text = await res.text();
  if (!res.ok) {
    let msg = res.statusText;
    try {
      if (text) {
        const j = JSON.parse(text) as { message?: string };
        if (j.message) msg = j.message;
      }
    } catch {
      /* use msg */
    }
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return (text ? JSON.parse(text) : undefined) as T;
}

export { UnauthenticatedError };
