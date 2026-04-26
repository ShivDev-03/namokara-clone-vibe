import { useEffect } from "react";
import { initAuthFromCookies } from "@/lib/auth/bootstrapAuth";
import { useAuthStore } from "@/stores/authStore";

/**
 * Restores the session from cookies (or exchanges refresh) after Zustand rehydrates,
 * so stale persisted fields are not read before `merge` runs.
 */
export const AuthBootstrap = () => {
  useEffect(() => {
    const run = () => void initAuthFromCookies();
    if (useAuthStore.persist.hasHydrated()) {
      run();
      return;
    }
    const unsub = useAuthStore.persist.onFinishHydration((s) => {
      if (s) run();
      unsub();
    });
    return () => unsub();
  }, []);
  return null;
};
