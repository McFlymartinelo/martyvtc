import Stripe from "stripe";
import { brand } from "@/config/brand";
import { tarifs } from "@/config/tarifs";
import { prisma } from "@/lib/prisma";
import { montantReservationCents, siteUrl } from "@/lib/utils";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY manquante.");
  }
  return new Stripe(key);
}

export async function creerSessionCheckout(reservationId: string, email: string) {
  const stripe = getStripe();
  const reservation = await prisma.reservation.findUniqueOrThrow({
    where: { id: reservationId },
  });

  const montant = reservation.montantEstime ?? montantReservationCents();
  const label =
    brand.acomptePourcent < 100
      ? `Acompte ${brand.acomptePourcent}% — ${brand.name}`
      : `Course ${brand.name}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    locale: "fr",
    success_url: `${siteUrl()}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/paiement/annule?reservation=${reservationId}`,
    metadata: { reservationId },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: tarifs.devise.toLowerCase(),
          unit_amount: montant,
          product_data: {
            name: label,
            description: `${reservation.depart} → ${reservation.arrivee}`,
          },
        },
      },
    ],
  });

  await prisma.paiement.create({
    data: {
      reservationId,
      stripeCheckoutId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
      montant,
      statut: "EN_ATTENTE",
    },
  });

  return session;
}
