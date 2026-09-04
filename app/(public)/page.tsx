import { AvailabilityPreview } from "@/components/home/AvailabilityPreview";
import { Hero } from "@/components/home/Hero";
import { Reviews } from "@/components/home/Reviews";
import { Services } from "@/components/home/Services";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Reveal } from "@/components/ui/Reveal";
import { brand } from "@/config/brand";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Reviews />
      <AvailabilityPreview />
      <section className="border-t border-line py-24">
        <Reveal className="site-wrap flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <h2 className="max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-6xl">
            Un trajet.
            <br />
            Un chauffeur.
            <br />
            <span className="text-accent">{brand.name}.</span>
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <MagneticButton href="/reservation">Réserver un trajet</MagneticButton>
            <WhatsAppButton />
          </div>
        </Reveal>
      </section>
    </>
  );
}
