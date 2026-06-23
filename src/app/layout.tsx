import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { getContent } from "@/lib/content-store";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://1000imoveis.com.br"),
  title: {
    default: "1000 Imóveis | Imobiliária em Itajaí",
    template: "%s | 1000 Imóveis",
  },
  description:
    "Imobiliária em Itajaí/SC para venda e locação de casas, apartamentos, salas comerciais e terrenos.",
  openGraph: {
    title: "1000 Imóveis",
    description: "Venda e locação de imóveis em Itajaí com atendimento local.",
    url: "https://1000imoveis.com.br",
    siteName: "1000 Imóveis",
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: "/logo-1000-imoveis.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getContent();

  return (
    <html lang="pt-BR">
      <body>
        <Header config={content.siteConfig} />
        <main>{children}</main>
        <Footer config={content.siteConfig} />
        <WhatsAppFloat config={content.siteConfig} />
      </body>
    </html>
  );
}
