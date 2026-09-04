import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-[88px]">{children}</main>
      <Footer />
    </>
  );
}
