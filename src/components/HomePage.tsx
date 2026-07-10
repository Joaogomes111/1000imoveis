import Image from "next/image";
import Link from "next/link";
import { Building2, KeyRound, MapPin, MessageCircle, Megaphone, ShieldCheck } from "lucide-react";

import { ContactForm } from "@/components/ContactForm";
import { PropertyGrid } from "@/components/PropertyGrid";
import { SectionTitle } from "@/components/SectionTitle";
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
  const config = content.siteConfig;
  const aboutHomeImage = config.sobre?.imagemHome || "/images/imovel-casa-cordeiros.jpg";
  const activeImoveis = content.imoveis.filter((imovel) => imovel.ativo);
  const featuredImoveis = activeImoveis.filter((imovel) => imovel.destaque).slice(0, 6);

  return (
    <>
      <section className="relative min-h-[82svh] overflow-hidden bg-brand-black pt-28 text-white">
        <Image
          src={config.hero.imagem}
          alt="Imóveis em Itajaí"
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-62"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/56 to-black/24" />
        <div className="relative mx-auto flex min-h-[calc(82svh-7rem)] max-w-7xl flex-col justify-center px-4 pb-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl animate-enter">
            <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-normal sm:text-5xl lg:text-6xl">
              <span className="hero-brand-title block text-brand-gold">{config.nome}</span>
              <span className="mt-3 block text-white">{config.hero.titulo}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82">{config.hero.subtitulo}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/imoveis?finalidade=locacao"
                className="focus-ring inline-flex h-12 items-center justify-center rounded-[8px] bg-brand-gold px-8 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-yellow-300"
              >
                {config.hero.botaoPrimario}
              </Link>
              <Link
                href="/imoveis?finalidade=venda"
                className="focus-ring inline-flex h-12 items-center justify-center rounded-[8px] border border-white/30 px-8 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-brand-gold hover:text-brand-gold"
              >
                {config.hero.botaoSecundario}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="imoveis" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle
              eyebrow="Destaques"
              title="Imóveis em destaque"
              subtitle="Confira as oportunidades selecionadas pela 1000 Imóveis em Itajaí e região."
            />
            <Link
              href="/imoveis"
              className="focus-ring inline-flex h-11 items-center justify-center rounded-[8px] border border-neutral-200 bg-white px-5 text-sm font-bold text-neutral-900 transition hover:border-brand-gold"
            >
              Ver todos os imóveis
            </Link>
          </div>
          <PropertyGrid imoveis={featuredImoveis} config={config} />
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[8px] bg-neutral-200">
            <Image
              src={aboutHomeImage}
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

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <SectionTitle
              eyebrow="Contato"
              title="Fale com a 1000 Imóveis"
              subtitle="Atendimento direto para compra, venda e locação de imóveis em Itajaí."
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
