import type { Metadata } from "next";
import Link from "next/link";

import { PropertyGrid } from "@/components/PropertyGrid";
import { SectionTitle } from "@/components/SectionTitle";
import { getContent } from "@/lib/content-store";
import type { Finalidade } from "@/types/content";

export const metadata: Metadata = {
  title: "Imóveis",
  description: "Lista de imóveis para venda e locação em Itajaí e região.",
};

type ImoveisPageProps = {
  searchParams: Promise<{
    finalidade?: string;
  }>;
};

export default async function ImoveisPage({ searchParams }: ImoveisPageProps) {
  const content = await getContent();
  const params = await searchParams;
  const finalidade = resolveFinalidade(params.finalidade);
  const activeImoveis = content.imoveis.filter((imovel) => imovel.ativo);
  const visibleImoveis = finalidade
    ? activeImoveis.filter((imovel) => imovel.finalidade === finalidade)
    : activeImoveis;

  const title =
    finalidade === "Locação" ? "Imóveis para aluguel" : finalidade === "Venda" ? "Imóveis à venda" : "Imóveis em Itajaí";

  const subtitle =
    finalidade === "Locação"
      ? "Confira as opções disponíveis para alugar em Itajaí e região."
      : finalidade === "Venda"
        ? "Confira as oportunidades disponíveis para compra em Itajaí e região."
        : "Confira casas, apartamentos, salas comerciais, terrenos e kitnets disponíveis.";

  return (
    <section className="bg-slate-50 pb-20 pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionTitle eyebrow="Imóveis" title={title} subtitle={subtitle} />
          <div className="flex flex-wrap gap-3">
            <CategoryLink href="/imoveis?finalidade=locacao" active={finalidade === "Locação"}>
              Aluguel
            </CategoryLink>
            <CategoryLink href="/imoveis?finalidade=venda" active={finalidade === "Venda"}>
              Venda
            </CategoryLink>
            <CategoryLink href="/imoveis" active={!finalidade}>
              Todos
            </CategoryLink>
          </div>
        </div>
        <PropertyGrid imoveis={visibleImoveis} config={content.siteConfig} />
      </div>
    </section>
  );
}

function CategoryLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`focus-ring inline-flex h-11 items-center justify-center rounded-[8px] px-5 text-sm font-bold transition ${
        active
          ? "bg-brand-black text-white"
          : "border border-neutral-200 bg-white text-neutral-900 hover:border-brand-gold"
      }`}
    >
      {children}
    </Link>
  );
}

function resolveFinalidade(value?: string): Finalidade | null {
  const normalizedValue = value
    ?.toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

  if (normalizedValue === "locacao" || normalizedValue === "aluguel") {
    return "Locação";
  }

  if (normalizedValue === "venda") {
    return "Venda";
  }

  return null;
}
