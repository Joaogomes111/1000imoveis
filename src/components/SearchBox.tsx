"use client";

import { Search } from "lucide-react";

import type { SearchFilters } from "@/lib/filter-properties";
import { finalidades, tiposImovel } from "@/lib/options";

type SearchBoxProps = {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  compact?: boolean;
};

export function SearchBox({ filters, onChange, compact = false }: SearchBoxProps) {
  return (
    <form
      className={`glass-panel grid gap-3 rounded-[8px] p-3 ${compact ? "md:grid-cols-[1fr_1fr_1.4fr_auto]" : "md:grid-cols-[1fr_1fr_1.6fr_auto]"}`}
      onSubmit={(event) => event.preventDefault()}
    >
      <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
        Finalidade
        <select
          value={filters.finalidade}
          onChange={(event) => onChange({ ...filters, finalidade: event.target.value as SearchFilters["finalidade"] })}
          className="focus-ring h-12 rounded-[8px] border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900"
        >
          <option value="">Venda ou locação</option>
          {finalidades.map((finalidade) => (
            <option key={finalidade} value={finalidade}>
              {finalidade}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
        Tipo
        <select
          value={filters.tipo}
          onChange={(event) => onChange({ ...filters, tipo: event.target.value as SearchFilters["tipo"] })}
          className="focus-ring h-12 rounded-[8px] border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900"
        >
          <option value="">Todos os tipos</option>
          {tiposImovel.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
        Cidade ou bairro
        <input
          value={filters.termo}
          onChange={(event) => onChange({ ...filters, termo: event.target.value })}
          placeholder="Centro, Fazenda, Cordeiros..."
          className="focus-ring h-12 rounded-[8px] border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900 placeholder:text-neutral-400"
        />
      </label>

      <button
        type="submit"
        className="focus-ring mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-brand-black px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 md:mt-[22px]"
      >
        <Search size={18} />
        Buscar
      </button>
    </form>
  );
}
