"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Loader2, ShieldAlert } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { formatEuros } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/MagneticButton";

type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";
type Status = "form" | "processing" | "success";

function detectBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^6(?:011|5)/.test(digits)) return "discover";
  return "unknown";
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function BrandMark({ brand }: { brand: CardBrand }) {
  if (brand === "mastercard") {
    return (
      <span className="relative flex h-7 w-11 items-center" aria-label="Mastercard">
        <span className="absolute left-0 h-7 w-7 rounded-full bg-[#EB001B]/90" />
        <span className="absolute left-3.5 h-7 w-7 rounded-full bg-[#F79E1B]/90 mix-blend-screen" />
      </span>
    );
  }
  if (brand === "visa") {
    return <span className="font-display text-lg italic tracking-wide text-white">VISA</span>;
  }
  if (brand === "amex") {
    return (
      <span className="rounded bg-[#2E77BC] px-2 py-1 text-[10px] font-bold tracking-widest text-white">
        AMEX
      </span>
    );
  }
  if (brand === "discover") {
    return <span className="text-sm font-bold tracking-tight text-[#FF9800]">Discover</span>;
  }
  return <CreditCard className="h-6 w-6 text-white/50" aria-hidden />;
}

const BRAND_PILLS: { id: CardBrand; label: string }[] = [
  { id: "visa", label: "VISA" },
  { id: "mastercard", label: "Mastercard" },
  { id: "amex", label: "AMEX" },
  { id: "discover", label: "Discover" },
];

type Props = {
  amountCents: number;
  description?: string;
  onSuccess?: () => void;
};

