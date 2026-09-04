import Link from "next/link";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Reveal } from "@/components/ui/Reveal";
import { getDisponibilitesMois } from "@/lib/disponibilites";

export async function AvailabilityPreview() {
  const now = new Date();
  let creneaux: Awaited<ReturnType<typeof getDisponibilitesMois>> = [];
  try {
    creneaux = (await getDisponibilitesMois(now.getFullYear(), now.getMonth() + 1))
      .filter((c) => c.estDisponible)
      .slice(0, 8);
  } catch {
    creneaux = [];
  }

  return (
    <section className="border-t border-line py-24">
      <div className="site-wrap">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-accent">Agenda</p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
                Prochains créneaux
              </h2>
            </div>
            <Link href="/reservation" className="btn-ghost">
              Voir le calendrier
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {creneaux.length === 0 ? (
            <p className="text-muted">Les disponibilités s&apos;afficheront dès que le calendrier sera ouvert.</p>
          ) : (
            creneaux.map((c) => (
              <Link
                key={`${c.date}-${c.heureDebut}`}
                href="/reservation"
                className="border border-line p-5 transition-transform duration-200 hover:scale-[1.02] hover:border-accent"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-muted">
                  {format(parseISO(c.date), "EEE d MMM", { locale: fr })}
                </p>
                <p className="mt-2 font-display text-2xl font-semibold">
                  {c.heureDebut}–{c.heureFin}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
