import { clearAuthTokens, getAccessToken, getRefreshToken } from "./tokenStorage";

/**
 * Rejects common garbage values and trims so cookies never count as a session by accident.
 */
function isPresentToken(raw: string | undefined): boolean {
  if (raw == null) return false;
  const t = String(raw).trim();
  if (t.length < 3) return false;
  if (t === "undefined" || t === "null" || t === "false") return false;
  return true;
}

function looksLikeJwt(s: string): boolean {
  return s.split(".").length === 3;
}

/**
 * If `exp` is in the past, the access token is not usable (unless we still have refresh).
 */
function isAccessJwtExpired(token: string): boolean {
  if (!looksLikeJwt(token)) return false;
  try {
    const payload = token.split(".")[1];
    if (!payload) return false;
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(b64)) as { exp?: number };
    if (typeof json.exp !== "number") return false;
    return json.exp * 1000 < Date.now();
  } catch {
    return false;
  }
}

/**
 * True when the browser has a session worth treating as "signed in" in the admin UI.
 * - Refresh alone counts (will be exchanged on bootstrap / api call).
 * - Access alone counts if not an expired JWT; opaque tokens are assumed valid until the API 401s.
 */
export function isClientAuthenticatedForUi(): boolean {
  const access = getAccessToken();
  const refresh = getRefreshToken();

  const hasR = isPresentToken(refresh);
  const hasA = isPresentToken(access);

  if (hasR) {
    return true;
  }
  if (!hasA) {
    return false;
  }
  if (looksLikeJwt(access!) && isAccessJwtExpired(access!)) {
    return false;
  }
  return true;
}

/**
 * Clears cookies when the access token is a dead JWT and there is no refresh. Returns `true` if it cleared.
 */
export function clearDeadClientSessionIfNeeded(): boolean {
  const access = getAccessToken();
  const refresh = getRefreshToken();
  if (!isPresentToken(access) || isPresentToken(refresh)) {
    return false;
  }
  if (!looksLikeJwt(access!)) {
    return false;
  }
  if (!isAccessJwtExpired(access!)) {
    return false;
  }
  clearAuthTokens();
  return true;
}
