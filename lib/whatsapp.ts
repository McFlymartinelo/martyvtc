import { brand } from "@/config/brand";

export function whatsappDigits(raw = brand.contact.whatsapp || brand.contact.telephone) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `33${digits.slice(1)}`;
  return digits;
}

export function whatsappHref(message?: string) {
  const base = `https://wa.me/${whatsappDigits()}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
