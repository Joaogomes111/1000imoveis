import type { Metadata } from "next";
import Image from "next/image";
import { Building2, HeartHandshake, MapPin, MessageCircle } from "lucide-react";

import { SectionTitle } from "@/components/SectionTitle";
import { getContent } from "@/lib/content-store";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a 1000 Imóveis, imobiliária de Itajaí para venda e locação.",
};

const cards = [
  { icon: MapPin, title: "Itajaí e região", text: "Conhecimento local para orientar compra, venda e locação." },
  { icon: Building2, title: "Imóveis diversos", text: "Apartamentos, casas, salas comerciais, terrenos e kitnets." },
  { icon: HeartHandshake, title: "Atendimento próximo", text: "Relação transparente do primeiro contato até a negociação." },
  { icon: MessageCircle, title: "WhatsApp direto", text: "Contato simples para dúvidas, visitas e captação de imóveis." },
];

export default async function SobrePage() {
  const content = await getContent();
  const aboutPageImage = content.siteConfig.sobre?.imagemPagina || "/images/hero-itajai.jpg";

  return (
    <section className="bg-white pb-20 pt-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <SectionTitle
            eyebrow="Sobre"
            title="Uma imobiliária local, direta e próxima"
            subtitle="A 1000 Imóveis atua em Itajaí oferecendo atendimento transparente para quem deseja comprar, vender ou alugar imóveis na região."
          />
          <p className="mt-6 text-base leading-8 text-neutral-600">
            Com identidade local e foco em relacionamento, a imobiliária conecta pessoas aos imóveis certos com
            agilidade, confiança e conhecimento do mercado de Itajaí.
          </p>
          <p className="mt-4 text-sm font-semibold text-neutral-500">{content.siteConfig.slogan}</p>
        </div>
        <div className="relative aspect-[5/4] overflow-hidden rounded-[8px] bg-neutral-200">
          <Image
            src={aboutPageImage}
            alt="Fachada residencial"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="rounded-[8px] border border-neutral-200 bg-slate-50 p-5">
              <Icon size={25} className="text-brand-gold-dark" />
              <h2 className="mt-5 font-bold text-neutral-950">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{card.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
