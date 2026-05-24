"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged,
  GoogleAuthProvider, FacebookAuthProvider, OAuthProvider, type User,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  redirectError: string;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectError, setRedirectError] = useState("");

  useEffect(() => {
    const auth = firebaseAuth();

    // Process any pending redirect result first.
    // We must not call setLoading(false) until this settles — otherwise onAuthStateChanged
    // fires with null before the redirect user is available, flashing the login page.
    let redirectSettled = false;
    const redirectDone = getRedirectResult(auth)
      .then((result) => {
        if (result?.user) setUser(result.user);
      })
      .catch((e: unknown) => {
        setRedirectError(e instanceof Error ? e.message : "Sign-in failed. Please try again.");
      })
      .finally(() => { redirectSettled = true; });

    const unsub = onAuthStateChanged(auth, (u) => {
      if (!redirectSettled) {
        // Defer until redirect result is known to avoid flashing the login page
        redirectDone.then(() => { setUser(u); setLoading(false); });
      } else {
        setUser(u);
        setLoading(false);
      }
    });

    return unsub;
  }, []);

  function signInWithGoogle() {
    return signInWithRedirect(firebaseAuth(), new GoogleAuthProvider());
  }
  function signInWithFacebook() {
    return signInWithRedirect(firebaseAuth(), new FacebookAuthProvider());
  }
  function signInWithMicrosoft() {
    return signInWithRedirect(firebaseAuth(), new OAuthProvider("microsoft.com"));
  }
  function logout() {
    return signOut(firebaseAuth());
  }

  return (
    <AuthContext.Provider value={{ user, loading, redirectError, signInWithGoogle, signInWithFacebook, signInWithMicrosoft, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
