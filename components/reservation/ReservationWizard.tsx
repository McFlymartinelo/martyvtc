"use client";

import { AnimatePresence, motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMinutes, format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Car, Clock, Plane } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { aeroports, tarifs, zones, type AeroportId, type ZoneId } from "@/config/tarifs";
import { brand } from "@/config/brand";
import { estimerDevis, labelZone, type TypeCourse } from "@/lib/quote";
import { formatEuros } from "@/lib/utils";
import { AvailabilityCalendar } from "@/components/reservation/AvailabilityCalendar";
import { QuoteCard } from "@/components/reservation/QuoteCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  typeCourse: z.enum(["ville", "aeroport", "disposition"]),
  zoneDepart: z.string(),
  zoneArrivee: z.string(),
  depart: z.string().optional(),
  arrivee: z.string().optional(),
  nombrePassagers: z.coerce.number().int().min(1).max(6),
  commentaire: z.string().optional(),
  heuresDisposition: z.coerce.number().int().min(3).max(16),
  aeroport: z.enum(["cdg", "orly", "beauvais"]),
  direction: z.enum(["depuis", "vers"]),
  zoneVille: z.enum(["paris", "banlieue"]),
  numeroVol: z.string().optional(),
  terminal: z.string().optional(),
  heureAtterrissage: z.string().optional(),
  attenteApresVol: z.boolean(),
  siegeEnfant: z.boolean(),
  pourAutrui: z.boolean(),
  passagerNom: z.string().optional(),
  passagerTelephone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const types: { id: TypeCourse; label: string; text: string; icon: typeof Car }[] = [
  { id: "ville", label: "Ville", text: "Paris & banlieue", icon: Car },
  { id: "aeroport", label: "Aéroport", text: "30 secondes", icon: Plane },
  { id: "disposition", label: "À disposition", text: "Dès 3 heures", icon: Clock },
];

const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

function asType(value?: string | null): TypeCourse {
  if (value === "aeroport" || value === "disposition" || value === "ville") return value;
  return "ville";
}

