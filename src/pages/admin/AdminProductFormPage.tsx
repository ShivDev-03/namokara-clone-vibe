import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useId, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  createUserProduct,
  fileToDataUrl,
  findUserProductById,
  PRODUCT_BY_ID_QUERY_KEY,
  PRODUCTS_PAGINATED_QUERY_KEY,
  updateUserProduct,
} from "@/lib/api/productApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AdminProductListItem } from "@/types/adminProduct";

const MAX_FILE_BYTES = 20 * 1024 * 1024;

const buildProductFormSchema = (isEdit: boolean) =>
  z
    .object({
      title: z.string().min(1, "Title is required").max(200, "Max 200 characters"),
      description: z.string().max(5000, "Max 5000 characters").optional().default(""),
      price: z.coerce.number().min(0, "Price must be 0 or more").optional().default(0),
      showInFrontend: z.boolean(),
      image: z.custom<File | undefined>().optional(),
    })
    .superRefine((data, ctx) => {
      if (isEdit) {
        if (data.image instanceof File) {
          if (!data.image.type.startsWith("image/")) {
            ctx.addIssue({ code: "custom", path: ["image"], message: "File must be an image" });
          }
          if (data.image.size > MAX_FILE_BYTES) {
            ctx.addIssue({ code: "custom", path: ["image"], message: "Image must be 20MB or smaller" });
          }
        }
        return;
      }
      if (!data.image || !(data.image instanceof File) || data.image.size < 1) {
        ctx.addIssue({ code: "custom", path: ["image"], message: "Please upload a product image" });
        return;
      }
      if (!data.image.type.startsWith("image/")) {
        ctx.addIssue({ code: "custom", path: ["image"], message: "File must be an image" });
      }
      if (data.image.size > MAX_FILE_BYTES) {
        ctx.addIssue({ code: "custom", path: ["image"], message: "Image must be 20MB or smaller" });
      }
    });

type ProductFormValues = z.infer<ReturnType<typeof buildProductFormSchema>>;

