import type { Metadata } from "next";
import { Suspense } from "react";
import { ConnexionForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Connexion" };

export default function ConnexionPage() {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.22em] text-accent">Connexion</p>
      <h2 className="mb-8 mt-3 font-display text-4xl font-semibold">Bon retour.</h2>
      <Suspense>
        <ConnexionForm />
      </Suspense>
    </>
  );
}
