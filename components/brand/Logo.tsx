import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <svg viewBox="0 0 72 72" className="h-7 w-7" aria-hidden>
        <rect width="72" height="72" fill="var(--background)" />
        <path d="M12 54V18h8.4l15.6 28.2L51.6 18H60v36h-7.2V31.2L39.6 54h-7.2L19.2 31.2V54H12Z" fill="var(--accent)" />
      </svg>
      <span className="font-display text-lg font-semibold tracking-tight">{brand.name}</span>
    </span>
  );
}
