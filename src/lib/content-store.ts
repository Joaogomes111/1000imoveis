import { promises as fs } from "node:fs";
import path from "node:path";

import type { Imovel, SiteContent } from "@/types/content";

const contentPath = path.join(process.cwd(), "content", "site-content.json");

export async function getContent(): Promise<SiteContent> {
  const rawContent = await fs.readFile(contentPath, "utf-8");
  return JSON.parse(rawContent) as SiteContent;
}

export async function saveContent(content: SiteContent): Promise<SiteContent> {
  const nextContent: SiteContent = {
    ...content,
    updatedAt: new Date().toISOString(),
    imoveis: content.imoveis.map(normalizeImovel),
  };

  // This file adapter keeps the first version editable without a database.
  // Replace this function with a Supabase, Firebase or CMS repository in production.
  await fs.writeFile(contentPath, `${JSON.stringify(nextContent, null, 2)}\n`, "utf-8");
  return nextContent;
}

export async function getActiveImoveis(): Promise<Imovel[]> {
  const content = await getContent();
  return content.imoveis.filter((imovel) => imovel.ativo);
}

export async function getImovelBySlug(slug: string): Promise<Imovel | undefined> {
  const content = await getContent();
  return content.imoveis.find((imovel) => imovel.slug === slug && imovel.ativo);
}

function normalizeImovel(imovel: Imovel): Imovel {
  return {
    ...imovel,
    id: imovel.id || imovel.slug,
    imagens: imovel.imagens.filter(Boolean),
    quartos: numberOrUndefined(imovel.quartos),
    banheiros: numberOrUndefined(imovel.banheiros),
    vagas: numberOrUndefined(imovel.vagas),
  };
}

function numberOrUndefined(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
