import Link from "next/link";
import { brand } from "@/config/brand";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="site-wrap grid gap-10 py-16 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-semibold">{brand.name}</p>
          <p className="mt-3 max-w-xs text-sm text-muted">{brand.description}</p>
        </div>
        <div className="text-sm">
          <p className="label">Contact</p>
          <a href={`mailto:${brand.contact.email}`} className="block hover:text-accent">
            {brand.contact.email}
          </a>
          <a href={`tel:${brand.contact.telephone.replace(/\s/g, "")}`} className="block hover:text-accent">
            {brand.contact.telephone}
          </a>
          <p className="mt-2 text-muted">{brand.contact.zone}</p>
        </div>
        <div className="flex flex-col gap-3 text-sm uppercase tracking-[0.16em] text-muted">
          <Link href="/reservation" className="hover:text-accent">
            Réserver
          </Link>
          <Link href="/tarifs" className="hover:text-accent">
            Tarifs
          </Link>
          <Link href="/contact" className="hover:text-accent">
            Contact
          </Link>
          {brand.social.instagram && (
            <a href={brand.social.instagram} className="hover:text-accent" target="_blank" rel="noreferrer">
              Instagram
            </a>
          )}
        </div>
      </div>
      <div className="site-wrap flex flex-col gap-3 border-t border-line py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} {brand.legalName}</span>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/mentions-legales" className="hover:text-accent">
            Mentions légales
          </Link>
          <Link href="/cgv" className="hover:text-accent">
            CGV
          </Link>
          <Link href="/confidentialite" className="hover:text-accent">
            Confidentialité
          </Link>
        </div>
      </div>
    </footer>
  );
}
