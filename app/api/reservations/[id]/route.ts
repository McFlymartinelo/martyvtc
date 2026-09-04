import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const statuts = ["EN_ATTENTE", "CONFIRMEE", "TERMINEE", "ANNULEE"] as const;

const updateSchema = z.object({
  statut: z.enum(statuts),
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const reservation = await prisma.reservation.update({
    where: { id: params.id },
    data: { statut: parsed.data.statut },
  });

  return NextResponse.json({ reservation });
}
