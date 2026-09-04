import { Reveal } from "@/components/ui/Reveal";

const items = [
  {
    index: "01",
    title: "Ponctualité",
    text: "Je pars en avance. Vous n'attendez pas. Le vol, le train, le dîner : on calcule large.",
  },
  {
    index: "02",
    title: "Confort",
    text: "Véhicule premium, silence, climat, chargeurs. Vous travaillez, vous dormez, vous arrivez.",
  },
  {
    index: "03",
    title: "Discrétion",
    text: "Pas de bavardage forcé. Pas de notation. Un professionnel, pas une plateforme.",
  },
];

export function Services() {
  return (
    <section className="border-t border-line py-24">
      <div className="site-wrap">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.22em] text-accent">Le service</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-6xl">
            Trois choses. Rien d&apos;autre.
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-px bg-line md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08} className="bg-ink p-8 sm:p-10">
              <p className="text-xs text-accent">{item.index}</p>
              <h3 className="mt-6 font-display text-3xl font-semibold">{item.title}</h3>
              <p className="mt-4 text-muted">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