export function AnimatedCardPayment({ amountCents, description, onSuccess }: Props) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [cvvFocused, setCvvFocused] = useState(false);
  const [status, setStatus] = useState<Status>("form");
  const [error, setError] = useState<string>();

  const digits = cardNumber.replace(/\D/g, "");
  const brand = useMemo(() => detectBrand(digits), [digits]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (digits.length < 12) {
      setError("Numéro de carte incomplet.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("Date d'expiration invalide.");
      return;
    }
    if (cvv.length < 3) {
      setError("CVV invalide.");
      return;
    }
    if (!name.trim()) {
      setError("Nom sur la carte requis.");
      return;
    }

    setError(undefined);
    setStatus("processing");
    // Démo visuelle uniquement — remplacer par un vrai appel Stripe (PaymentIntent) ici.
    window.setTimeout(() => {
      setStatus("success");
      onSuccess?.();
    }, 1900);
  };

  const reset = () => {
    setStatus("form");
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setName("");
    setCvvFocused(false);
  };

  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden border border-line bg-surface">
      <div className="border-b border-line bg-surface-raised px-5 py-4">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-paper">Ajouter une carte</p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {status === "form" ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
            transition={{ duration: 0.35 }}
            className="px-5 py-6"
          >
            <div className="mx-auto mb-7" style={{ perspective: 1200 }}>
              <motion.div
                className="relative h-44 w-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: cvvFocused ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Face avant */}
                <div
                  className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b1f3a] to-[#0b0d1c] p-5 shadow-xl"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="flex items-start justify-between">
                    <span className="h-7 w-9 rounded-md bg-gradient-to-br from-[#d8c68a] to-[#a4863f]" aria-hidden />
                    <BrandMark brand={brand} />
                  </div>
                  <div>
                    <p className="font-mono text-lg tracking-[0.18em] text-white sm:text-xl">
                      {digits.length ? formatCardNumber(cardNumber) : "•••• •••• •••• ••••"}
                    </p>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/40">Card holder</p>
                        <p className="text-sm font-medium uppercase text-white">{name || "Votre nom"}</p>
                      </div>
                      <p className="font-mono text-sm text-white/70">{expiry || "MM/YY"}</p>
                    </div>
                  </div>
                </div>

                {/* Face arrière */}
                <div
                  className="absolute inset-0 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b1f3a] to-[#0b0d1c] shadow-xl"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <div className="mt-6 h-11 w-full bg-black/80" />
                  <div className="mt-5 flex items-center justify-end gap-2 px-5">
                    <div className="flex h-9 flex-1 items-center rounded bg-white/90 px-3">
                      <span className="ml-auto font-mono text-sm tracking-[0.3em] text-ink">
                        {"•".repeat(Math.min(cvv.length, 4))}
                        {cvvFocused && cvv.length < 4 && (
                          <motion.span
                            className="inline-block w-[2px] bg-ink align-middle"
                            style={{ height: 12 }}
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                          />
                        )}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-white/50">CVV</span>
                  </div>
                  <p className="px-5 pt-4 text-[9px] leading-relaxed text-white/30">
                    Cette carte demeure la propriété de l&apos;émetteur. Toute utilisation est soumise aux
                    conditions générales en vigueur.
                  </p>
                </div>
              </motion.div>
            </div>

            <form onSubmit={submit} className="grid gap-4">
              <div>
                <label htmlFor="cardNumber" className="label">Numéro de carte</label>
                <div className="relative">
                  <input
                    id="cardNumber"
                    className="field pr-12"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 5678 9012 3456"
                    value={formatCardNumber(cardNumber)}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    <BrandMark brand={brand} />
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="label">Date d&apos;expiration</label>
                  <input
                    id="expiry"
                    className="field"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  />
                </div>
                <div className="relative">
                  <label htmlFor="cvv" className="label">CVV</label>
                  <input
                    id="cvv"
                    type="password"
                    className="field"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    maxLength={4}
                    placeholder="***"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    onFocus={() => setCvvFocused(true)}
                    onBlur={() => setCvvFocused(false)}
                  />
                  <AnimatePresence>
                    {cvvFocused && saveCard && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full z-10 mt-2 w-56 border border-danger/40 bg-surface-raised p-3 text-xs text-danger shadow-lg"
                      >
                        <div className="flex gap-2">
                          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                          <p>
                            Le prélèvement automatique nécessite une carte compatible 3D Secure. Vérifiez
                            qu&apos;elle est acceptée par votre banque.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div>
                <label htmlFor="cardName" className="label">Nom sur la carte</label>
                <input
                  id="cardName"
                  className="field uppercase"
                  autoComplete="cc-name"
                  placeholder="JEAN DUPONT"
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                />
              </div>

              <label className="flex items-start gap-3 border border-line p-4 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                />
                <span>Enregistrer cette carte en toute sécurité pour mes prochaines courses.</span>
              </label>

              <div className="flex flex-wrap gap-2">
                {BRAND_PILLS.map((pill) => (
                  <span
                    key={pill.id}
                    className={cn(
                      "border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors",
                      brand === pill.id ? "border-accent text-accent" : "border-line text-muted",
                    )}
                  >
                    {pill.label}
                  </span>
                ))}
              </div>

              {error && <p className="text-sm text-danger">{error}</p>}

              <div className="mt-2 flex items-center justify-between border-t border-line pt-5">
                <div>
                  <p className="text-xs text-muted">{description ?? "Montant à régler"}</p>
                  <p className="font-display text-2xl font-semibold">{formatEuros(amountCents)}</p>
                </div>
                <MagneticButton type="submit">Payer maintenant</MagneticButton>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="transaction"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center gap-6 px-5 py-16 text-center"
          >
            <motion.div
              className="relative flex h-28 w-44 flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b1f3a] to-[#0b0d1c] p-4"
              animate={{
                boxShadow:
                  status === "processing"
                    ? [
                        "0 0 0px 0px rgba(255,77,77,0)",
                        "0 0 32px 8px rgba(255,77,77,0.55)",
                        "0 0 0px 0px rgba(255,77,77,0)",
                      ]
                    : ["0 0 0px 0px rgba(198,255,61,0)", "0 0 32px 8px rgba(198,255,61,0.6)"],
              }}
              transition={
                status === "processing"
                  ? { duration: 1.3, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.6, ease: "easeOut" }
              }
            >
              <div className="flex items-start justify-between">
                <span className="h-5 w-7 rounded bg-gradient-to-br from-[#d8c68a] to-[#a4863f]" aria-hidden />
                <BrandMark brand={brand} />
              </div>
              <p className="font-mono text-sm tracking-[0.16em] text-white">{formatCardNumber(cardNumber)}</p>
            </motion.div>

            <AnimatePresence mode="wait">
              {status === "processing" ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex flex-col items-center gap-3"
                >
                  <Loader2 className="h-5 w-5 animate-spin text-danger" aria-hidden />
                  <p className="text-sm text-muted">Traitement du paiement…</p>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex flex-col items-center gap-2"
                >
                  <p className="font-display text-xl font-semibold text-paper">Paiement réussi !</p>
                  <p className="max-w-xs text-sm text-muted">
                    Votre transaction de <strong className="text-paper">{formatEuros(amountCents)}</strong> a
                    bien été traitée.
                  </p>
                  <button type="button" onClick={reset} className="btn-ghost mt-4">
                    Nouvelle transaction
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
