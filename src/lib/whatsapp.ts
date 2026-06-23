import type { Imovel, SiteConfig } from "@/types/content";

export function resolveWhatsappNumber(config: SiteConfig) {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || config.whatsapp;
}

export function buildWhatsappUrl(number: string, message: string) {
  const cleanNumber = number.replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function propertyWhatsappMessage(imovel: Imovel) {
  return `Olá, tenho interesse no imóvel: ${imovel.titulo}. Poderia me passar mais informações?`;
}

export function ownerWhatsappMessage() {
  return "Olá, tenho um imóvel e gostaria de anunciar com a 1000 Imóveis.";
}
