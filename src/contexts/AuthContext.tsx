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
    // Pick up the result (or error) after returning from the provider redirect.
    getRedirectResult(firebaseAuth()).catch((e: unknown) => {
      setRedirectError(e instanceof Error ? e.message : "Sign-in failed. Please try again.");
    });
    const unsub = onAuthStateChanged(firebaseAuth(), (u) => { setUser(u); setLoading(false); });
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
