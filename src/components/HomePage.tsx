"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, KeyRound, MapPin, MessageCircle, Megaphone, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { ContactForm } from "@/components/ContactForm";
import { PropertyGrid } from "@/components/PropertyGrid";
import { SearchBox } from "@/components/SearchBox";
import { SectionTitle } from "@/components/SectionTitle";
import { emptySearchFilters, filterImoveis } from "@/lib/filter-properties";
import { buildWhatsappUrl, ownerWhatsappMessage, resolveWhatsappNumber } from "@/lib/whatsapp";
import type { SiteContent } from "@/types/content";

type HomePageProps = {
  content: SiteContent;
};

const differentials = [
  { icon: MapPin, title: "Atendimento local", text: "Equipe próxima da rotina e dos bairros de Itajaí." },
  { icon: KeyRound, title: "Venda e locação", text: "Imóveis residenciais, comerciais e terrenos." },
  { icon: Megaphone, title: "Divulgação objetiva", text: "Apresentação clara para gerar contatos qualificados." },
  { icon: MessageCircle, title: "Contato direto", text: "Negociação mais simples pelo WhatsApp." },
];

export function HomePage({ content }: HomePageProps) {
  const [filters, setFilters] = useState(emptySearchFilters);
  const config = content.siteConfig;
  const activeImoveis = content.imoveis.filter((imovel) => imovel.ativo);
  const featuredImoveis = activeImoveis.filter((imovel) => imovel.destaque);
  const filteredFeatured = useMemo(() => filterImoveis(featuredImoveis, filters).slice(0, 6), [featuredImoveis, filters]);
  const ownerUrl = buildWhatsappUrl(resolveWhatsappNumber(config), ownerWhatsappMessage());

  return (
    <>
      <section className="relative min-h-[92svh] overflow-hidden bg-brand-black pt-28 text-white">
        <Image
          src={config.hero.imagem}
          alt="Imóveis em Itajaí"
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-58"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/56 to-black/25" />
        <div className="relative mx-auto flex min-h-[calc(92svh-7rem)] max-w-7xl flex-col justify-center px-4 pb-8 sm:px-6 lg:px-8">
          <div className="max-w-3xl animate-enter">
            <p className="mb-5 inline-flex rounded-[8px] border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-gold backdrop-blur">
              {config.nome} | {config.creci}
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-normal sm:text-5xl lg:text-6xl">
              {config.hero.titulo}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82">{config.hero.subtitulo}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#imoveis"
                className="focus-ring inline-flex h-12 items-center justify-center rounded-[8px] bg-brand-gold px-6 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-yellow-300"
              >
                {config.hero.botaoPrimario}
              </Link>
              <Link
                href="#anuncie"
                className="focus-ring inline-flex h-12 items-center justify-center rounded-[8px] border border-white/30 px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-brand-gold hover:text-brand-gold"
              >
                {config.hero.botaoSecundario}
              </Link>
            </div>
          </div>

          <div className="mt-10 max-w-5xl animate-enter-delay">
            <SearchBox filters={filters} onChange={setFilters} />
          </div>
        </div>
      </section>

      <section id="imoveis" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle
              eyebrow="Destaques"
              title="Imóveis em destaque"
              subtitle="Confira algumas oportunidades selecionadas pela 1000 Imóveis em Itajaí e região."
            />
            <Link
              href="/imoveis"
              className="focus-ring inline-flex h-11 items-center justify-center rounded-[8px] border border-neutral-200 bg-white px-5 text-sm font-bold text-neutral-900 transition hover:border-brand-gold"
            >
              Ver todos os imóveis
            </Link>
          </div>
          <PropertyGrid imoveis={filteredFeatured} config={config} />
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[8px] bg-neutral-200">
            <Image
              src="/images/imovel-casa-cordeiros.jpg"
              alt="Atendimento imobiliário"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionTitle
              eyebrow="Sobre"
              title="Sobre a 1000 Imóveis"
              subtitle="A 1000 Imóveis atua em Itajaí oferecendo atendimento próximo, transparente e personalizado para quem deseja comprar, vender ou alugar imóveis na região."
            />
            <p className="mt-5 text-base leading-8 text-neutral-600">
              Nosso foco é conectar pessoas aos imóveis certos, com agilidade, confiança e conhecimento do mercado
              local.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {differentials.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-[8px] border border-neutral-200 bg-slate-50 p-5">
                    <Icon size={24} className="mb-4 text-brand-gold-dark" />
                    <h3 className="font-bold text-neutral-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="anuncie" className="bg-brand-black py-20 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">Anuncie seu imóvel</p>
            <h2 className="max-w-2xl text-3xl font-bold tracking-normal md:text-4xl">Quer vender ou alugar seu imóvel?</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/72">
              Anuncie com a 1000 Imóveis e conte com uma imobiliária local para divulgar seu imóvel de forma simples,
              rápida e profissional.
            </p>
          </div>
          <a
            href={ownerUrl}
            target="_blank"
            className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-brand-gold px-6 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-yellow-300"
          >
            <MessageCircle size={18} />
            Anunciar pelo WhatsApp
          </a>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <SectionTitle
              eyebrow="Contato"
              title="Fale com a 1000 Imóveis"
              subtitle="Atendimento direto para compra, venda, locação e divulgação de imóveis em Itajaí."
            />
            <div className="mt-8 grid gap-4 text-sm text-neutral-700">
              <InfoRow icon={<MessageCircle size={19} />} label="WhatsApp" value="Atendimento pelo botão verde" />
              <InfoRow icon={<MapPin size={19} />} label="Endereço" value={config.endereco} />
              <InfoRow icon={<Building2 size={19} />} label="Horário" value={config.horario} />
              <InfoRow icon={<ShieldCheck size={19} />} label="E-mail" value={config.email} />
            </div>
          </div>
          <div className="rounded-[8px] border border-neutral-200 bg-slate-50 p-5 sm:p-7">
            <ContactForm config={config} />
          </div>
        </div>
      </section>
    </>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-[8px] border border-neutral-200 bg-white p-4">
      <span className="mt-0.5 text-brand-gold-dark">{icon}</span>
      <span>
        <strong className="block text-neutral-950">{label}</strong>
        <span className="text-neutral-600">{value}</span>
      </span>
    </div>
  );
}
