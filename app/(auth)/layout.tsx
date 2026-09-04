import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-ink">
      <div className="site-wrap flex h-[72px] items-center">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <div className="site-wrap grid min-h-[calc(100svh-72px)] items-center py-12 lg:grid-cols-2">
        <div className="hidden lg:block">
          <h1 className="font-display text-6xl font-semibold leading-[0.9] tracking-tight">
            Votre
            <br />
            accès
            <br />
            chauffeur.
          </h1>
        </div>
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
