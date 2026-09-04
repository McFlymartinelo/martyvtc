"use client";

import { Car, ChevronDown, Home, LayoutGrid, Mail, Plane, ArrowUpRight, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const services = [
  {
    href: "/reservation?type=ville",
    title: "Course ville",
    description: "Gares, rendez-vous, intra-muros.",
    icon: Car,
  },
  {
    href: "/reservation?type=aeroport",
    title: "Aéroport",
    description: "CDG, Orly, Beauvais — 30 secondes.",
    icon: Plane,
  },
  {
    href: "/reservation?type=disposition",
    title: "Mise à disposition",
    description: "La journée, à votre rythme.",
    icon: LayoutGrid,
  },
];

type PremiumNavProps = {
  onNavigate?: () => void;
};

export function PremiumNav({ onNavigate }: PremiumNavProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});

  const moveTo = useCallback((el: HTMLElement | null) => {
    const nav = navRef.current;
    const bg = bgRef.current;
    if (!nav || !bg || !el) return;
    const navRect = nav.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    bg.style.left = `${rect.left - navRect.left}px`;
    bg.style.width = `${rect.width}px`;
    bg.style.height = `${rect.height}px`;
    bg.style.top = `${rect.top - navRect.top}px`;
    bg.style.opacity = "1";
  }, []);

  const activeKey = pathname === "/" ? "home" : pathname.startsWith("/tarifs") ? "offres" : pathname.startsWith("/reservation") ? "reserver" : pathname.startsWith("/contact") ? "contact" : "";

  const snapToActive = useCallback(() => {
    moveTo(itemRefs.current[activeKey] ?? itemRefs.current.home);
  }, [activeKey, moveTo]);

  useEffect(() => {
    snapToActive();
    window.addEventListener("resize", snapToActive);
    return () => window.removeEventListener("resize", snapToActive);
  }, [snapToActive]);

  const setItem = (key: string) => (node: HTMLElement | null) => {
    itemRefs.current[key] = node;
  };

  return (
    <nav
      ref={navRef}
      className="premium-nav relative hidden items-center rounded-full border border-line bg-surface p-1.5 md:flex"
      onMouseLeave={snapToActive}
    >
      <span ref={bgRef} className="premium-active-bg" aria-hidden />

      <Link
        href="/"
        ref={setItem("home")}
        onMouseEnter={(e) => moveTo(e.currentTarget)}
        onClick={onNavigate}
        className={cn("premium-link", activeKey === "home" && "is-active")}
      >
        <Home className="h-4 w-4" />
        Accueil
      </Link>

      <div className="premium-dropdown relative" onMouseEnter={(e) => {
        const toggle = e.currentTarget.querySelector<HTMLElement>("[data-nav-item]");
        moveTo(toggle);
      }}>
        <Link
          href="/tarifs"
          data-nav-item
          ref={setItem("offres")}
          className={cn("premium-link", activeKey === "offres" && "is-active")}
          onClick={onNavigate}
        >
          <LayoutGrid className="h-4 w-4" />
          Offres
          <ChevronDown className="premium-chevron h-3.5 w-3.5" />
        </Link>
        <div className="premium-dropdown-menu">
          {services.map((item) => (
            <Link key={item.href} href={item.href} className="premium-service" onClick={onNavigate}>
              <span className="premium-service-icon">
                <item.icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-paper">{item.title}</span>
                <span className="mt-0.5 block text-xs text-muted">{item.description}</span>
              </span>
              <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-muted" />
            </Link>
          ))}
        </div>
      </div>

      <Link
        href="/contact"
        ref={setItem("contact")}
        onMouseEnter={(e) => moveTo(e.currentTarget)}
        onClick={onNavigate}
        className={cn("premium-link", activeKey === "contact" && "is-active")}
      >
        <Mail className="h-4 w-4" />
        Contact
      </Link>

      <Link
        href="/reservation"
        ref={setItem("reserver")}
        onMouseEnter={(e) => moveTo(e.currentTarget)}
        onClick={onNavigate}
        className="premium-cta"
      >
        <CalendarCheck className="h-4 w-4" />
        Réserver
      </Link>
    </nav>
  );
}
