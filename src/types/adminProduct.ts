/** Shape for the admin product list. Align your GET /products response to this (or map in a hook). */
export type AdminProductListItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  /** If true, product is shown on the public site catalog. */
  showInFrontend: boolean;
  /** Thumbnail for table (URL from API or uploaded asset). */
  imageUrl: string;
};
