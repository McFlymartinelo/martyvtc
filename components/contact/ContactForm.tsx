"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { nom: "", email: "", telephone: "", message: "", consentement: undefined, societe: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(undefined);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Envoi impossible.");
      return;
    }
    setSent(true);
    form.reset();
  });

  if (sent) {
    return <p className="border border-accent p-6 text-accent">Message reçu. Je vous réponds rapidement.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        {...form.register("societe")}
      />
      <div>
        <label htmlFor="nom" className="label">Nom</label>
        <input id="nom" className="field" {...form.register("nom")} />
        {form.formState.errors.nom && <p className="mt-2 text-sm text-danger">{form.formState.errors.nom.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="label">E-mail</label>
        <input id="email" type="email" className="field" {...form.register("email")} />
        {form.formState.errors.email && <p className="mt-2 text-sm text-danger">{form.formState.errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="telephone" className="label">Téléphone</label>
        <input id="telephone" className="field" {...form.register("telephone")} />
      </div>
      <div>
        <label htmlFor="message" className="label">Message</label>
        <textarea id="message" rows={5} className="field" {...form.register("message")} />
        {form.formState.errors.message && <p className="mt-2 text-sm text-danger">{form.formState.errors.message.message}</p>}
      </div>
      <label className="flex items-start gap-3 border border-line p-4 text-sm">
        <input type="checkbox" className="mt-1" {...form.register("consentement")} />
        <span>
          J&apos;accepte que ces informations soient utilisées pour me recontacter, conformément à la{" "}
          <Link href="/confidentialite" className="text-accent hover:underline">
            politique de confidentialité
          </Link>
          .
        </span>
      </label>
      {form.formState.errors.consentement && (
        <p className="text-sm text-danger">{form.formState.errors.consentement.message}</p>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
      <MagneticButton type="submit">Envoyer</MagneticButton>
    </form>
  );
}
