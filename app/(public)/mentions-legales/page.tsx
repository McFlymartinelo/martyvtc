import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { legal } from "@/config/legal";
import { LegalField } from "@/components/ui/LegalField";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegalesPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="site-wrap max-w-3xl">
        <p className="text-xs uppercase tracking-[0.22em] text-accent">Informations légales</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl">Mentions légales</h1>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-muted">
          <div>
            <h2 className="label text-paper">Éditeur du site</h2>
            <p className="mt-3 text-paper">
              <LegalField value={legal.exploitant.nom} /> — <LegalField value={legal.exploitant.formeJuridique} />
              <br />
              SIRET : <LegalField value={legal.exploitant.siret} />
              <br />
              RCS : <LegalField value={legal.exploitant.rcs} />
              <br />
              TVA intracommunautaire : <LegalField value={legal.exploitant.tvaIntracommunautaire} />
              <br />
              Adresse : <LegalField value={legal.exploitant.adresse} />
              <br />
              Directeur de la publication : <LegalField value={legal.exploitant.directeurPublication} />
              <br />
              Contact : {brand.contact.email} · {brand.contact.telephone}
            </p>
          </div>

          <div>
            <h2 className="label text-paper">Activité VTC</h2>
            <p className="mt-3 text-paper">
              {brand.legalName} exerce une activité de transport de personnes avec chauffeur (VTC), soumise à
              inscription au registre des exploitants VTC.
              <br />
              N° de carte professionnelle VTC : <LegalField value={legal.activite.carteVtc} />
              <br />
              N° d&apos;immatriculation au registre VTC : <LegalField value={legal.activite.registreVtc} />
              <br />
              Assurance responsabilité civile professionnelle : <LegalField value={legal.activite.assurance} />
            </p>
          </div>

          <div>
            <h2 className="label text-paper">Hébergement</h2>
            <p className="mt-3 text-paper">
              <LegalField value={legal.hebergement.nom} />
              <br />
              Adresse : <LegalField value={legal.hebergement.adresse} />
              <br />
              Téléphone : <LegalField value={legal.hebergement.telephone} />
            </p>
          </div>

          <div>
            <h2 className="label text-paper">Propriété intellectuelle</h2>
            <p className="mt-3">
              L&apos;ensemble des contenus présents sur ce site (textes, logo, mise en page) est la propriété de{" "}
              {legal.exploitant.nom.startsWith("[À COMPLÉTER") ? brand.legalName : legal.exploitant.nom}, sauf
              mention contraire. Toute reproduction sans autorisation préalable est interdite.
            </p>
          </div>

          <div>
            <h2 className="label text-paper">Médiation de la consommation</h2>
            <p className="mt-3">
              Conformément à l&apos;article L. 616-1 du Code de la consommation, en cas de litige, le client peut
              recourir gratuitement au service de médiation :{" "}
              <LegalField value={legal.mediateur.nom} /> — <LegalField value={legal.mediateur.url} />.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
