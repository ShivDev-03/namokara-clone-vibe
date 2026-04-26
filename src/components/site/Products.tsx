import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import {
  PAGINATED_PAGE_SIZE,
  PRODUCTS_PAGINATED_QUERY_KEY,
  fetchProductsPaginated,
} from "@/lib/api/productApi";

const publicRange = (page: number, limit: number, total: number) => {
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  if (total === 0) {
    return "No products";
  }
  return `Showing ${from}–${to} of ${total}`;
};

export const Products = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: [...PRODUCTS_PAGINATED_QUERY_KEY, "public", { page, limit: PAGINATED_PAGE_SIZE }],
    queryFn: () =>
      fetchProductsPaginated({ page, limit: PAGINATED_PAGE_SIZE, requireAuth: false }),
  });

  const items = (data?.items ?? []).filter((p) => p.showInFrontend);
  const canPrev = page > 1;
  const canNext = data ? data.hasNext : false;
  const meta = data
    ? publicRange(data.page, data.limit, data.total)
    : null;

  return (
    <section id="products" className="relative py-20 md:py-32 bg-secondary/30 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      <div className="container relative">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-14 animate-fade-in-up">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-primary-glow mb-4">— Our Products</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-2 leading-tight">
              Browse our <span className="text-gradient">product range</span>
            </h2>
            {meta && (
              <p className="text-sm text-muted-foreground mt-3" aria-live="polite">
                {meta}
              </p>
            )}
          </div>
          <Button variant="outline" asChild className="group hover:border-primary-glow hover:text-primary-glow transition-all">
            <a href="#contact">View Complete Range <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" /></a>
          </Button>
        </div>

        {isError && (
          <div
            className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            role="alert"
          >
            <span>{error instanceof Error ? error.message : "Could not load products."}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        )}

        {isLoading && !isError && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: PAGINATED_PAGE_SIZE }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border overflow-hidden">
                <Skeleton className="aspect-square w-full rounded-none" />
                <div className="p-5 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No public products to show right now.</p>
        )}

        {!isLoading && !isError && items.length > 0 && (
          <>
            <div
              className={`grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${isFetching && !isLoading ? "opacity-80 transition-opacity" : ""}`}
            >
              {items.map((p, i) => (
                <article
                  key={p.id}
                  className="group relative bg-card border border-border rounded-2xl overflow-hidden hover-lift animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.06}s`, animationFillMode: "backwards" }}
                >
                  <div className="relative aspect-square bg-secondary overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-lg mb-3 group-hover:text-primary-glow transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                    <div className="mb-5 space-y-1.5">
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-5">
                        {p.description?.trim() ? p.description : "No description available."}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 group/btn" asChild>
                        <a href="#contact">Get Quote <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" /></a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href="#contact">View</a>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {(canPrev || canNext) && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!canPrev}
                  onClick={() => setPage((x) => Math.max(1, x - 1))}
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums px-2">
                  {data ? `Page ${data.page} / ${data.totalPages}` : ""}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!canNext}
                  onClick={() => setPage((x) => x + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
