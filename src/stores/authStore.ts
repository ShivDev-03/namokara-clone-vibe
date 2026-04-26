import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { userAuthLogin } from "@/lib/api/authApi";
import { isClientAuthenticatedForUi } from "@/lib/auth/clientSession";
import { clearAuthTokens, setAuthTokens } from "@/lib/auth/tokenStorage";

type AuthState = {
  userEmail: string | null;
  serverSession: boolean;
  isLoading: boolean;
  /**
   * Increment when cookies change so selectors that read tokens re-compute in React.
   */
  authVersion: number;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  bumpSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userEmail: null,
      serverSession: false,
      isLoading: false,
      authVersion: 0,

      bumpSession: () => set((s) => ({ authVersion: s.authVersion + 1 })),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const result = await userAuthLogin({
            email,
            password,
            deviceToken: "",
          });
          if (result.accessToken) {
            setAuthTokens(result.accessToken, result.refreshToken);
          } else {
            setAuthTokens("", null);
          }
          set({
            userEmail: result.userEmail,
            serverSession: result.serverSession,
            isLoading: false,
            authVersion: get().authVersion + 1,
          });
        } catch (e) {
          set({ isLoading: false });
          throw e;
        }
      },

      logout: () => {
        clearAuthTokens();
        set((s) => ({
          userEmail: null,
          serverSession: false,
          authVersion: s.authVersion + 1,
        }));
      },
    }),
    {
      name: "pwr-auth",
      storage: createJSONStorage(() => localStorage),
      /** Only cache display fields — session truth comes from cookies, not from persisted flags. */
      partialize: (s) => ({
        userEmail: s.userEmail,
      }),
      version: 1,
      migrate: (persisted, fromVersion) => {
        if (fromVersion === 0 && persisted && typeof persisted === "object" && "serverSession" in persisted) {
          const p = persisted as { userEmail?: string | null; serverSession?: boolean };
          return { userEmail: p.userEmail ?? null };
        }
        return persisted;
      },
      /** Never rehydrate legacy `serverSession: true` without cookies — that hid the /admin form. */
      merge: (persisted, current) => ({
        ...current,
        ...(persisted && typeof persisted === "object" ? persisted : {}),
        serverSession: false,
      }),
    },
  ),
);

/**
 * "Signed in" for admin UI: valid refresh, or non-expired (JWT) / opaque access — not any random cookie value.
 */
export function selectIsAuthenticated(state: AuthState): boolean {
  void state.authVersion;
  void state.userEmail;
  return isClientAuthenticatedForUi();
}
