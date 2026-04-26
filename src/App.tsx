import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminLayout } from "./components/admin/AdminLayout.tsx";
import { RequireAuth } from "./components/admin/RequireAuth.tsx";
import { AuthBootstrap } from "./components/AuthBootstrap.tsx";
import AdminLoginPage from "./pages/admin/AdminLoginPage.tsx";
import AdminProductFormPage from "./pages/admin/AdminProductFormPage.tsx";
import AdminProductListPage from "./pages/admin/AdminProductListPage.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthBootstrap />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<Outlet />}>
              <Route index element={<AdminProductListPage />} />
              <Route path="new" element={<AdminProductFormPage />} />
              <Route path=":id/edit" element={<AdminProductFormPage />} />
            </Route>
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
