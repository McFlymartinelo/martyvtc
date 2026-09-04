"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type Creneau = {
  id: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  estDisponible: boolean;
  occupe: boolean;
};

type Props = {
  value?: string;
  onSelect: (iso: string) => void;
};

export function AvailabilityCalendar({ value, onSelect }: Props) {
  const [cursor, setCursor] = useState(startOfMonth(new Date()));
  const [direction, setDirection] = useState(0);
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [loading, setLoading] = useState(true);
  const selected = value ? parseISO(value) : null;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const annee = cursor.getFullYear();
    const mois = cursor.getMonth() + 1;
    fetch(`/api/disponibilites?annee=${annee}&mois=${mois}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setCreneaux(data.creneaux ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [cursor]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const byDay = useMemo(() => {
    const map = new Map<string, Creneau[]>();
    for (const c of creneaux) {
      const list = map.get(c.date) ?? [];
      list.push(c);
      map.set(c.date, list);
    }
    return map;
  }, [creneaux]);

  const selectedDayKey = selected ? format(selected, "yyyy-MM-dd") : null;
  const slots = selectedDayKey ? (byDay.get(selectedDayKey) ?? []) : [];

  const changeMonth = (delta: number) => {
    setDirection(delta);
    setCursor((c) => addMonths(c, delta));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <button type="button" className="btn-ghost !px-3 !py-2" onClick={() => changeMonth(-1)} aria-label="Mois précédent">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-display text-2xl font-semibold capitalize">
          {format(cursor, "MMMM yyyy", { locale: fr })}
        </p>
        <button type="button" className="btn-ghost !px-3 !py-2" onClick={() => changeMonth(1)} aria-label="Mois suivant">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-[10px] uppercase tracking-[0.16em] text-muted">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="relative mt-3 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={format(cursor, "yyyy-MM")}
            custom={direction}
            initial={{ x: direction >= 0 ? 48 : -48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction >= 0 ? -48 : 48, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="grid grid-cols-7 gap-2"
          >
            {days.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const daySlots = byDay.get(key) ?? [];
              const available = daySlots.some((s) => s.estDisponible);
              const booked = daySlots.length > 0 && daySlots.every((s) => s.occupe || !s.estDisponible);
              const inMonth = isSameMonth(day, cursor);
              const isSelected = selected ? isSameDay(day, selected) : false;
              const firstSlot = daySlots.find((s) => s.estDisponible);

              return (
                <button
                  key={key}
                  type="button"
                  disabled={!available || !inMonth}
                  onClick={() => {
                    if (!firstSlot) return;
                    onSelect(`${firstSlot.date}T${firstSlot.heureDebut}:00`);
                  }}
                  className={cn(
                    "aspect-square border text-sm transition-transform duration-150",
                    inMonth ? "border-line" : "border-transparent text-muted",
                    available && "hover:scale-105 hover:border-accent",
                    booked && "bg-surface text-muted",
                    !available && inMonth && "text-muted",
                    isSelected && "scale-105 border-accent bg-accent text-accent-fg",
                  )}
                  aria-label={format(day, "d MMMM", { locale: fr })}
                  aria-pressed={isSelected}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-2">
          <i className="h-2 w-2 bg-accent" /> Disponible
        </span>
        <span className="inline-flex items-center gap-2">
          <i className="h-2 w-2 bg-surface ring-1 ring-line" /> Complet
        </span>
      </div>

      {selected && (
        <div className="mt-8">
          <p className="label">Créneaux du {format(selected, "EEEE d MMMM", { locale: fr })}</p>
          {loading ? (
            <p className="text-muted">Chargement…</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {slots.map((slot) => {
                const iso = `${slot.date}T${slot.heureDebut}:00`;
                const active = value?.startsWith(iso);
                return (
                  <motion.button
                    key={slot.id}
                    type="button"
                    disabled={!slot.estDisponible}
                    onClick={() => onSelect(iso)}
                    whileHover={slot.estDisponible ? { scale: 1.05 } : undefined}
                    whileTap={slot.estDisponible ? { scale: 0.97 } : undefined}
                    className={cn(
                      "border px-4 py-2 text-sm",
                      slot.estDisponible ? "border-line hover:border-accent" : "border-line text-muted line-through",
                      active && "border-accent bg-accent text-accent-fg",
                    )}
                  >
                    {slot.heureDebut}
                  </motion.button>
                );
              })}
              {slots.length === 0 && <p className="text-muted">Aucun créneau ce jour.</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
