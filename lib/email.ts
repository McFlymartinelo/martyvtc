import { Resend } from "resend";
import { brand } from "@/config/brand";
import { formatEuros } from "@/lib/utils";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

async function sendOrLog(payload: { to: string; subject: string; html: string }) {
  const from = process.env.EMAIL_FROM ?? `${brand.name} <noreply@example.com>`;
  const resend = getResend();

  if (!resend) {
    console.info("[email:dev]", { from, ...payload });
    return;
  }

  await resend.emails.send({ from, ...payload });
}

export async function envoyerConfirmationReservation(params: {
  to: string;
  nom: string;
  depart: string;
  arrivee: string;
  dateLabel: string;
  statut: string;
}) {
  await sendOrLog({
    to: params.to,
    subject: `Réservation ${brand.name} — ${params.statut}`,
    html: `
      <p>Bonjour ${params.nom},</p>
      <p>Votre trajet est enregistré.</p>
      <p><strong>${params.depart}</strong> → <strong>${params.arrivee}</strong><br/>${params.dateLabel}</p>
      <p>Statut : ${params.statut}</p>
      <p>— ${brand.name}</p>
    `,
  });
}

export async function envoyerRecuPaiement(params: {
  to: string;
  nom: string;
  depart: string;
  arrivee: string;
  dateLabel: string;
  montantCents: number;
}) {
  await sendOrLog({
    to: params.to,
    subject: `Reçu de paiement — ${brand.name}`,
    html: `
      <p>Bonjour ${params.nom},</p>
      <p>Paiement reçu : <strong>${formatEuros(params.montantCents)}</strong></p>
      <p><strong>${params.depart}</strong> → <strong>${params.arrivee}</strong><br/>${params.dateLabel}</p>
      <p>Merci. À très vite à bord.</p>
      <p>— ${brand.name}</p>
    `,
  });
}

export async function envoyerMessageContact(params: {
  nom: string;
  email: string;
  telephone?: string;
  message: string;
}) {
  await sendOrLog({
    to: brand.contact.email,
    subject: `Nouveau message — ${params.nom}`,
    html: `
      <p><strong>${params.nom}</strong> (${params.email}${params.telephone ? `, ${params.telephone}` : ""})</p>
      <p>${params.message.replace(/\n/g, "<br/>")}</p>
    `,
  });
}
