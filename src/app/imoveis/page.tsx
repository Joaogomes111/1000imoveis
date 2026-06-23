import type { Metadata } from "next";

import { PropertyExplorer } from "@/components/PropertyExplorer";
import { SectionTitle } from "@/components/SectionTitle";
import { getContent } from "@/lib/content-store";

export const metadata: Metadata = {
  title: "Imóveis",
  description: "Lista de imóveis para venda e locação em Itajaí e região.",
};

export default async function ImoveisPage() {
  const content = await getContent();
  const activeImoveis = content.imoveis.filter((imovel) => imovel.ativo);

  return (
    <section className="bg-slate-50 pb-20 pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <SectionTitle
            eyebrow="Imóveis"
            title="Encontre uma oportunidade em Itajaí"
            subtitle="Filtre por finalidade, tipo, bairro ou cidade e fale diretamente com a equipe."
          />
        </div>
        <PropertyExplorer imoveis={activeImoveis} config={content.siteConfig} />
      </div>
    </section>
  );
}
