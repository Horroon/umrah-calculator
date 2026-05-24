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

    // Must be called on every mount to complete any pending redirect sign-in.
    // We capture the promise so onAuthStateChanged can wait for it before resolving state.
    let redirectProcessing = true;
    const redirectDone = getRedirectResult(auth)
      .then((result) => {
        if (result?.user) setUser(result.user);
      })
      .catch((e: unknown) => {
        setRedirectError(e instanceof Error ? e.message : "Sign-in failed. Please try again.");
      })
      .finally(() => { redirectProcessing = false; });

    const unsub = onAuthStateChanged(auth, (u) => {
      if (redirectProcessing) {
        // Redirect not yet resolved — defer and use auth.currentUser (not the stale `u`)
        // to avoid overwriting the redirect user with an earlier null snapshot.
        redirectDone.then(() => {
          setUser(auth.currentUser);
          setLoading(false);
        });
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
