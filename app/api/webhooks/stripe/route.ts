import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { envoyerRecuPaiement } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook non configuré." }, { status: 500 });
  }

  const body = await request.text();
  const signature = headers().get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const reservationId = session.metadata?.reservationId;
    if (!reservationId) {
      return NextResponse.json({ received: true });
    }

    const paiement = await prisma.paiement.updateMany({
      where: { stripeCheckoutId: session.id },
      data: {
        statut: "PAYE",
        stripePaymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : undefined,
      },
    });

    if (paiement.count === 0 && session.id) {
      await prisma.paiement.create({
        data: {
          reservationId,
          stripeCheckoutId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
          montant: session.amount_total ?? 0,
          statut: "PAYE",
        },
      });
    }

    const reservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: { statut: "CONFIRMEE" },
      include: { user: true, paiements: true },
    });

    await envoyerRecuPaiement({
      to: reservation.user.email,
      nom: reservation.user.name ?? "client",
      depart: reservation.depart,
      arrivee: reservation.arrivee,
      dateLabel: format(reservation.dateHeure, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr }),
      montantCents: session.amount_total ?? reservation.paiements.at(-1)?.montant ?? 0,
    });
  }

  if (event.type === "checkout.session.expired") {
    const checkoutId = event.data.object.id;
    await prisma.paiement.updateMany({
      where: { stripeCheckoutId: checkoutId },
      data: { statut: "ECHOUE" },
    });
  }

  return NextResponse.json({ received: true });
}
