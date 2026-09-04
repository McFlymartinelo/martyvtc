"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { connexionSchema, inscriptionSchema, type ConnexionInput, type InscriptionInput } from "@/lib/validations/auth";
import { hasGoogleAuth } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function ConnexionForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/compte";
  const [error, setError] = useState<string>();
  const form = useForm<ConnexionInput>({
    resolver: zodResolver(connexionSchema),
    defaultValues: { email: "", motDePasse: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(undefined);
    const res = await signIn("credentials", { ...values, redirect: false });
    if (res?.error) {
      setError("E-mail ou mot de passe incorrect.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div>
        <label htmlFor="email" className="label">E-mail</label>
        <input id="email" type="email" className="field" autoComplete="email" {...form.register("email")} />
      </div>
      <div>
        <label htmlFor="motDePasse" className="label">Mot de passe</label>
        <input id="motDePasse" type="password" className="field" autoComplete="current-password" {...form.register("motDePasse")} />
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <MagneticButton type="submit">Entrer</MagneticButton>
      {hasGoogleAuth() && (
        <button type="button" className="btn-ghost" onClick={() => signIn("google", { callbackUrl })}>
          Continuer avec Google
        </button>
      )}
      <p className="text-sm text-muted">
        Pas encore de compte ? <Link href={`/inscription?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-accent">Créer un accès</Link>
      </p>
    </form>
  );
}

export function InscriptionForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/compte";
  const [error, setError] = useState<string>();
  const form = useForm<InscriptionInput>({
    resolver: zodResolver(inscriptionSchema),
    defaultValues: { nom: "", email: "", telephone: "", motDePasse: "", confirmation: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(undefined);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Inscription impossible.");
      return;
    }
    const login = await signIn("credentials", {
      email: values.email,
      motDePasse: values.motDePasse,
      redirect: false,
    });
    if (login?.error) {
      router.push("/connexion");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div>
        <label htmlFor="nom" className="label">Nom</label>
        <input id="nom" className="field" autoComplete="name" {...form.register("nom")} />
        {form.formState.errors.nom && <p className="mt-2 text-sm text-danger">{form.formState.errors.nom.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="label">E-mail</label>
        <input id="email" type="email" className="field" autoComplete="email" {...form.register("email")} />
        {form.formState.errors.email && <p className="mt-2 text-sm text-danger">{form.formState.errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="telephone" className="label">Téléphone</label>
        <input id="telephone" className="field" autoComplete="tel" {...form.register("telephone")} />
      </div>
      <div>
        <label htmlFor="motDePasse" className="label">Mot de passe</label>
        <input id="motDePasse" type="password" className="field" autoComplete="new-password" {...form.register("motDePasse")} />
        {form.formState.errors.motDePasse && <p className="mt-2 text-sm text-danger">{form.formState.errors.motDePasse.message}</p>}
      </div>
      <div>
        <label htmlFor="confirmation" className="label">Confirmation</label>
        <input id="confirmation" type="password" className="field" autoComplete="new-password" {...form.register("confirmation")} />
        {form.formState.errors.confirmation && <p className="mt-2 text-sm text-danger">{form.formState.errors.confirmation.message}</p>}
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <MagneticButton type="submit">Créer le compte</MagneticButton>
      <p className="text-sm text-muted">
        Déjà client ? <Link href="/connexion" className="text-accent">Connexion</Link>
      </p>
    </form>
  );
}
