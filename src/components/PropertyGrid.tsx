import { PropertyCard } from "@/components/PropertyCard";
import type { Imovel, SiteConfig } from "@/types/content";

type PropertyGridProps = {
  imoveis: Imovel[];
  config: SiteConfig;
};

export function PropertyGrid({ imoveis, config }: PropertyGridProps) {
  if (!imoveis.length) {
    return (
      <div className="rounded-[8px] border border-dashed border-neutral-300 bg-white p-10 text-center">
        <h3 className="text-xl font-bold text-neutral-950">Nenhum imóvel encontrado</h3>
        <p className="mt-2 text-neutral-600">Fale com a equipe para encontrar uma opção sob medida.</p>
      </div>
    );
  }

  return (
    <div className="property-carousel -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-3">
      {imoveis.map((imovel, index) => (
        <PropertyCard key={imovel.id} imovel={imovel} config={config} index={index} />
      ))}
    </div>
  );
}
