import type { Metadata } from "next";
import { ReservationTable } from "@/components/admin/ReservationTable";
import { toutesLesReservations } from "@/lib/reservations";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const reservations = await toutesLesReservations();

  return (
    <section className="site-wrap py-12">
      <h1 className="font-display text-4xl font-semibold">Réservations</h1>
      <div className="mt-8">
        <ReservationTable
          reservations={reservations.map((r) => ({
            ...r,
            dateHeure: r.dateHeure.toISOString(),
          }))}
        />
      </div>
    </section>
  );
}
