import { brand } from "@/config/brand";
import type { Quote } from "@/lib/quote";
import { formatEuros } from "@/lib/utils";

export function QuoteCard({ quote }: { quote: Quote }) {
  return (
    <aside className="border border-accent bg-ink p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-accent">Devis instantané</p>
      <p className="mt-2 font-display text-3xl font-semibold">{formatEuros(quote.totalCents)}</p>
      <p className="mt-1 text-sm text-muted">{quote.label}</p>
      <ul className="mt-4 space-y-1 text-xs text-muted">
        <li>Base {formatEuros(quote.baseCents)}</li>
        {quote.estNuit && <li>Supplément nuit {formatEuros(quote.supplementNuitCents)}</li>}
        {quote.siegeEnfantCents > 0 && <li>Siège enfant {formatEuros(quote.siegeEnfantCents)}</li>}
        {brand.acomptePourcent < 100 && (
          <>
            <li>Acompte en ligne ({brand.acomptePourcent}%) {formatEuros(quote.aReglerCents)}</li>
            <li>Solde au chauffeur {formatEuros(quote.totalCents - quote.aReglerCents)}</li>
          </>
        )}
      </ul>
      <p className="mt-4 text-xs text-muted">Prix confirmé à la réservation. Annulation gratuite jusqu&apos;à 4 h avant.</p>
    </aside>
  );
}
