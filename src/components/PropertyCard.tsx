"use client";

import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Car, ChevronLeft, ChevronRight, MapPin, MessageCircle, Ruler } from "lucide-react";
import { useState } from "react";

import { buildWhatsappUrl, propertyWhatsappMessage, resolveWhatsappNumber } from "@/lib/whatsapp";
import type { Imovel, SiteConfig } from "@/types/content";

type PropertyCardProps = {
  imovel: Imovel;
  config: SiteConfig;
  index?: number;
};

export function PropertyCard({ imovel, config, index = 0 }: PropertyCardProps) {
  const whatsappUrl = buildWhatsappUrl(resolveWhatsappNumber(config), propertyWhatsappMessage(imovel));
  const images = imovel.imagens.length ? imovel.imagens : ["/images/imovel-apartamento-centro.jpg"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const normalizedIndex = currentImageIndex % images.length;
  const hasMultipleImages = images.length > 1;

  function showPreviousImage() {
    setCurrentImageIndex((value) => (value - 1 + images.length) % images.length);
  }

  function showNextImage() {
    setCurrentImageIndex((value) => (value + 1) % images.length);
  }

  return (
    <article
      className="property-card animate-card min-w-[82vw] snap-start overflow-hidden rounded-[8px] border border-neutral-200 bg-white shadow-sm transition duration-300 sm:min-w-[360px] md:min-w-0"
      style={{ animationDelay: `${Math.min(index * 80, 360)}ms` }}
    >
      <div className="property-card-media relative aspect-[4/3] overflow-hidden bg-neutral-200">
        <Image
          src={images[normalizedIndex]}
          alt={imovel.titulo}
          fill
          sizes="(max-width: 768px) 82vw, (max-width: 1200px) 50vw, 33vw"
          draggable={false}
          className="property-card-image object-cover transition duration-500"
        />
        <div className="absolute left-3 top-3 rounded-[8px] bg-brand-gold px-3 py-1 text-xs font-bold text-black">
          {imovel.finalidade}
        </div>

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              className="focus-ring absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/75"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={19} />
            </button>
            <button
              type="button"
              onClick={showNextImage}
              className="focus-ring absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/75"
              aria-label="Próxima foto"
            >
              <ChevronRight size={19} />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/45 px-2 py-1 backdrop-blur">
              {images.map((image, imageIndex) => (
                <button
                  key={`${image}-${imageIndex}`}
                  type="button"
                  onClick={() => setCurrentImageIndex(imageIndex)}
                  className={`h-1.5 rounded-full transition ${
                    imageIndex === normalizedIndex ? "w-5 bg-brand-gold" : "w-1.5 bg-white/70"
                  }`}
                  aria-label={`Ver foto ${imageIndex + 1}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">{imovel.tipo}</span>
          <span className="text-lg font-bold text-neutral-950">{imovel.preco}</span>
        </div>
        <Link href={`/imoveis/${imovel.slug}`}>
          <h3 className="property-card-title line-clamp-2 min-h-[56px] text-xl font-bold leading-7 text-neutral-950 transition">
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
