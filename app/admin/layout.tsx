import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel Administrativo | Ferreira Veículos",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
