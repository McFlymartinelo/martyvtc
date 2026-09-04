"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, Car, LayoutGrid, Menu, Plane, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { PremiumNav } from "@/components/layout/PremiumNav";

const mobileServices = [
  { href: "/reservation?type=ville", title: "Course ville", icon: Car },
  { href: "/reservation?type=aeroport", title: "Aéroport", icon: Plane },
  { href: "/reservation?type=disposition", title: "Mise à disposition", icon: LayoutGrid },
];

export function Header() {
  const { data, status } = useSession();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [offresOpen, setOffresOpen] = useState(false);
  const last = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > last.current && latest > 80) setHidden(true);
    else setHidden(false);
    last.current = latest;
  });

  const close = () => {
    setOpen(false);
    setOffresOpen(false);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/95"
        animate={{ y: hidden && !open ? -96 : 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="site-wrap flex h-[88px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3" onClick={close}>
            <Logo />
          </Link>

          <PremiumNav />

          <div className="hidden items-center gap-5 md:flex">
            {status === "authenticated" ? (
              <>
                <Link href="/compte" className="text-xs uppercase tracking-[0.18em] text-muted hover:text-paper">
                  Compte
                </Link>
                {data.user.role === "ADMIN" && (
                  <Link href="/admin" className="text-xs uppercase tracking-[0.18em] text-muted hover:text-paper">
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-xs uppercase tracking-[0.18em] text-muted hover:text-paper"
                >
                  Sortir
                </button>
              </>
            ) : (
              <Link href="/connexion" className="text-xs uppercase tracking-[0.18em] text-muted hover:text-paper">
                Connexion
              </Link>
            )}
          </div>

          <button
            type="button"
            className="md:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 overflow-y-auto bg-ink pt-[88px] md:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <div className="site-wrap flex flex-col gap-2 py-8">
              <Link href="/" onClick={close} className="font-display text-4xl font-semibold tracking-tight">
                Accueil
              </Link>
              <button
                type="button"
                className="flex items-center justify-between text-left font-display text-4xl font-semibold tracking-tight"
                onClick={() => setOffresOpen((v) => !v)}
                aria-expanded={offresOpen}
              >
                Offres
                <ArrowUpRight className={offresOpen ? "rotate-90" : ""} />
              </button>
              <AnimatePresence>
                {offresOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-4 mt-2 border border-line">
                      {mobileServices.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={close}
                          className="flex items-center gap-3 border-b border-line px-4 py-4 last:border-0"
                        >
                          <item.icon className="h-4 w-4 text-accent" />
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <Link href="/contact" onClick={close} className="font-display text-4xl font-semibold tracking-tight">
                Contact
              </Link>
              <Link href="/reservation" onClick={close} className="mt-4 bg-accent px-5 py-4 font-display text-2xl font-semibold text-accent-fg">
                Réserver
              </Link>
              <Link
                href={status === "authenticated" ? "/compte" : "/connexion"}
                onClick={close}
                className="mt-6 text-sm uppercase tracking-[0.18em] text-muted"
              >
                {status === "authenticated" ? "Compte" : "Connexion"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
