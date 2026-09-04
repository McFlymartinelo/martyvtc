import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { tarifs } from "@/config/tarifs";

export const metadata: Metadata = { title: "Tarifs" };

export default function TarifsPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="site-wrap">
        <p className="text-xs uppercase tracking-[0.22em] text-accent">Tarifs</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold tracking-tight sm:text-7xl">
          Clair. Sans algorithme.
        </h1>
        <p className="mt-6 max-w-xl text-muted">{tarifs.mention}</p>

        <div className="mt-16 grid gap-px bg-line lg:grid-cols-3">
          {tarifs.courses.map((course, i) => (
            <Reveal key={course.id} delay={i * 0.08} className="scroll-mt-28 bg-ink p-8 sm:p-10" id={course.id}>
              <p className="text-xs uppercase tracking-[0.16em] text-muted">{course.unite}</p>
              <h2 className="mt-3 font-display text-3xl font-semibold">{course.nom}</h2>
              <p className="mt-6 font-display text-5xl font-semibold">
                {course.aPartirDe}€
              </p>
              <p className="mt-4 text-muted">{course.description}</p>
              <ul className="mt-8 space-y-2 text-sm text-paper">
                {course.details.map((d) => (
                  <li key={d}>— {d}</li>
                ))}
              </ul>
              <Link href={`/reservation?type=${course.id}`} className="mt-8 inline-block text-sm text-accent">
                Réserver →
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid gap-4 border border-line p-6 sm:grid-cols-3">
          {tarifs.extras.map((extra) => (
            <div key={extra.nom}>
              <p className="text-xs uppercase tracking-[0.16em] text-muted">{extra.nom}</p>
              <p className="mt-2 font-display text-xl">{extra.valeur}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <MagneticButton href="/reservation">Réserver un trajet</MagneticButton>
          <WhatsAppButton />
        </div>
      </div>
    </section>
  );
}
