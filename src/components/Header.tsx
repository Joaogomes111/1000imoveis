"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

import { buildWhatsappUrl, resolveWhatsappNumber } from "@/lib/whatsapp";
import type { SiteConfig } from "@/types/content";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/imoveis", label: "Imóveis" },
  { href: "/sobre", label: "Sobre" },
  { href: "/#anuncie", label: "Anuncie seu imóvel" },
  { href: "/contato", label: "Contato" },
];

type HeaderProps = {
  config: SiteConfig;
};

export function Header({ config }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isSolid = isScrolled || pathname !== "/";
  const whatsappUrl = buildWhatsappUrl(
    resolveWhatsappNumber(config),
    "Olá, gostaria de falar com a 1000 Imóveis.",
  );

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isSolid
          ? "border-b border-black/10 bg-white/95 shadow-sm backdrop-blur"
          : "bg-black/35 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Início 1000 Imóveis">
          <span className="relative h-14 w-14 overflow-hidden rounded-[8px] bg-black">
            <Image
              src="/logo-1000-imoveis.png"
              alt="1000 Imóveis"
              fill
              sizes="56px"
              className="object-contain"
              priority
            />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className={`block text-sm font-semibold ${isSolid ? "text-neutral-950" : "text-white"}`}>
              1000 Imóveis
            </span>
            <span className={`block text-xs ${isSolid ? "text-neutral-500" : "text-white/75"}`}>
              {config.creci}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Menu principal">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition hover:text-brand-gold ${
                isSolid ? "text-neutral-700" : "text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={whatsappUrl}
            target="_blank"
            className="focus-ring inline-flex h-11 items-center gap-2 rounded-[8px] bg-brand-gold px-4 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-yellow-300"
          >
            <MessageCircle size={18} />
            Falar no WhatsApp
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className={`focus-ring inline-flex h-11 w-11 items-center justify-center rounded-[8px] border lg:hidden ${
            isSolid ? "border-black/10 text-neutral-950" : "border-white/25 text-white"
          }`}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-black/10 bg-white px-4 py-4 shadow-lg lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1" aria-label="Menu mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-[8px] px-3 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={whatsappUrl}
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-[8px] bg-brand-gold px-4 py-3 text-sm font-bold text-black"
            >
              <MessageCircle size={18} />
              Falar no WhatsApp
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
