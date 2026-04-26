import { userAuthRefresh } from "@/lib/api/authApi";
import { useAuthStore } from "@/stores/authStore";
import { clearDeadClientSessionIfNeeded } from "./clientSession";
import { clearAuthTokens, getAccessToken, getRefreshToken } from "./tokenStorage";

/**
 * On app load: if access cookie exists, bump the session so the UI re-renders;
 * if only refresh exists, exchange it for a new access token; otherwise keep logged-out state.
 */
export async function initAuthFromCookies(): Promise<void> {
  if (clearDeadClientSessionIfNeeded()) {
    useAuthStore.getState().bumpSession();
  }
  if (getAccessToken()) {
    useAuthStore.getState().bumpSession();
    return;
  }
  const rt = getRefreshToken();
  if (rt) {
    try {
      await userAuthRefresh(rt);
      useAuthStore.getState().bumpSession();
    } catch {
      clearAuthTokens();
      useAuthStore.getState().logout();
    }
    return;
  }
  if (!getAccessToken() && !getRefreshToken()) {
    const { userEmail, serverSession } = useAuthStore.getState();
    if (userEmail || serverSession) {
      useAuthStore.setState({ userEmail: null, serverSession: false });
    }
  }
}
