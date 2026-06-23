# 1000 Imóveis

Site institucional e funcional para a imobiliária 1000 Imóveis, de Itajaí/SC.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Dados em `content/site-content.json`
- Admin simples em `/admin`

## Como rodar

```bash
pnpm install
pnpm dev
```

Depois acesse:

```text
http://localhost:3000
```

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
ADMIN_PASSWORD=sua-senha-segura
NEXT_PUBLIC_WHATSAPP_NUMBER=5547999999999
```

`ADMIN_PASSWORD` libera o login em `/admin`.
`NEXT_PUBLIC_WHATSAPP_NUMBER` define o número usado nos botões de WhatsApp. Use DDI + DDD + número, sem espaços.

## Editar dados do site

O conteúdo inicial fica em:

```text
content/site-content.json
```

Nesse arquivo você altera:

- banner principal;
- textos institucionais;
- contato;
- WhatsApp;
- imóveis;
- fotos;
- preço;
- finalidade;
- status ativo/inativo;
- destaque na home.

## Cadastrar um imóvel

No array `imoveis`, adicione um objeto seguindo o formato:

```ts
{
  id: "id-unico",
  slug: "url-amigavel-do-imovel",
  titulo: "Apartamento para venda no Centro",
  finalidade: "Venda",
  tipo: "Apartamento",
  preco: "R$ 690.000",
  bairro: "Centro",
  cidade: "Itajaí",
  endereco: "Centro, Itajaí/SC",
  descricaoCurta: "Resumo para o card.",
  descricaoCompleta: "Texto completo para a página do imóvel.",
  quartos: 3,
  banheiros: 2,
  vagas: 1,
  area: "92 m²",
  imagens: ["/images/imovel-apartamento-centro.jpg"],
  destaque: true,
  ativo: true
}
```

As imagens locais devem ficar em:

```text
public/images
```

## Admin

Acesse:

```text
http://localhost:3000/admin
```

O admin edita o JSON local por meio dos endpoints em `src/app/api/admin`.

Importante: a persistência atual é em arquivo, ideal para desenvolvimento e hospedagem Node com disco persistente. Para produção serverless, troque o adapter em `src/lib/content-store.ts` por Supabase, Firebase ou CMS.

## Verificações

```bash
pnpm lint
pnpm build
```
