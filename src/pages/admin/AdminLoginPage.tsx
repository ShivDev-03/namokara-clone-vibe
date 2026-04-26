import { useEffect, useLayoutEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSignInForm } from "@/components/admin/AdminSignInForm";
import { clearDeadClientSessionIfNeeded } from "@/lib/auth/clientSession";
import { selectIsAuthenticated, useAuthStore } from "@/stores/authStore";

const AdminLoginPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const authed = useAuthStore(selectIsAuthenticated);

  const queryString = searchParams.toString();
  useLayoutEffect(() => {
    const sp = new URLSearchParams(queryString);
    if (sp.get("signout") === "1" || sp.get("logout") === "1") {
      useAuthStore.getState().logout();
      sp.delete("signout");
      sp.delete("logout");
      setSearchParams(sp, { replace: true });
      return;
    }
    if (clearDeadClientSessionIfNeeded()) {
      useAuthStore.getState().bumpSession();
    }
  }, [queryString, setSearchParams]);

  useEffect(() => {
    document.title = "Admin sign in | PWR";
  }, []);

  useEffect(() => {
    if (authed) {
      navigate("/admin", { replace: true });
    }
  }, [authed, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-secondary/50 to-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight">Admin sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">PWR internal access</p>
        </div>
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminSignInForm />
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/" className="text-primary-glow hover:underline">
            Back to site
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
