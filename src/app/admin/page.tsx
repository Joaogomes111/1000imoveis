import type { Metadata } from "next";

import { AdminPanel } from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "Admin",
  description: "Área administrativa da 1000 Imóveis.",
};

export default function AdminPage() {
  return <AdminPanel />;
}
