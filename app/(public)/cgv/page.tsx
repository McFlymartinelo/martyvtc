import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { legal } from "@/config/legal";
import { tarifs } from "@/config/tarifs";
import { LegalField } from "@/components/ui/LegalField";

export const metadata: Metadata = { title: "Conditions générales de vente" };

export default function CgvPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="site-wrap max-w-3xl">
        <p className="text-xs uppercase tracking-[0.22em] text-accent">Conditions</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
          Conditions générales de vente
        </h1>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-muted">
          <div>
            <h2 className="label text-paper">1. Objet et prestataire</h2>
            <p className="mt-3">
              Les présentes conditions régissent les prestations de transport de personnes avec chauffeur (VTC)
              proposées par <LegalField value={legal.exploitant.nom} />, titulaire de la carte professionnelle VTC
              n° <LegalField value={legal.activite.carteVtc} />, via le site {brand.name}.
            </p>
          </div>

          <div>
            <h2 className="label text-paper">2. Réservation</h2>
            <p className="mt-3">
              La réservation s&apos;effectue en ligne via le formulaire de réservation ou par WhatsApp. Elle n&apos;est
              considérée comme confirmée qu&apos;après paiement de l&apos;acompte (le cas échéant) ou confirmation
              explicite du chauffeur. Le tarif définitif dépend du trajet, de l&apos;horaire et du nombre de
              passagers ; le devis affiché avant réservation est indicatif. {tarifs.mention}
            </p>
          </div>

          <div>
            <h2 className="label text-paper">3. Prix et paiement</h2>
            <p className="mt-3">
              {brand.acomptePourcent < 100 ? (
                <>
                  Un acompte de {brand.acomptePourcent}% du montant estimé est réglé en ligne par carte bancaire au
                  moment de la réservation. Le solde est réglé directement au chauffeur, par le moyen convenu
                  (carte, espèces), à l&apos;issue de la course.
                </>
              ) : (
                <>La totalité du montant estimé est réglée en ligne par carte bancaire au moment de la réservation.</>
              )}
              {" "}Un supplément de {tarifs.supplementNuitPourcent}% s&apos;applique aux courses effectuées entre{" "}
              {tarifs.nuitDebutHeure}h et {tarifs.nuitFinHeure}h.
            </p>
          </div>

          <div>
            <h2 className="label text-paper">4. Annulation</h2>
            <p className="mt-3">
              Annulation :{" "}
              {tarifs.extras.find((e) => e.nom.toLowerCase().includes("annulation"))?.valeur ??
                "gratuite jusqu'à 4 h avant l'heure de prise en charge"}
              . En cas d&apos;annulation tardive ou d&apos;absence du client au point de rendez-vous, l&apos;acompte
              versé peut être retenu.
            </p>
          </div>

          <div>
            <h2 className="label text-paper">5. Responsabilité</h2>
            <p className="mt-3">
              Le prestataire est couvert par une assurance responsabilité civile professionnelle (
              <LegalField value={legal.activite.assurance} />) couvrant le transport de personnes. Le client
              s&apos;engage à respecter les consignes de sécurité du véhicule.
            </p>
          </div>

          <div>
            <h2 className="label text-paper">6. Données personnelles</h2>
            <p className="mt-3">
              Les informations collectées lors de la réservation sont utilisées pour l&apos;exécution du contrat de
              transport. Voir la{" "}
              <a href="/confidentialite" className="text-accent hover:underline">
                politique de confidentialité
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="label text-paper">7. Litiges</h2>
            <p className="mt-3">
              En cas de litige, le client peut recourir au médiateur de la consommation :{" "}
              <LegalField value={legal.mediateur.nom} /> (<LegalField value={legal.mediateur.url} />).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
