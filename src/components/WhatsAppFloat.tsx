import { MessageCircle } from "lucide-react";

import { buildWhatsappUrl, resolveWhatsappNumber } from "@/lib/whatsapp";
import type { SiteConfig } from "@/types/content";

type WhatsAppFloatProps = {
  config: SiteConfig;
};

export function WhatsAppFloat({ config }: WhatsAppFloatProps) {
  const whatsappUrl = buildWhatsappUrl(
    resolveWhatsappNumber(config),
    "Olá, gostaria de atendimento da 1000 Imóveis.",
  );

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      className="focus-ring fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-2xl shadow-emerald-900/25 transition hover:-translate-y-1 hover:bg-emerald-600"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={26} />
    </a>
  );
}
