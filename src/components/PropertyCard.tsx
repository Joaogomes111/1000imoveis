import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Car, MapPin, MessageCircle, Ruler } from "lucide-react";

import { buildWhatsappUrl, propertyWhatsappMessage, resolveWhatsappNumber } from "@/lib/whatsapp";
import type { Imovel, SiteConfig } from "@/types/content";

type PropertyCardProps = {
  imovel: Imovel;
  config: SiteConfig;
  index?: number;
};

export function PropertyCard({ imovel, config, index = 0 }: PropertyCardProps) {
  const whatsappUrl = buildWhatsappUrl(resolveWhatsappNumber(config), propertyWhatsappMessage(imovel));

  return (
    <article
      className="animate-card group overflow-hidden rounded-[8px] border border-neutral-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ animationDelay: `${Math.min(index * 80, 360)}ms` }}
    >
      <Link href={`/imoveis/${imovel.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
          <Image
            src={imovel.imagens[0]}
            alt={imovel.titulo}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 rounded-[8px] bg-brand-gold px-3 py-1 text-xs font-bold text-black">
            {imovel.finalidade}
          </div>
        </div>
      </Link>

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">{imovel.tipo}</span>
          <span className="text-lg font-bold text-neutral-950">{imovel.preco}</span>
        </div>
        <Link href={`/imoveis/${imovel.slug}`}>
          <h3 className="line-clamp-2 min-h-[56px] text-xl font-bold leading-7 text-neutral-950 transition group-hover:text-brand-gold-dark">
            {imovel.titulo}
          </h3>
        </Link>
        <p className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
          <MapPin size={16} className="text-emerald-600" />
          {imovel.bairro}, {imovel.cidade}
        </p>
        <p className="mt-4 line-clamp-2 min-h-[48px] text-sm leading-6 text-neutral-600">{imovel.descricaoCurta}</p>

        <div className="mt-5 grid grid-cols-4 gap-2 border-y border-neutral-100 py-4 text-center text-xs text-neutral-600">
          <Feature icon={<BedDouble size={17} />} value={imovel.quartos ?? "-"} label="quartos" />
          <Feature icon={<Bath size={17} />} value={imovel.banheiros ?? "-"} label="banh." />
          <Feature icon={<Car size={17} />} value={imovel.vagas ?? "-"} label="vagas" />
          <Feature icon={<Ruler size={17} />} value={imovel.area ?? "-"} label="área" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            href={`/imoveis/${imovel.slug}`}
            className="focus-ring inline-flex h-11 items-center justify-center rounded-[8px] border border-neutral-200 text-sm font-bold text-neutral-900 transition hover:border-brand-gold hover:bg-brand-cream"
          >
            Ver detalhes
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-whatsapp text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-600"
          >
            <MessageCircle size={17} />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

function Feature({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="grid min-w-0 place-items-center gap-1">
      <span className="text-neutral-400">{icon}</span>
      <strong className="max-w-full truncate text-sm text-neutral-950">{value}</strong>
      <span className="max-w-full truncate">{label}</span>
    </div>
  );
}
