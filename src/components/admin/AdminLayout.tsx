import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { List, LogOut, Menu, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";

const nav = [
  { to: "products", label: "All products", icon: List, end: true },
  { to: "products/new", label: "Add product", icon: Plus, end: true },
] as const;

const sidebarLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-primary/10 text-foreground border border-primary/20"
      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
  );

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const userEmail = useAuthStore((s) => s.userEmail);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.title = "Admin | PWR";
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed z-50 inset-y-0 left-0 w-64 border-r border-border bg-card flex flex-col transition-transform duration-200 md:translate-x-0 md:static md:z-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link to="/admin" className="font-display font-bold text-lg">
            Admin
          </Link>
          <Button type="button" variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} className={sidebarLinkClass} end={end}>
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-2">
          {userEmail && <p className="text-xs text-muted-foreground truncate px-1">{userEmail}</p>}
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => {
              logout();
              navigate("/admin/login", { replace: true });
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border flex items-center justify-between gap-2 px-4 bg-card/50">
          <div className="flex items-center gap-2 min-w-0">
            <Button type="button" variant="ghost" size="icon" className="md:hidden shrink-0" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-display text-lg font-semibold truncate">Control panel</h1>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0">
            View site
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
