export type Finalidade = "Venda" | "Locação";

export type TipoImovel =
  | "Apartamento"
  | "Casa"
  | "Sala Comercial"
  | "Terreno"
  | "Kitnet"
  | "Outro";

export type Imovel = {
  id: string;
  slug: string;
  titulo: string;
  finalidade: Finalidade;
  tipo: TipoImovel;
  preco: string;
  bairro: string;
  cidade: string;
  endereco?: string;
  descricaoCurta: string;
  descricaoCompleta: string;
  quartos?: number;
  banheiros?: number;
  vagas?: number;
  area?: string;
  imagens: string[];
  destaque: boolean;
  ativo: boolean;
};

export type SiteConfig = {
  nome: string;
  slogan: string;
  creci?: string;
  whatsapp: string;
  email: string;
  endereco: string;
  horario: string;
  site: string;
  instagram?: string;
  facebook?: string;
  hero: {
    titulo: string;
    subtitulo: string;
    imagem: string;
    botaoPrimario: string;
    botaoSecundario: string;
  };
  sobre?: {
    imagemHome?: string;
    imagemPagina?: string;
  };
};

export type SiteContent = {
  updatedAt: string;
  siteConfig: SiteConfig;
  imoveis: Imovel[];
};
