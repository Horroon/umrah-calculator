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
  signInWithGoogle: () => Promise<unknown>;
  signInWithFacebook: () => Promise<unknown>;
  signInWithMicrosoft: () => Promise<unknown>;
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

  // Non-async so signInWithPopup is called in the same synchronous frame as the user click.
  // Async wrappers add microtask boundaries that can clear the browser's user-gesture flag.
  function signInWithGoogle() {
    return signInWithPopup(firebaseAuth(), new GoogleAuthProvider());
  }
  function signInWithFacebook() {
    return signInWithPopup(firebaseAuth(), new FacebookAuthProvider());
  }
  function signInWithMicrosoft() {
    return signInWithPopup(firebaseAuth(), new OAuthProvider("microsoft.com"));
  }
  function logout() {
    return signOut(firebaseAuth());
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
