import type { Imovel, SiteConfig } from "@/types/content";

export const DEFAULT_WHATSAPP_NUMBER = "554799779970";

const legacyWhatsappNumbers = new Set(["5547999999999"]);

export function resolveWhatsappNumber(config: SiteConfig) {
  return (
    resolveValidWhatsappNumber(config.whatsapp) ||
    resolveValidWhatsappNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) ||
    DEFAULT_WHATSAPP_NUMBER
  );
}

export function normalizeStoredWhatsappNumber(number?: string) {
  return resolveValidWhatsappNumber(number) || DEFAULT_WHATSAPP_NUMBER;
}

export function buildWhatsappUrl(number: string, message: string) {
  const cleanNumber = normalizeWhatsappNumber(number) || DEFAULT_WHATSAPP_NUMBER;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

function resolveValidWhatsappNumber(number?: string) {
  const cleanNumber = normalizeWhatsappNumber(number);

  if (!cleanNumber || legacyWhatsappNumbers.has(cleanNumber)) {
    return "";
  }

  return cleanNumber;
}

function normalizeWhatsappNumber(number?: string) {
  return number?.replace(/\D/g, "") ?? "";
}

export function propertyWhatsappMessage(imovel: Imovel) {
  return `Olá, tenho interesse no imóvel: ${imovel.titulo}. Poderia me passar mais informações?`;
}

export function ownerWhatsappMessage() {
  return "Olá, tenho um imóvel e gostaria de anunciar com a 1000 Imóveis.";
}
