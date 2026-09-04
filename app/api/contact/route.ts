import { NextResponse } from "next/server";
import { envoyerMessageContact } from "@/lib/email";
import { contactSchema } from "@/lib/validations/contact";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides." },
      { status: 400 },
    );
  }

  // Piège anti-spam : un champ invisible pour les humains, souvent rempli par les bots.
  // On répond "ok" sans rien envoyer pour ne pas les alerter.
  if (parsed.data.societe) {
    return NextResponse.json({ ok: true });
  }

  await envoyerMessageContact(parsed.data);
  return NextResponse.json({ ok: true });
}
