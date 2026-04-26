/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base API URL, no trailing slash (e.g. http://localhost:3000) */
  readonly VITE_API_BASE_URL?: string;
  /** User login path, leading slash (default: /v1/user/auth/login) */
  readonly VITE_USER_LOGIN_PATH?: string;
  /** User refresh path, leading slash (default: /v1/user/auth/refresh) */
  readonly VITE_USER_REFRESH_PATH?: string;
  /** Create product path, leading slash (default: /v1/user/product) */
  readonly VITE_USER_PRODUCT_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
