import type { Finalidade, Imovel, TipoImovel } from "@/types/content";

export type SearchFilters = {
  finalidade: Finalidade | "";
  tipo: TipoImovel | "";
  termo: string;
};

export const emptySearchFilters: SearchFilters = {
  finalidade: "",
  tipo: "",
  termo: "",
};

export function filterImoveis(imoveis: Imovel[], filters: SearchFilters) {
  const termo = normalize(filters.termo);

  return imoveis.filter((imovel) => {
    const matchesFinalidade = !filters.finalidade || imovel.finalidade === filters.finalidade;
    const matchesTipo = !filters.tipo || imovel.tipo === filters.tipo;
    const searchable = normalize(
      [imovel.titulo, imovel.bairro, imovel.cidade, imovel.tipo, imovel.descricaoCurta].join(" "),
    );
    const matchesTermo = !termo || searchable.includes(termo);

    return imovel.ativo && matchesFinalidade && matchesTipo && matchesTermo;
  });
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}