export function ReservationWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const { status } = useSession();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [dateHeure, setDateHeure] = useState<string>();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typeCourse: asType(params.get("type")),
      zoneDepart: "paris",
      zoneArrivee: "paris",
      depart: "",
      arrivee: "",
      nombrePassagers: 1,
      commentaire: "",
      heuresDisposition: 3,
      aeroport: "cdg",
      direction: "depuis",
      zoneVille: "paris",
      numeroVol: "",
      terminal: "",
      heureAtterrissage: "",
      attenteApresVol: true,
      siegeEnfant: false,
      pourAutrui: false,
      passagerNom: "",
      passagerTelephone: "",
    },
  });

  const values = useWatch({ control: form.control });
  const typeCourse = (values.typeCourse ?? "ville") as TypeCourse;

  const zonesEffectives = useMemo(() => {
    if (typeCourse === "aeroport") {
      const air = (values.aeroport ?? "cdg") as ZoneId;
      const ville = (values.zoneVille ?? "paris") as ZoneId;
      return values.direction === "vers"
        ? { zoneDepart: ville, zoneArrivee: air }
        : { zoneDepart: air, zoneArrivee: ville };
    }
    return {
      zoneDepart: (values.zoneDepart ?? "paris") as ZoneId,
      zoneArrivee: (values.zoneArrivee ?? "paris") as ZoneId,
    };
  }, [typeCourse, values.aeroport, values.direction, values.zoneArrivee, values.zoneDepart, values.zoneVille]);

  const quote = useMemo(
    () =>
      estimerDevis({
        typeCourse,
        ...zonesEffectives,
        dateHeure,
        heuresDisposition: values.heuresDisposition,
        siegeEnfant: values.siegeEnfant,
      }),
    [dateHeure, typeCourse, values.heuresDisposition, values.siegeEnfant, zonesEffectives],
  );

  const pickupConseil = useMemo(() => {
    if (typeCourse !== "aeroport" || !values.attenteApresVol || !values.heureAtterrissage || !dateHeure) return null;
    const jour = dateHeure.slice(0, 10);
    const landing = parseISO(`${jour}T${values.heureAtterrissage}:00`);
    if (Number.isNaN(landing.getTime())) return null;
    return addMinutes(landing, 45);
  }, [dateHeure, typeCourse, values.attenteApresVol, values.heureAtterrissage]);

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const resolveAddresses = (data: FormValues) => {
    if (data.typeCourse === "aeroport") {
      const airLabel = `${labelZone(data.aeroport as AeroportId)}${data.terminal ? ` T${data.terminal}` : ""}`;
      const ville = data.depart || data.arrivee || labelZone(data.zoneVille);
      if (data.direction === "depuis") {
        return { depart: airLabel, arrivee: data.arrivee || ville };
      }
      return { depart: data.depart || ville, arrivee: airLabel };
    }
    if (data.typeCourse === "disposition") {
      const lieu = data.depart || labelZone(data.zoneDepart as ZoneId);
      return { depart: lieu, arrivee: `Disposition · ${data.heuresDisposition} h` };
    }
    return { depart: data.depart || labelZone(data.zoneDepart as ZoneId), arrivee: data.arrivee || labelZone(data.zoneArrivee as ZoneId) };
  };

  const submit = form.handleSubmit(async (data) => {
    if (!dateHeure) {
      setError("Choisissez un créneau.");
      return;
    }
    if (status !== "authenticated") {
      router.push(`/connexion?callbackUrl=/reservation?type=${data.typeCourse}`);
      return;
    }
    if (data.typeCourse === "aeroport" && !data.numeroVol?.trim()) {
      setError("Indiquez le numéro de vol.");
      go(0);
      return;
    }
    if (data.pourAutrui && (!data.passagerNom?.trim() || !data.passagerTelephone?.trim())) {
      setError("Nom et téléphone du passager requis.");
      go(0);
      return;
    }

    const { depart, arrivee } = resolveAddresses(data);
    const extras = [
      data.numeroVol && `Vol ${data.numeroVol}`,
      data.terminal && `Terminal ${data.terminal}`,
      data.heureAtterrissage && `Atterrissage ${data.heureAtterrissage}`,
      data.attenteApresVol && "Prise en charge +45 min",
      data.siegeEnfant && "Siège enfant",
      data.pourAutrui && `Passager : ${data.passagerNom} (${data.passagerTelephone})`,
    ]
      .filter(Boolean)
      .join(" · ");

    setPending(true);
    setError(undefined);
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        typeCourse: data.typeCourse,
        zoneDepart: zonesEffectives.zoneDepart,
        zoneArrivee: zonesEffectives.zoneArrivee,
        depart,
        arrivee,
        dateHeure: new Date(dateHeure).toISOString(),
        nombrePassagers: data.nombrePassagers,
        commentaire: [data.commentaire, extras].filter(Boolean).join(" — "),
        heuresDisposition: data.heuresDisposition,
        numeroVol: data.numeroVol,
        terminal: data.terminal,
        heureAtterrissage: data.heureAtterrissage,
        attenteApresVol: data.attenteApresVol,
        siegeEnfant: data.siegeEnfant,
        pourAutrui: data.pourAutrui,
        passagerNom: data.passagerNom,
        passagerTelephone: data.passagerTelephone,
      }),
    });
    const payload = await res.json();
    setPending(false);

    if (!res.ok) {
      setError(payload.error ?? "Impossible d'enregistrer.");
      return;
    }
    if (payload.checkoutUrl) {
      window.location.href = payload.checkoutUrl;
      return;
    }
    router.push(payload.redirectUrl ?? `/reservation/confirmation?id=${payload.reservationId}`);
  });

  const whatsappMessage = `Bonjour ${brand.name}, je voudrais ${quote.label} pour ${formatEuros(quote.totalCents)}.`;

  return (
    <div className="border border-line bg-surface p-5 sm:p-8">
      <ol className="mb-8 flex gap-4 text-xs uppercase tracking-[0.16em] text-muted">
        {["Trajet", "Créneau", "Récap"].map((label, i) => (
          <li key={label} className={i === step ? "text-accent" : undefined}>
            0{i + 1} {label}
          </li>
        ))}
      </ol>

      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_16rem]">
        <div>
          <AnimatePresence mode="wait" custom={dir}>
            {step === 0 && (
              <motion.div key="trajet" custom={dir} variants={slide} initial="enter" animate="center" exit="exit" className="grid gap-5">
                <div className="grid grid-cols-3 gap-2">
                  {types.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => form.setValue("typeCourse", item.id)}
                      className={cn(
                        "border px-2 py-3 text-left transition-colors",
                        typeCourse === item.id ? "border-accent bg-accent text-accent-fg" : "border-line",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <p className="mt-2 text-sm font-semibold">{item.label}</p>
                      <p className={cn("text-[11px]", typeCourse === item.id ? "text-accent-fg/70" : "text-muted")}>{item.text}</p>
                    </button>
                  ))}
                </div>

                {typeCourse === "ville" && (
                  <>
                    <ZoneField
                      label="Zone de départ"
                      value={(values.zoneDepart ?? "paris") as ZoneId}
                      onChange={(id) => form.setValue("zoneDepart", id)}
                      allowed={["paris", "banlieue"]}
                    />
                    <div>
                      <label htmlFor="depart" className="label">Adresse de départ</label>
                      <input id="depart" className="field" placeholder="Rue, gare, hôtel…" {...form.register("depart")} />
                      {form.formState.errors.depart && <p className="mt-2 text-sm text-danger">{form.formState.errors.depart.message}</p>}
                    </div>
                    <ZoneField
                      label="Zone d'arrivée"
                      value={(values.zoneArrivee ?? "paris") as ZoneId}
                      onChange={(id) => form.setValue("zoneArrivee", id)}
                      allowed={["paris", "banlieue", "cdg", "orly", "beauvais"]}
                    />
                    <div>
                      <label htmlFor="arrivee" className="label">Adresse d&apos;arrivée</label>
                      <input id="arrivee" className="field" placeholder="Destination" {...form.register("arrivee")} />
                      {form.formState.errors.arrivee && <p className="mt-2 text-sm text-danger">{form.formState.errors.arrivee.message}</p>}
                    </div>
                  </>
                )}

                {typeCourse === "aeroport" && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      {(["depuis", "vers"] as const).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => form.setValue("direction", d)}
                          className={cn("border px-3 py-3 text-sm", values.direction === d ? "border-accent text-accent" : "border-line")}
                        >
                          {d === "depuis" ? "Depuis l'aéroport" : "Vers l'aéroport"}
                        </button>
                      ))}
                    </div>
                    <ZoneField
                      label="Aéroport"
                      value={(values.aeroport ?? "cdg") as ZoneId}
                      onChange={(id) => form.setValue("aeroport", id as AeroportId)}
                      allowed={[...aeroports]}
                    />
                    <ZoneField
                      label="Côté ville"
                      value={(values.zoneVille ?? "paris") as ZoneId}
                      onChange={(id) => form.setValue("zoneVille", id as "paris" | "banlieue")}
                      allowed={["paris", "banlieue"]}
                    />
                    <div>
                      <label htmlFor="adresse-air" className="label">Adresse à Paris / banlieue</label>
                      <input
                        id="adresse-air"
                        className="field"
                        placeholder="Hôtel, domicile, gare…"
                        {...form.register(values.direction === "depuis" ? "arrivee" : "depart")}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label htmlFor="numeroVol" className="label">N° de vol</label>
                        <input id="numeroVol" className="field" placeholder="AF1234" {...form.register("numeroVol")} />
                      </div>
                      <div>
                        <label htmlFor="terminal" className="label">Terminal</label>
                        <input id="terminal" className="field" placeholder="2E" {...form.register("terminal")} />
                      </div>
                      <div>
                        <label htmlFor="heureAtterrissage" className="label">Atterrissage</label>
                        <input id="heureAtterrissage" type="time" className="field" {...form.register("heureAtterrissage")} />
                      </div>
                    </div>
                    <label className="flex items-start gap-3 border border-line p-4 text-sm">
                      <input type="checkbox" className="mt-1" {...form.register("attenteApresVol")} />
                      <span>
                        <strong>Prise en charge 45 min après l&apos;atterrissage</strong>
                        <span className="mt-1 block text-muted">Je suis au meeting point, bagages inclus. Pas d&apos;attente facturée.</span>
                      </span>
                    </label>
                  </>
                )}

                {typeCourse === "disposition" && (
                  <>
                    <ZoneField
                      label="Zone"
                      value={(values.zoneDepart ?? "paris") as ZoneId}
                      onChange={(id) => {
                        form.setValue("zoneDepart", id);
                        form.setValue("zoneArrivee", id);
                      }}
                      allowed={["paris", "banlieue"]}
                    />
                    <div>
                      <label htmlFor="depart-dispo" className="label">Prise en charge</label>
                      <input id="depart-dispo" className="field" placeholder="Adresse de départ" {...form.register("depart")} />
                    </div>
                    <div>
                      <label htmlFor="heures" className="label">Durée (heures)</label>
                      <input id="heures" type="number" min={3} max={16} className="field" {...form.register("heuresDisposition")} />
                      <p className="mt-2 text-xs text-muted">Minimum {tarifs.dispositionMinimumHeures} heures · {formatEuros(tarifs.dispositionHeureCents)} / h</p>
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="passagers" className="label">Passagers</label>
                  <input id="passagers" type="number" min={1} max={6} className="field" {...form.register("nombrePassagers")} />
                </div>

                <label className="flex items-start gap-3 border border-line p-4 text-sm">
                  <input type="checkbox" className="mt-1" {...form.register("siegeEnfant")} />
                  <span>Siège enfant</span>
                </label>

                <label className="flex items-start gap-3 border border-line p-4 text-sm">
                  <input type="checkbox" className="mt-1" {...form.register("pourAutrui")} />
                  <span>
                    <strong>Réserver pour quelqu&apos;un d&apos;autre</strong>
                    <span className="mt-1 block text-muted">Vous payez, le passager est pris en charge.</span>
                  </span>
                </label>

                {values.pourAutrui && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="passagerNom" className="label">Nom du passager</label>
                      <input id="passagerNom" className="field" {...form.register("passagerNom")} />
                    </div>
                    <div>
                      <label htmlFor="passagerTelephone" className="label">Téléphone du passager</label>
                      <input id="passagerTelephone" className="field" inputMode="tel" {...form.register("passagerTelephone")} />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="commentaire" className="label">Commentaire</label>
                  <textarea id="commentaire" rows={2} className="field" placeholder="Consigne, code portail…" {...form.register("commentaire")} />
                </div>

                <div className="flex flex-wrap gap-3">
                  <MagneticButton
                    type="button"
                    onClick={() => {
                      if (typeCourse === "aeroport") {
                        const adresse = values.direction === "depuis" ? values.arrivee : values.depart;
                        if (!adresse || adresse.length < 3) {
                          form.setError(values.direction === "depuis" ? "arrivee" : "depart", { message: "Indiquez l'adresse côté ville." });
                          return;
                        }
                        if (!values.numeroVol?.trim()) {
                          setError("Indiquez le numéro de vol.");
                          return;
                        }
                      } else {
                        form.trigger(["depart", "arrivee"]).then((ok) => {
                          if (typeCourse === "disposition") {
                            if ((values.depart ?? "").length >= 3) {
                              form.setValue("arrivee", values.depart ?? "");
                              setError(undefined);
                              go(1);
                            }
                            return;
                          }
                          if (ok) {
                            setError(undefined);
                            go(1);
                          }
                        });
                        return;
                      }
                      setError(undefined);
                      go(1);
                    }}
                  >
                    Choisir un créneau
                  </MagneticButton>
                  <WhatsAppButton message={whatsappMessage} />
                </div>
                {error && step === 0 && <p className="text-sm text-danger">{error}</p>}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="creneau" custom={dir} variants={slide} initial="enter" animate="center" exit="exit">
                {pickupConseil && (
                  <p className="mb-6 border border-accent p-4 text-sm">
                    Créneau conseillé : <strong>{format(pickupConseil, "HH:mm")}</strong> (atterrissage {values.heureAtterrissage} + 45 min).
                  </p>
                )}
                <AvailabilityCalendar value={dateHeure} onSelect={setDateHeure} />
                <div className="mt-8 flex flex-wrap gap-3">
                  <button type="button" className="btn-ghost" onClick={() => go(0)}>
                    Retour
                  </button>
                  <MagneticButton type="button" onClick={() => dateHeure && go(2)}>
                    Voir le récapitulatif
                  </MagneticButton>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="recap" custom={dir} variants={slide} initial="enter" animate="center" exit="exit" className="space-y-6">
                <dl className="grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="label">Trajet</dt>
                    <dd>{resolveAddresses(values as FormValues).depart} → {resolveAddresses(values as FormValues).arrivee}</dd>
                  </div>
                  <div>
                    <dt className="label">Quand</dt>
                    <dd>{dateHeure ? format(parseISO(dateHeure), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr }) : "—"}</dd>
                  </div>
                  <div>
                    <dt className="label">Passagers</dt>
                    <dd>
                      {values.nombrePassagers}
                      {values.siegeEnfant ? " · siège enfant" : ""}
                    </dd>
                  </div>
                  <div>
                    <dt className="label">{brand.paiementAvantCourse ? "À régler" : "Estimation"}</dt>
                    <dd className="font-display text-2xl">{formatEuros(quote.aReglerCents)}</dd>
                  </div>
                </dl>
                {values.pourAutrui && (
                  <p className="text-sm text-muted">
                    Passager : {values.passagerNom} · {values.passagerTelephone}
                  </p>
                )}
                {values.numeroVol && (
                  <p className="text-sm text-muted">
                    Vol {values.numeroVol}
                    {values.terminal ? ` · Terminal ${values.terminal}` : ""}
                    {values.attenteApresVol ? " · +45 min" : ""}
                  </p>
                )}
                {status !== "authenticated" && (
                  <p className="border border-line p-4 text-sm text-muted">
                    Vous serez invité à vous connecter pour confirmer.
                  </p>
                )}
                {error && <p className="text-sm text-danger">{error}</p>}
                <div className="flex flex-wrap gap-3">
                  <button type="button" className="btn-ghost" onClick={() => go(1)}>
                    Retour
                  </button>
                  <MagneticButton type="submit" disabled={pending}>
                    {pending ? "Traitement…" : brand.paiementAvantCourse ? "Payer et confirmer" : "Confirmer la réservation"}
                  </MagneticButton>
                  <WhatsAppButton message={whatsappMessage} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <QuoteCard quote={quote} />
      </form>
    </div>
  );
}

function ZoneField({
  label,
  value,
  onChange,
  allowed,
}: {
  label: string;
  value: ZoneId;
  onChange: (id: ZoneId) => void;
  allowed: readonly ZoneId[];
}) {
  return (
    <div>
      <p className="label">{label}</p>
      <div className="flex flex-wrap gap-2">
        {zones
          .filter((z) => allowed.includes(z.id))
          .map((z) => (
            <button
              key={z.id}
              type="button"
              onClick={() => onChange(z.id)}
              className={cn(
                "border px-3 py-2 text-sm",
                value === z.id ? "border-accent bg-accent text-accent-fg" : "border-line",
              )}
            >
              {z.label}
            </button>
          ))}
      </div>
    </div>
  );
}
