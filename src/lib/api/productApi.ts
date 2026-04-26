import { apiJson } from "./apiClient";
import { buildPathWithQuery, getUserProductCreatePath, getUserProductItemPath, getUserProductPaginatedPath } from "./config";
import type { AdminProductListItem } from "@/types/adminProduct";

export type CreateUserProductBody = {
  /** `data:image/...;base64,...` */
  image: string;
  title: string;
  description: string;
  price: number;
  showInFrontend: boolean;
};

export type UpdateUserProductBody = {
  title: string;
  description: string;
  price: number;
  showInFrontend: boolean;
};

const PLACEHOLDER_IMAGE = "/placeholder.svg";

function isRecord(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}

function toNumber(v: unknown, fallback: number): number {
  if (typeof v === "number" && !Number.isNaN(v)) {
    return v;
  }
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) {
    return Number(v);
  }
  return fallback;
}

function toBool(v: unknown, fallback: boolean): boolean {
  if (typeof v === "boolean") {
    return v;
  }
  if (v === "true" || v === 1) {
    return true;
  }
  if (v === "false" || v === 0) {
    return false;
  }
  return fallback;
}

/** First non-empty string from possible API field names. */
function firstNonEmptyString(...candidates: unknown[]): string {
  for (const c of candidates) {
    if (typeof c === "string" && c.trim() !== "") {
      return c.trim();
    }
  }
  return "";
}

/**
 * Unwraps API envelope: `{ data: ... }` (and optional `data.data` array).
 * Also reads pagination meta from common shapes.
 */
function extractPaginatedPayload(
  body: unknown,
  requestedPage: number,
  requestedLimit: number,
): { items: unknown[]; page: number; limit: number; total: number; totalPages: number; hasNext: boolean } {
  const root = body;
  let layer: unknown = root;
  if (isRecord(root) && "data" in root) {
    layer = root.data;
  }

  let items: unknown[] = [];
  if (Array.isArray(layer)) {
    items = layer;
  } else if (isRecord(layer)) {
    for (const k of ["items", "results", "docs", "products", "documents", "data", "rows", "list"] as const) {
      const v = layer[k];
      if (Array.isArray(v)) {
        items = v;
        break;
      }
    }
  }

  let page = requestedPage;
  let limit = requestedLimit;
  let total = 0;
  let totalPages = 1;

  let metaSource: Record<string, unknown> | null = null;
  if (isRecord(layer)) {
    if (isRecord(layer.meta)) {
      metaSource = layer.meta;
    } else if (isRecord(layer.pagination)) {
      metaSource = layer.pagination;
    } else {
      metaSource = layer;
    }
  }

  if (metaSource) {
    const p = toNumber(
      metaSource.page ?? metaSource.currentPage ?? metaSource.current ?? metaSource.pageIndex,
      requestedPage,
    );
    if (p >= 1) {
      page = p;
    }
    const l = toNumber(
      metaSource.limit ?? metaSource.pageSize ?? metaSource.perPage ?? metaSource.size,
      requestedLimit,
    );
    if (l >= 1) {
      limit = l;
    }
    const t = metaSource.total ?? metaSource.totalCount ?? metaSource.totalDocs ?? metaSource.count;
    if (t !== undefined && t !== null) {
      total = toNumber(t, 0);
    }
    const tp = metaSource.totalPages ?? metaSource.pages;
    if (tp !== undefined && tp !== null) {
      totalPages = Math.max(1, toNumber(tp, 1));
    }
  }

  if (total > 0 && (totalPages <= 1 || !Number.isFinite(totalPages)) && limit > 0) {
    totalPages = Math.max(1, Math.ceil(total / limit));
  }

  if (total === 0) {
    if (items.length < limit) {
      total = (page - 1) * limit + items.length;
      totalPages = Math.max(1, page);
    } else {
      total = page * limit;
      totalPages = page + 1;
    }
  } else if (totalPages <= 0) {
    totalPages = Math.max(1, Math.ceil(total / (limit || requestedLimit || 1)));
  }

  const hasNext = page < totalPages;

  return { items, page, limit, total, totalPages, hasNext };
}

