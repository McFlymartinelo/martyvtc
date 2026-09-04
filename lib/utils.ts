import { brand } from "@/config/brand";
import { tarifs } from "@/config/tarifs";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatEuros(cents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function siteUrl() {
  return process.env.NEXTAUTH_URL ?? process.env.AUTH_URL ?? "http://localhost:3000";
}

export function montantReservationCents() {
  return Math.round((tarifs.prixReservationDefautCents * brand.acomptePourcent) / 100);
}

export function hasGoogleAuth() {
  return Boolean(
    (process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) &&
      (process.env.GOOGLE_CLIENT_SECRET || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID),
  );
}