const AdminProductFormPage = () => {
  const { id: productId } = useParams<{ id: string }>();
  const isEdit = Boolean(productId);
  const location = useLocation();
  const productFromList = (location.state as { product?: AdminProductListItem } | null)?.product;

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(productFromList?.imageUrl ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputId = useId();

  const schema = useMemo(() => buildProductFormSchema(isEdit), [isEdit]);

  const { data: productFetched, isLoading: isLoadingProduct, isError: isLoadError } = useQuery({
    queryKey: [...PRODUCT_BY_ID_QUERY_KEY, productId],
    queryFn: () => findUserProductById(productId!),
    enabled: isEdit && Boolean(productId) && !productFromList,
  });

  const product = useMemo(
    () => (isEdit ? (productFromList ?? productFetched ?? null) : null),
    [isEdit, productFromList, productFetched],
  );

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: productFromList?.title ?? "",
      description: productFromList?.description ?? "",
      price: productFromList?.price ?? 0,
      showInFrontend: productFromList?.showInFrontend ?? true,
      image: undefined,
    },
  });

  const imageFile = form.watch("image");

  useEffect(() => {
    if (imageFile instanceof File) {
      const url = URL.createObjectURL(imageFile);
      setFilePreview(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
    setFilePreview(null);
  }, [imageFile]);

  useEffect(() => {
    if (!isEdit || !product) {
      return;
    }
    form.reset({
      title: product.title,
      description: product.description,
      price: product.price,
      showInFrontend: product.showInFrontend,
      image: undefined,
    });
    setExistingImageUrl(product.imageUrl);
  }, [isEdit, product, form]);

  useEffect(() => {
    document.title = isEdit ? "Edit product | Admin | PWR" : "Add product | Admin | PWR";
  }, [isEdit]);

  const displayImageSrc = filePreview ?? existingImageUrl;

  const onSubmit = async (data: ProductFormValues) => {
    if (isEdit) {
      if (!productId) {
        return;
      }
      setIsSubmitting(true);
      try {
        await updateUserProduct(productId, {
          title: data.title,
          description: data.description ?? "",
          price: data.price ?? 0,
          showInFrontend: data.showInFrontend,
        });
        void queryClient.invalidateQueries({ queryKey: [...PRODUCTS_PAGINATED_QUERY_KEY] });
        void queryClient.invalidateQueries({ queryKey: [...PRODUCT_BY_ID_QUERY_KEY, productId] });
        toast.success("Product updated");
        navigate("/admin/products", { replace: true });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Could not update product";
        toast.error(msg);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!(data.image instanceof File)) {
      return;
    }
    setIsSubmitting(true);
    try {
      const image = await fileToDataUrl(data.image);
      await createUserProduct({
        image,
        title: data.title,
        description: data.description ?? "",
        price: data.price ?? 0,
        showInFrontend: data.showInFrontend,
      });
      void queryClient.invalidateQueries({ queryKey: [...PRODUCTS_PAGINATED_QUERY_KEY] });
      toast.success("Product created");
      form.reset({ title: "", description: "", price: 0, showInFrontend: true, image: undefined });
      navigate("/admin/products", { replace: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not create product";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit) {
    if (isLoadingProduct && !productFromList) {
      return (
        <div className="max-w-2xl mx-auto space-y-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/products" className="text-muted-foreground">
              ← All products
            </Link>
          </Button>
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">Loading product…</CardContent>
          </Card>
        </div>
      );
    }
    if (!product && (isLoadError || !isLoadingProduct)) {
      return (
        <div className="max-w-2xl mx-auto space-y-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/products" className="text-muted-foreground">
              ← All products
            </Link>
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>Product not found</CardTitle>
              <CardDescription>
                Open the product from the list (Edit), or the product was removed. Return to all products and try
                again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/admin/products">Back to all products</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4" key={isEdit ? (productId ?? "edit") : "new"}>
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin/products" className="text-muted-foreground">
            ← All products
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit product" : "Add product"}</CardTitle>
          <CardDescription>
            {isEdit
              ? "Updates title, description, price, and public visibility. Image is not changed by this form."
              : "Creates a product with image, title, description, price, and visibility. Sent as JSON to the API."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
              {!isEdit && (
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { onChange, onBlur, name, ref } }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row gap-3 items-start">
                            <Button type="button" variant="outline" asChild>
                              <label htmlFor={fileInputId} className="cursor-pointer inline-flex items-center gap-2">
                                <ImagePlus className="h-4 w-4" />
                                Choose file
                              </label>
                            </Button>
                            <input
                              id={fileInputId}
                              name={name}
                              ref={ref}
                              onBlur={onBlur}
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                onChange(f);
                              }}
                            />
                          </div>
                          <div
                            className={cn(
                              "relative rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center min-h-40 aspect-video max-w-md overflow-hidden",
                              filePreview && "border-primary/30",
                            )}
                          >
                            {filePreview ? (
                              <img src={filePreview} alt="" className="w-full h-full object-contain" />
                            ) : (
                              <p className="text-sm text-muted-foreground p-4 text-center">Preview appears here</p>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {isEdit && product && (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <div
                    className={cn(
                      "relative rounded-lg border border-border bg-muted/30 flex items-center justify-center min-h-40 aspect-video max-w-md overflow-hidden",
                    )}
                  >
                    {displayImageSrc ? (
                      <img src={displayImageSrc} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <p className="text-sm text-muted-foreground p-4 text-center">No image</p>
                    )}
                  </div>
                  <FormDescription>Replacing the image is not part of the current update API.</FormDescription>
                </FormItem>
              )}

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Rotary encoder — 1000 PPR" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Key specs, compatibility, and notes" className="min-h-32" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="0.01"
                        placeholder="0.00"
                        name={field.name}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        value={field.value === 0 ? "" : String(field.value)}
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v === "" ? 0 : Number(v));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showInFrontend"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show on site</FormLabel>
                      <FormDescription>When on, the product can appear on the public catalog.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? "Saving…" : "Creating…"}
                  </>
                ) : isEdit ? (
                  "Save changes"
                ) : (
                  "Save product"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductFormPage;
