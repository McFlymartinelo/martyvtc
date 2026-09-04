import { NextResponse } from "next/server";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { auth } from "@/auth";
import { brand } from "@/config/brand";
import { envoyerConfirmationReservation } from "@/lib/email";
import { creerReservation, ReservationError, toutesLesReservations } from "@/lib/reservations";
import { creerSessionCheckout } from "@/lib/stripe";
import { reservationSchema } from "@/lib/validations/reservation";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const reservations = await toutesLesReservations();
  return NextResponse.json({ reservations });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Connectez-vous pour réserver." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides." },
      { status: 400 },
    );
  }

  try {
    const reservation = await creerReservation(session.user.id, parsed.data);
    const dateLabel = format(reservation.dateHeure, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr });

    if (brand.paiementAvantCourse && process.env.STRIPE_SECRET_KEY) {
      const checkout = await creerSessionCheckout(reservation.id, session.user.email ?? reservation.user.email);
      if (!checkout.url) {
        return NextResponse.json({ error: "Impossible d'ouvrir le paiement." }, { status: 502 });
      }
      return NextResponse.json({ reservationId: reservation.id, checkoutUrl: checkout.url });
    }

    await envoyerConfirmationReservation({
      to: reservation.user.email,
      nom: reservation.user.name ?? "client",
      depart: reservation.depart,
      arrivee: reservation.arrivee,
      dateLabel,
      statut: "en attente de confirmation",
    });

    return NextResponse.json({
      reservationId: reservation.id,
      redirectUrl: `/reservation/confirmation?id=${reservation.id}`,
    });
  } catch (error) {
    if (error instanceof ReservationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la réservation." }, { status: 500 });
  }
}
