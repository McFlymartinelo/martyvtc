import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Clients" };
export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { reservations: true } } },
  });

  return (
    <section className="site-wrap py-12">
      <h1 className="font-display text-4xl font-semibold">Clients</h1>
      <ul className="mt-8 divide-y divide-line border border-line">
        {clients.map((c) => (
          <li key={c.id} className="flex items-center justify-between p-5">
            <div>
              <p className="font-display text-xl">{c.name ?? "Sans nom"}</p>
              <p className="text-sm text-muted">
                {c.email}
                {c.telephone ? ` · ${c.telephone}` : ""}
              </p>
            </div>
            <p className="text-sm text-muted">{c._count.reservations} trajets</p>
          </li>
        ))}
        {clients.length === 0 && <li className="p-5 text-muted">Aucun client pour l&apos;instant.</li>}
      </ul>
    </section>
  );
}
