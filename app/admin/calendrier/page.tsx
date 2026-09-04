import type { Metadata } from "next";
import { AvailabilityManager } from "@/components/admin/AvailabilityManager";
import { getDisponibilitesMois } from "@/lib/disponibilites";

export const metadata: Metadata = { title: "Calendrier admin" };
export const dynamic = "force-dynamic";

export default async function AdminCalendrierPage() {
  const now = new Date();
  const creneaux = await getDisponibilitesMois(now.getFullYear(), now.getMonth() + 1);

  return (
    <section className="site-wrap py-12">
      <h1 className="font-display text-4xl font-semibold">Calendrier</h1>
      <p className="mt-3 text-muted">Ouvrez ou fermez des journées et des plages horaires.</p>
      <div className="mt-10">
        <AvailabilityManager initial={creneaux} />
      </div>
    </section>
  );
}
