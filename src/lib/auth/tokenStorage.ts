import Cookies from "js-cookie";

const ACCESS = "pwr_access";
const REFRESH = "pwr_refresh";

const baseOpts: Cookies.CookieAttributes = {
  path: "/",
  sameSite: "lax",
  secure: import.meta.env.PROD,
};

/**
 * Access token (JWT or opaque). Readable by JS so API client can set Authorization.
 * HttpOnly is not an option for SPA-held tokens from JSON login — server would need to Set-Cookie.
 */
export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH);
}

export function setAccessToken(value: string): void {
  Cookies.set(ACCESS, value, baseOpts);
}

export function setRefreshToken(value: string): void {
  Cookies.set(REFRESH, value, baseOpts);
}

/**
 * Sets both tokens after login or refresh. Omits a cookie if the value is empty.
 */
export function setAuthTokens(access: string, refresh: string | undefined | null): void {
  if (access) {
    setAccessToken(access);
  } else {
    Cookies.remove(ACCESS, { path: "/" });
  }
  if (refresh) {
    setRefreshToken(refresh);
  } else {
    Cookies.remove(REFRESH, { path: "/" });
  }
}

export function clearAuthTokens(): void {
  Cookies.remove(ACCESS, { path: "/" });
  Cookies.remove(REFRESH, { path: "/" });
}

export function hasAccessToken(): boolean {
  return Boolean(getAccessToken());
}

export function hasRefreshToken(): boolean {
  return Boolean(getRefreshToken());
}
