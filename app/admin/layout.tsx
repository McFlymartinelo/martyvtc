import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Header } from "@/components/layout/Header";

const links = [
  { href: "/admin", label: "Réservations" },
  { href: "/admin/calendrier", label: "Calendrier" },
  { href: "/admin/clients", label: "Clients" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/connexion?callbackUrl=/admin");
  }

  return (
    <>
      <Header />
      <div className="site-wrap flex gap-6 overflow-x-auto border-b border-line pt-[104px] text-xs uppercase tracking-[0.16em]">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="py-4 text-muted hover:text-accent">
            {l.label}
          </Link>
        ))}
      </div>
      <main>{children}</main>
    </>
  );
}
