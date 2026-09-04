import { AvailabilityPreview } from "@/components/home/AvailabilityPreview";
import { Hero } from "@/components/home/Hero";
import { Reviews } from "@/components/home/Reviews";
import { Services } from "@/components/home/Services";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Reveal } from "@/components/ui/Reveal";
import { brand } from "@/config/brand";
import { getHomeStats } from "@/lib/stats";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const stats = await getHomeStats();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: brand.legalName,
    description: brand.description,
    url: siteUrl(),
    telephone: brand.contact.telephone,
    email: brand.contact.email,
    areaServed: brand.contact.zone,
    address: { "@type": "PostalAddress", addressLocality: brand.contact.ville, addressCountry: "FR" },
    ...(brand.stats.trajets > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: stats.note,
        reviewCount: stats.trajets,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero stats={stats} />
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
