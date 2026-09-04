import type { Metadata } from "next";
import { Suspense } from "react";
import { InscriptionForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Inscription" };

export default function InscriptionPage() {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.22em] text-accent">Inscription</p>
      <h2 className="mb-8 mt-3 font-display text-4xl font-semibold">Créer un accès.</h2>
      <Suspense>
        <InscriptionForm />
      </Suspense>
    </>
  );
}