function mapApiProductToListItem(raw: unknown, index: number): AdminProductListItem {
  if (!isRecord(raw)) {
    return {
      id: `row-${index}`,
      title: "Product",
      description: "",
      price: 0,
      showInFrontend: true,
      imageUrl: PLACEHOLDER_IMAGE,
    };
  }
  const id = String(raw._id ?? raw.id ?? `product-${index}`);
  const title = String(raw.title ?? raw.name ?? "Untitled");
  const description = firstNonEmptyString(
    raw.description,
    raw.desc,
    raw.summary,
    raw.content,
    raw.details,
    raw.body,
    raw.longDescription,
    raw.shortDescription,
    raw.about,
  );
  const price = toNumber(raw.price, 0);
  const showInFrontend = toBool(raw.showInFrontend, true);
  const imageCandidate = raw.imageUrl ?? raw.image ?? raw.thumbnailUrl ?? raw.thumbnail ?? raw.photo;
  const imageUrl =
    typeof imageCandidate === "string" && imageCandidate.trim() !== "" ? imageCandidate : PLACEHOLDER_IMAGE;

  return { id, title, description, price, showInFrontend, imageUrl };
}

export const PAGINATED_PAGE_SIZE = 8;

export type ProductsPaginatedResult = {
  items: AdminProductListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
};

export type FetchProductsPaginatedParams = {
  page: number;
  limit?: number;
  requireAuth: boolean;
};

/**
 * React Query key prefix — invalidate with `['products', 'paginated']` after mutations.
 */
export const PRODUCTS_PAGINATED_QUERY_KEY = ["products", "paginated"] as const;

/**
 * GET `/v1/user/product/paginated?page=&limit=`.
 * Admin: `requireAuth: true` (Bearer). Public catalog: `requireAuth: false` (no Authorization header).
 */
export async function fetchProductsPaginated(params: FetchProductsPaginatedParams): Promise<ProductsPaginatedResult> {
  const { page, requireAuth } = params;
  const limit = params.limit ?? PAGINATED_PAGE_SIZE;
  const path = buildPathWithQuery(getUserProductPaginatedPath(), { page, limit });
  const body = await apiJson<unknown>(path, { method: "GET" }, { requireAuth });
  assertApiSuccess(body);
  const { items: rawItems, page: p, limit: l, total, totalPages, hasNext } = extractPaginatedPayload(
    body,
    page,
    limit,
  );
  return {
    items: rawItems.map((row, i) => mapApiProductToListItem(row, i)),
    page: p,
    limit: l,
    total,
    totalPages,
    hasNext,
  };
}

export const PRODUCT_BY_ID_QUERY_KEY = ["product", "byId"] as const;

/**
 * Walks paginated pages (auth) until the product id is found. Used for edit when `location.state`
 * did not pass the list row.
 */
export async function findUserProductById(productId: string): Promise<AdminProductListItem | null> {
  const id = String(productId);
  const maxPageScan = 50;
  let page = 1;
  while (page <= maxPageScan) {
    const r = await fetchProductsPaginated({ page, limit: PAGINATED_PAGE_SIZE, requireAuth: true });
    const found = r.items.find((p) => p.id === id);
    if (found) {
      return found;
    }
    if (!r.hasNext) {
      break;
    }
    page += 1;
  }
  return null;
}

/**
 * If the body includes `status` and it is not "Success", throw (aligns with login API style).
 */
function assertApiSuccess(data: unknown): void {
  if (!isRecord(data) || data.status == null) {
    return;
  }
  if (String(data.status).toLowerCase() === "success") {
    return;
  }
  const msg = typeof data.message === "string" && data.message ? data.message : "Request was not successful";
  throw new Error(msg);
}

/**
 * Read a file as a data URL suitable for the product API.
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      if (typeof r === "string") {
        resolve(r);
      } else {
        reject(new Error("Invalid file read result"));
      }
    };
    reader.onerror = () => reject(new Error("Could not read the image file"));
    reader.readAsDataURL(file);
  });
}

/**
 * POST /v1/user/product with JSON: `{ image, title, description, price, showInFrontend }`.
 * Uses `Authorization: Bearer` via `apiFetch`.
 */
export async function createUserProduct(body: CreateUserProductBody): Promise<unknown> {
  const data = await apiJson<unknown>(getUserProductCreatePath(), {
    method: "POST",
    body: JSON.stringify(body),
  });
  assertApiSuccess(data);
  return data;
}

/**
 * PUT `/v1/user/product/{id}` with JSON: `{ title, description, price, showInFrontend }`.
 */
export async function updateUserProduct(
  productId: string,
  body: UpdateUserProductBody,
): Promise<unknown> {
  const path = getUserProductItemPath(productId);
  const data = await apiJson<unknown>(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  assertApiSuccess(data);
  return data;
}

/**
 * DELETE `/v1/user/product/{id}`.
 */
export async function deleteUserProduct(productId: string): Promise<unknown> {
  const path = getUserProductItemPath(productId);
  const data = await apiJson<unknown>(path, { method: "DELETE" });
  assertApiSuccess(data);
  return data;
}
