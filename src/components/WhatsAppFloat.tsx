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
      className="focus-ring fixed bottom-4 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp text-white shadow-2xl shadow-emerald-900/25 transition hover:-translate-y-1 hover:bg-emerald-600 sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="h-6 w-6 sm:h-[26px] sm:w-[26px]" />
    </a>
  );
}
