import { Reveal } from "@/components/ui/Reveal";

const avis = [
  {
    quote: "Ponctuel à la minute, voiture impeccable, zéro blabla. C'est exactement ce que je cherche.",
    name: "Camille R.",
    meta: "CDG → 8e",
  },
  {
    quote: "J'ai arrêté Uber après deux courses avec lui. Simple, humain, tarif clair.",
    name: "Julien M.",
    meta: "Soirée entreprise",
  },
  {
    quote: "Mise à disposition toute une journée client. Discret, toujours là au bon moment.",
    name: "Sofia K.",
    meta: "À la journée",
  },
];

export function Reviews() {
  return (
    <section className="border-t border-line py-24">
      <div className="site-wrap">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.22em] text-accent">Avis</p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
            On ne note pas.
            <br />
            On revient.
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {avis.map((a, i) => (
            <Reveal key={a.name} delay={i * 0.08}>
              <figure className="h-full border border-line p-8 transition-transform duration-200 hover:scale-[1.02]">
                <blockquote className="text-lg leading-relaxed">{a.quote}</blockquote>
                <figcaption className="mt-8 text-sm text-muted">
                  {a.name} · {a.meta}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
