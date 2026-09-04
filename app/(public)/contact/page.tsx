import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { brand } from "@/config/brand";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="site-wrap grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-accent">Contact</p>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-7xl">
            Un message.
            <br />
            Une réponse.
          </h1>
          <div className="mt-10 space-y-3 text-lg">
            <a href={`mailto:${brand.contact.email}`} className="block hover:text-accent">
              {brand.contact.email}
            </a>
            <a href={`tel:${brand.contact.telephone.replace(/\s/g, "")}`} className="block hover:text-accent">
              {brand.contact.telephone}
            </a>
            <p className="text-muted">{brand.contact.zone}</p>
            <div className="pt-4">
              <WhatsAppButton message={`Bonjour ${brand.name}, je vous contacte depuis le site.`} />
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
