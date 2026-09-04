"use client";

import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function WhatsAppButton({
  message = "Bonjour, je voudrais réserver un trajet.",
  className,
  label = "WhatsApp",
}: {
  message?: string;
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={whatsappHref(message)}
      target="_blank"
      rel="noreferrer"
      className={cn("btn-ghost", className)}
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </a>
  );
}
