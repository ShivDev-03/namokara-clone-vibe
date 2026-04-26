import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  deleteUserProduct,
  PAGINATED_PAGE_SIZE,
  PRODUCTS_PAGINATED_QUERY_KEY,
  PRODUCT_BY_ID_QUERY_KEY,
  fetchProductsPaginated,
} from "@/lib/api/productApi";
import { UnauthenticatedError } from "@/lib/api/apiClient";
import type { AdminProductListItem } from "@/types/adminProduct";

const formatInr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const AdminProductListPage = () => {
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AdminProductListItem | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey: [...PRODUCTS_PAGINATED_QUERY_KEY, "admin", { page, limit: PAGINATED_PAGE_SIZE }],
    queryFn: () =>
      fetchProductsPaginated({ page, limit: PAGINATED_PAGE_SIZE, requireAuth: true }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserProduct(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...PRODUCTS_PAGINATED_QUERY_KEY] });
      void queryClient.invalidateQueries({ queryKey: PRODUCT_BY_ID_QUERY_KEY });
      toast.success("Product deleted");
      setDeleteTarget(null);
    },
    onError: (e: Error) => {
      toast.error(e instanceof Error ? e.message : "Could not delete product");
    },
  });

  const products: AdminProductListItem[] = data?.items ?? [];
  const canPrev = page > 1;
  const canNext = data ? data.hasNext : false;
  const rangeLabel = data
    ? `Page ${data.page} of ${data.totalPages} · ${data.total} total`
    : null;

  useEffect(() => {
    document.title = "All products | Admin | PWR";
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">All products</h2>
          <p className="text-sm text-muted-foreground mt-1">Loaded from the paginated product API. Visibility shows whether the item appears on the public site.</p>
        </div>
        <Button asChild>
          <Link to="/admin/products/new" className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2 flex flex-row flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">Inventory</CardTitle>
            <CardDescription>Image, title, price, and public visibility.</CardDescription>
          </div>
          {rangeLabel && (
            <p className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
              {rangeLabel}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {isError && (
            <div
              className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              role="alert"
            >
              <span>
                {error instanceof UnauthenticatedError
                  ? "Sign in to load products."
                  : error instanceof Error
                    ? error.message
                    : "Could not load products."}
              </span>
              <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
                Retry
              </Button>
            </div>
          )}

          {isLoading && !isError && (
            <div className="space-y-3" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-12 w-16 shrink-0 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-full max-w-md" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !isError && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <ImageIcon className="h-10 w-10 opacity-50 mb-2" />
              <p>No products yet. Add a product to get started.</p>
            </div>
          )}

          {!isLoading && !isError && products.length > 0 && (
            <div className="rounded-md border border-border">
              <div className={isFetching && !isLoading ? "opacity-80 transition-opacity" : ""}>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-24">Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="w-[28%] hidden lg:table-cell">Description</TableHead>
                      <TableHead className="w-28 text-right">Price</TableHead>
                      <TableHead className="w-36">On public site</TableHead>
                      <TableHead className="w-[120px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="h-12 w-16 rounded overflow-hidden border border-border bg-muted/40 shrink-0">
                            <img
                              src={p.imageUrl}
                              alt=""
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium line-clamp-2">{p.title}</span>
                          <p className="text-xs text-muted-foreground mt-0.5 lg:hidden line-clamp-2">
                            {p.description}
                          </p>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="line-clamp-2 text-muted-foreground">{p.description}</span>
                        </TableCell>
                        <TableCell className="text-right font-medium tabular-nums whitespace-nowrap">
                          {formatInr(p.price)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={p.showInFrontend ? "default" : "secondary"}>
                            {p.showInFrontend ? "On public site" : "Not on site"}
                          </Badge>
                          <span className="sr-only">
                            {p.showInFrontend ? "On public site" : "Not on public site"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                              <Link
                                to={`/admin/products/${encodeURIComponent(p.id)}/edit`}
                                state={{ product: p }}
                                aria-label={`Edit ${p.title}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              aria-label={`Delete ${p.title}`}
                              onClick={() => setDeleteTarget(p)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {!isError && (products.length > 0 || (data && (canPrev || canNext))) && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <Button type="button" variant="outline" size="sm" disabled={!canPrev || isLoading} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                {data ? `Page ${data.page} / ${data.totalPages}` : ""}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!canNext || isLoading}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteTarget != null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `“${deleteTarget.title}” will be removed permanently. This cannot be undone.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteMutation.isPending || !deleteTarget}
              onClick={() => {
                if (deleteTarget) {
                  deleteMutation.mutate(deleteTarget.id);
                }
              }}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProductListPage;
