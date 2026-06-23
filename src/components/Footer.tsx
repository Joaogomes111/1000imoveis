import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";

import { buildWhatsappUrl, resolveWhatsappNumber } from "@/lib/whatsapp";
import type { SiteConfig } from "@/types/content";

type FooterProps = {
  config: SiteConfig;
};

export function Footer({ config }: FooterProps) {
  const whatsappUrl = buildWhatsappUrl(
    resolveWhatsappNumber(config),
    "Olá, gostaria de atendimento da 1000 Imóveis.",
  );

  return (
    <footer className="bg-brand-black text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="relative h-16 w-16 overflow-hidden rounded-[8px] bg-black">
              <Image src="/logo-1000-imoveis.png" alt="1000 Imóveis" fill sizes="64px" className="object-contain" />
            </span>
            <div>
              <p className="font-semibold">{config.nome}</p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/68">{config.slogan}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-gold">Links</h2>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <Link href="/imoveis" className="transition hover:text-brand-gold">
              Imóveis
            </Link>
            <Link href="/sobre" className="transition hover:text-brand-gold">
              Sobre
            </Link>
            <Link href="/#anuncie" className="transition hover:text-brand-gold">
              Anuncie seu imóvel
            </Link>
            <Link href="/contato" className="transition hover:text-brand-gold">
              Contato
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-gold">Contato</h2>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <a href={whatsappUrl} target="_blank" className="flex gap-3 transition hover:text-brand-gold">
              <MessageCircle size={18} />
              WhatsApp
            </a>
            <a href={`mailto:${config.email}`} className="flex gap-3 transition hover:text-brand-gold">
              <Mail size={18} />
              {config.email}
            </a>
            <span className="flex gap-3">
              <MapPin size={18} />
              {config.endereco}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/45">
        © {new Date().getFullYear()} 1000 Imóveis. Todos os direitos reservados.
      </div>
    </footer>
  );
}
