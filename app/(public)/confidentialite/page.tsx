import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { legal } from "@/config/legal";
import { LegalField } from "@/components/ui/LegalField";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function ConfidentialitePage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="site-wrap max-w-3xl">
        <p className="text-xs uppercase tracking-[0.22em] text-accent">RGPD</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
          Politique de confidentialité
        </h1>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-muted">
          <div>
            <h2 className="label text-paper">Responsable du traitement</h2>
            <p className="mt-3">
              <LegalField value={legal.exploitant.nom} />, {brand.contact.email}, est responsable du traitement des
              données collectées sur ce site.
            </p>
          </div>

          <div>
            <h2 className="label text-paper">Données collectées</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Identité et contact : nom, e-mail, téléphone (compte, réservation, formulaire de contact).</li>
              <li>Données de trajet : adresses de départ/arrivée, date et heure, nombre de passagers.</li>
              <li>Données de paiement : traitées directement par Stripe — {brand.name} ne stocke aucune donnée bancaire.</li>
              <li>Données techniques : cookie de session nécessaire à la connexion à votre compte.</li>
            </ul>
          </div>

          <div>
            <h2 className="label text-paper">Finalités</h2>
            <p className="mt-3">
              Ces données sont utilisées pour : gérer votre compte et vos réservations, organiser les courses,
              traiter les paiements, répondre à vos demandes de contact, et respecter nos obligations légales et
              comptables.
            </p>
          </div>

          <div>
            <h2 className="label text-paper">Base légale</h2>
            <p className="mt-3">
              Exécution du contrat de transport (réservation, paiement), intérêt légitime (réponse aux demandes de
              contact) et consentement (formulaire de contact).
            </p>
          </div>

          <div>
            <h2 className="label text-paper">Destinataires</h2>
            <p className="mt-3">
              Les données sont accessibles par {brand.name} uniquement, et transmises aux prestataires techniques
              strictement nécessaires : Stripe (paiement), <LegalField value={legal.hebergement.nom} /> (hébergement),
              et le prestataire d&apos;envoi d&apos;e-mails transactionnels.
            </p>
          </div>

          <div>
            <h2 className="label text-paper">Durée de conservation</h2>
            <p className="mt-3">
              Les données de compte et de réservation sont conservées pendant la durée de la relation commerciale
              puis archivées selon les délais légaux (notamment comptables). Les messages de contact non suivis
              d&apos;une réservation sont supprimés au bout de 3 ans.
            </p>
          </div>

          <div>
            <h2 className="label text-paper">Vos droits</h2>
            <p className="mt-3">
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement,
              de limitation et de portabilité de vos données, ainsi que d&apos;un droit d&apos;opposition. Pour les
              exercer, contactez {brand.contact.email}. Vous pouvez également introduire une réclamation auprès de
              la CNIL (cnil.fr).
            </p>
          </div>

          <div>
            <h2 className="label text-paper">Cookies</h2>
            <p className="mt-3">
              Ce site utilise uniquement un cookie de session strictement nécessaire à l&apos;authentification
              (connexion à votre compte). Aucun cookie de mesure d&apos;audience ou publicitaire n&apos;est déposé à
              ce jour.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
