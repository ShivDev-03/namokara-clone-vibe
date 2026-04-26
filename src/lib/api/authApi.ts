import { buildUrl, getUserLoginPath, getUserRefreshPath } from "./config";
import { setAuthTokens } from "@/lib/auth/tokenStorage";

export type UserAuthLoginRequest = {
  email: string;
  password: string;
  deviceToken: string;
};

/** Envelope: `{ status, data: { user, tokens } }` and flat token shapes. */
export type UserAuthLoginResponse = {
  status?: string;
  message?: string;
  data?: {
    user?: { email?: string; name?: string; role?: string; id?: string; codes?: unknown[]; deviceTokens?: unknown[] };
    tokens?: {
      access?: { token?: string; expires?: string };
      refresh?: { token?: string; expires?: string };
    };
  };
  access_token?: string;
  accessToken?: string;
  token?: string;
  refresh_token?: string;
  refreshToken?: string;
  user?: { email?: string; name?: string };
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}

/**
 * Supports:
 * - `{ data: { tokens: { access: { token }, refresh: { token } } } }`
 * - flat `{ accessToken, refreshToken, access_token, ... }`
 */
function extractTokensFromApiBody(body: unknown): { access: string | null; refresh: string | null } {
  if (!isRecord(body)) {
    return { access: null, refresh: null };
  }
  const data = body.data;
  if (isRecord(data) && isRecord(data.tokens)) {
    const t = data.tokens;
    const access = isRecord(t.access) && typeof t.access.token === "string" ? t.access.token : null;
    const refresh = isRecord(t.refresh) && typeof t.refresh.token === "string" ? t.refresh.token : null;
    if (access != null || refresh != null) {
      return { access, refresh };
    }
  }
  const access =
    (typeof body.access_token === "string" && body.access_token) ||
    (typeof body.accessToken === "string" && body.accessToken) ||
    (typeof body.token === "string" && body.token) ||
    null;
  const refresh =
    (typeof body.refresh_token === "string" && body.refresh_token) || (typeof body.refreshToken === "string" && body.refreshToken) || null;
  return { access, refresh: refresh as string | null };
}

function extractUserEmailFromApiBody(body: unknown, fallback: string): string {
  if (!isRecord(body)) {
    return fallback;
  }
  if (isRecord(body.data) && isRecord(body.data.user) && typeof body.data.user.email === "string") {
    return body.data.user.email;
  }
  if (isRecord(body.user) && typeof body.user.email === "string") {
    return body.user.email;
  }
  return fallback;
}

function isSuccessEnvelope(body: unknown): boolean {
  if (!isRecord(body)) {
    return true;
  }
  if (body.status == null) {
    return true;
  }
  return String(body.status).toLowerCase() === "success";
}

function getErrorMessage(data: unknown, res: Response): string {
  if (isRecord(data) && typeof data.message === "string" && data.message) {
    return data.message;
  }
  if (isRecord(data) && "error" in data) {
    const err = data.error;
    if (typeof err === "string") return err;
    if (isRecord(err) && typeof err.message === "string") return err.message;
  }
  return res.statusText || "Request failed";
}

export type NormalizedLoginResult = {
  accessToken: string | null;
  refreshToken: string | null;
  userEmail: string;
  serverSession: boolean;
  raw: UserAuthLoginResponse;
};

/**
 * POST /v1/user/auth/login with email, password, deviceToken.
 * Parses nested `data.tokens.access.token` / `data.tokens.refresh.token` (or flat variants).
 */
export async function userAuthLogin(
  input: UserAuthLoginRequest,
): Promise<NormalizedLoginResult> {
  const url = buildUrl(getUserLoginPath());

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      deviceToken: input.deviceToken ?? "",
    }),
  });

  const text = await res.text();
  let data: UserAuthLoginResponse;
  try {
    data = text ? (JSON.parse(text) as UserAuthLoginResponse) : ({} as UserAuthLoginResponse);
  } catch {
    throw new Error("Invalid response from server.");
  }

  if (!res.ok) {
    throw new Error(getErrorMessage(data, res));
  }

  if (!isSuccessEnvelope(data)) {
    throw new Error(getErrorMessage(data, res));
  }

  const { access, refresh } = extractTokensFromApiBody(data);
  const userEmail = extractUserEmailFromApiBody(data, input.email);
  const accessToken = access;
  const refreshToken = refresh;
  const serverSession = !accessToken;

  return { accessToken, refreshToken, userEmail, serverSession, raw: data };
}

export type RefreshResponse = {
  status?: string;
  message?: string;
  data?: {
    tokens?: {
      access?: { token?: string; expires?: string };
      refresh?: { token?: string; expires?: string };
    };
  };
  access_token?: string;
  accessToken?: string;
  token?: string;
  refresh_token?: string;
  refreshToken?: string;
};

/**
 * POST /v1/user/auth/refresh with refreshToken in the JSON body.
 * Parses the same token envelope as login when the API returns `data.tokens`.
 */
export async function userAuthRefresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string | null }> {
  const url = buildUrl(getUserRefreshPath());
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const text = await res.text();
  let data: RefreshResponse;
  try {
    data = text ? (JSON.parse(text) as RefreshResponse) : ({} as RefreshResponse);
  } catch {
    throw new Error("Invalid response from server.");
  }

  if (!res.ok) {
    throw new Error(getErrorMessage(data, res));
  }
  if (!isSuccessEnvelope(data)) {
    throw new Error(getErrorMessage(data, res));
  }

  const { access, refresh: nextRefresh } = extractTokensFromApiBody(data);
  if (!access) {
    throw new Error("Refresh response did not include an access token.");
  }
  setAuthTokens(access, nextRefresh);
  return { accessToken: access, refreshToken: nextRefresh };
}
