/**
 * Resolves the API base URL. Trailing slashes are removed.
 * Returns an empty string if unset (caller should block requests or show a config error).
 */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL ?? "";
  return String(raw).replace(/\/$/, "");
}

/** User auth login path; override with VITE_USER_LOGIN_PATH. */
export function getUserLoginPath(): string {
  const p = import.meta.env.VITE_USER_LOGIN_PATH;
  if (p && String(p).trim() !== "") {
    return String(p).startsWith("/") ? String(p) : `/${p}`;
  }
  return "/v1/user/auth/login";
}

/** User refresh path; override with VITE_USER_REFRESH_PATH. */
export function getUserRefreshPath(): string {
  const p = import.meta.env.VITE_USER_REFRESH_PATH;
  if (p && String(p).trim() !== "") {
    return String(p).startsWith("/") ? String(p) : `/${p}`;
  }
  return "/v1/user/auth/refresh";
}

/** Create product; override with VITE_USER_PRODUCT_PATH. */
export function getUserProductCreatePath(): string {
  const p = import.meta.env.VITE_USER_PRODUCT_PATH;
  if (p && String(p).trim() !== "") {
    return String(p).startsWith("/") ? String(p) : `/${p}`;
  }
  return "/v1/user/product";
}

/** `GET|PUT|DELETE` single resource: `/v1/user/product/{id}`. */
export function getUserProductItemPath(productId: string): string {
  const base = getUserProductCreatePath().replace(/\/$/, "");
  return `${base}/${encodeURIComponent(String(productId).trim())}`;
}

/** GET paginated list; override with VITE_USER_PRODUCT_PAGINATED_PATH. */
export function getUserProductPaginatedPath(): string {
  const p = import.meta.env.VITE_USER_PRODUCT_PAGINATED_PATH;
  if (p && String(p).trim() !== "") {
    return String(p).startsWith("/") ? String(p) : `/${p}`;
  }
  return "/v1/user/product/paginated";
}

/** e.g. `/v1/...?page=1&limit=8` (works with Vite proxy when base is empty). */
export function buildPathWithQuery(
  path: string,
  query: Record<string, string | number | boolean | undefined | null>,
): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) {
      continue;
    }
    q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `${clean}?${s}` : clean;
}

export function buildUrl(path: string): string {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (!base) {
    return cleanPath;
  }
  return `${base}${cleanPath}`;
}
