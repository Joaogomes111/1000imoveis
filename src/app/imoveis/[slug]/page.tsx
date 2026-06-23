import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Car, MapPin, MessageCircle, Ruler } from "lucide-react";

import { ContactForm } from "@/components/ContactForm";
import { PropertyGallery } from "@/components/PropertyGallery";
import { getContent, getImovelBySlug } from "@/lib/content-store";
import { buildWhatsappUrl, propertyWhatsappMessage, resolveWhatsappNumber } from "@/lib/whatsapp";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const imovel = await getImovelBySlug(slug);

  if (!imovel) {
    return { title: "Imóvel não encontrado" };
  }

  return {
    title: imovel.titulo,
    description: imovel.descricaoCurta,
    openGraph: {
      title: imovel.titulo,
      description: imovel.descricaoCurta,
      images: imovel.imagens[0] ? [{ url: imovel.imagens[0] }] : undefined,
    },
  };
}

export default async function ImovelPage({ params }: PageProps) {
  const { slug } = await params;
  const content = await getContent();
  const imovel = content.imoveis.find((item) => item.slug === slug && item.ativo);

  if (!imovel) {
    notFound();
  }

  const whatsappUrl = buildWhatsappUrl(resolveWhatsappNumber(content.siteConfig), propertyWhatsappMessage(imovel));

  return (
    <section className="bg-slate-50 pb-20 pt-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div>
          <Link href="/imoveis" className="text-sm font-bold text-neutral-500 transition hover:text-brand-gold-dark">
            Voltar para imóveis
          </Link>
          <div className="mt-6">
            <PropertyGallery images={imovel.imagens} title={imovel.titulo} />
          </div>
          <div className="mt-10 rounded-[8px] border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-[8px] bg-brand-gold px-3 py-1 text-xs font-bold text-black">{imovel.finalidade}</span>
              <span className="rounded-[8px] bg-neutral-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-neutral-600">
                {imovel.tipo}
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-normal text-neutral-950 md:text-4xl">{imovel.titulo}</h1>
            <p className="mt-3 flex items-center gap-2 text-neutral-600">
              <MapPin size={18} className="text-emerald-600" />
              {imovel.endereco || `${imovel.bairro}, ${imovel.cidade}`}
            </p>
            <p className="mt-6 text-3xl font-bold text-neutral-950">{imovel.preco}</p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Detail icon={<BedDouble size={20} />} label="Quartos" value={imovel.quartos ?? "-"} />
              <Detail icon={<Bath size={20} />} label="Banheiros" value={imovel.banheiros ?? "-"} />
              <Detail icon={<Car size={20} />} label="Vagas" value={imovel.vagas ?? "-"} />
              <Detail icon={<Ruler size={20} />} label="Área" value={imovel.area ?? "-"} />
            </div>

            <div className="mt-10 border-t border-neutral-200 pt-8">
              <h2 className="text-2xl font-bold text-neutral-950">Descrição</h2>
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-neutral-650">{imovel.descricaoCompleta}</p>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[8px] border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-gold-dark">Tenho interesse</p>
            <h2 className="mt-2 text-2xl font-bold text-neutral-950">Fale sobre este imóvel</h2>
            <a
              href={whatsappUrl}
              target="_blank"
              className="focus-ring mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-whatsapp text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-600"
            >
              <MessageCircle size={18} />
              Chamar no WhatsApp
            </a>
            <div className="mt-6 border-t border-neutral-200 pt-6">
              <ContactForm config={content.siteConfig} imovel={imovel} />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-[8px] border border-neutral-200 bg-slate-50 p-4">
      <span className="text-brand-gold-dark">{icon}</span>
      <strong className="mt-3 block text-lg text-neutral-950">{value}</strong>
      <span className="text-sm text-neutral-500">{label}</span>
    </div>
  );
}
