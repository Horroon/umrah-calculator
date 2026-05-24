"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

// dynamic + ssr:false keeps firebase/auth out of the server bundle entirely.
// This is the only place allowed to use ssr:false (must be inside a Client Component).
const AuthProvider = dynamic(
  () => import("@/contexts/AuthContext").then((m) => ({ default: m.AuthProvider })),
  { ssr: false }
);

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
