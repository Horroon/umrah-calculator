"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  signInWithPopup, signOut, onAuthStateChanged,
  GoogleAuthProvider, FacebookAuthProvider, OAuthProvider, type User,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth(), (u) => { setUser(u); setLoading(false); });
    return unsub;
  }, []);

  async function signInWithGoogle() {
    await signInWithPopup(firebaseAuth(), new GoogleAuthProvider());
  }
  async function signInWithFacebook() {
    await signInWithPopup(firebaseAuth(), new FacebookAuthProvider());
  }
  async function signInWithMicrosoft() {
    await signInWithPopup(firebaseAuth(), new OAuthProvider("microsoft.com"));
  }
  async function logout() {
    await signOut(firebaseAuth());
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithFacebook, signInWithMicrosoft, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
