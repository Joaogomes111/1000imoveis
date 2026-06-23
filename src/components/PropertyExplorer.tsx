"use client";

import { useMemo, useState } from "react";

import { emptySearchFilters, filterImoveis } from "@/lib/filter-properties";
import type { SearchFilters } from "@/lib/filter-properties";
import { PropertyGrid } from "@/components/PropertyGrid";
import { SearchBox } from "@/components/SearchBox";
import type { Imovel, SiteConfig } from "@/types/content";

type PropertyExplorerProps = {
  imoveis: Imovel[];
  config: SiteConfig;
  initialFilters?: SearchFilters;
};

export function PropertyExplorer({ imoveis, config, initialFilters = emptySearchFilters }: PropertyExplorerProps) {
  const [filters, setFilters] = useState(initialFilters);
  const filteredImoveis = useMemo(() => filterImoveis(imoveis, filters), [filters, imoveis]);

  return (
    <div className="grid gap-8">
      <SearchBox filters={filters} onChange={setFilters} compact />
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-neutral-600">
          {filteredImoveis.length} {filteredImoveis.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
        </p>
        <button
          type="button"
          onClick={() => setFilters(emptySearchFilters)}
          className="focus-ring rounded-[8px] border border-neutral-200 bg-white px-4 py-2 text-sm font-bold text-neutral-700 transition hover:border-brand-gold"
        >
          Limpar filtros
        </button>
      </div>
      <PropertyGrid imoveis={filteredImoveis} config={config} />
    </div>
  );
}
