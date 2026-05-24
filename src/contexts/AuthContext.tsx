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
    let mounted = true;
    let unsub: (() => void) | null = null;

    // Process any pending redirect FIRST, then read auth.currentUser as the
    // definitive state. Only after that do we subscribe to onAuthStateChanged
    // so there is no race between redirect processing and the initial null fire.
    getRedirectResult(auth)
      .then((result) => {
        if (!mounted) return;
        if (result?.user) setUser(result.user);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setRedirectError(e instanceof Error ? e.message : "Sign-in failed. Please try again.");
      })
      .finally(() => {
        if (!mounted) return;
        // auth.currentUser is now settled (redirect processed or no redirect pending)
        setUser(auth.currentUser);
        setLoading(false);
        // Subscribe for future sign-in / sign-out events
        unsub = onAuthStateChanged(auth, (u) => {
          setUser(u);
          setLoading(false);
        });
      });

    return () => {
      mounted = false;
      unsub?.();
    };
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
