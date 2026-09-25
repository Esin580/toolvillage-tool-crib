"use client";
import type { User } from "@toolvillage/types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.error || !data?.data?.user) return null;
    return data.data.user as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const refresh = useCallback(async () => {
    // Only show global loading if we don't have a user yet
    const shouldShowLoading = !hasFetched.current || !user;
    if (shouldShowLoading) setLoading(true);

    const u = await fetchCurrentUser();
    setUser(u);
    setLoading(false);
    hasFetched.current = true;
  }, [user]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, refresh, logout }}
    >
      {user?.accountStatus === "banned" ? (
        <div className="fixed inset-0 z-[9999] bg-[#09090b] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full space-y-8 p-10 bg-[#121214] border border-red-500/20 rounded-3xl shadow-2xl shadow-red-500/5">
            <div className="mx-auto w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-3">
                Account Banned
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                Your account has been restricted from accessing ToolVillage due
                to a violation of our terms of service. If you believe this is a
                mistake, please contact support.
              </p>
              <button
                onClick={logout}
                className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98]"
              >
                Logout from Account
              </button>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
