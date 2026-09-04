import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { jourUtc } from "@/lib/dates";
import { getDisponibilitesMois } from "@/lib/disponibilites";
import { disponibiliteSchema } from "@/lib/validations/disponibilite";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const now = new Date();
  const annee = Number(searchParams.get("annee") ?? now.getFullYear());
  const mois = Number(searchParams.get("mois") ?? now.getMonth() + 1);

  if (!annee || !mois || mois < 1 || mois > 12) {
    return NextResponse.json({ error: "Mois invalide." }, { status: 400 });
  }

  try {
    const creneaux = await getDisponibilitesMois(annee, mois);
    return NextResponse.json({ creneaux });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ creneaux: [], offline: true });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = disponibiliteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides." },
      { status: 400 },
    );
  }

  const creneau = await prisma.disponibilite.upsert({
    where: {
      date_heureDebut_heureFin: {
        date: jourUtc(parsed.data.date),
        heureDebut: parsed.data.heureDebut,
        heureFin: parsed.data.heureFin,
      },
    },
    create: {
      date: jourUtc(parsed.data.date),
      heureDebut: parsed.data.heureDebut,
      heureFin: parsed.data.heureFin,
      estDisponible: parsed.data.estDisponible,
    },
    update: { estDisponible: parsed.data.estDisponible },
  });

  return NextResponse.json({ creneau }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Identifiant manquant." }, { status: 400 });
  }

  await prisma.disponibilite.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
