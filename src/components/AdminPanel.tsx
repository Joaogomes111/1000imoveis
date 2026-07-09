"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, LogOut, Plus, Save, Trash2 } from "lucide-react";

import { finalidades, tiposImovel } from "@/lib/options";
import type { Finalidade, Imovel, SiteContent, TipoImovel } from "@/types/content";

type AdminStatus = "checking" | "login" | "ready" | "saving";

export function AdminPanel() {
  const [status, setStatus] = useState<AdminStatus>("checking");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    loadContent();
  }, []);

  const selectedImovel = useMemo(
    () => content?.imoveis.find((imovel) => imovel.id === selectedId) ?? content?.imoveis[0],
    [content, selectedId],
  );

  async function loadContent() {
    const response = await fetch("/api/admin/content", { cache: "no-store" });
    if (!response.ok) {
      setStatus("login");
      setMessage("Não foi possível carregar a área administrativa.");
      return;
    }

    const body = (await response.json()) as
      | { authenticated: false }
      | { authenticated: true; content: SiteContent };

    if (!body.authenticated) {
      setStatus("login");
      return;
    }

    setContent(body.content);
    setSelectedId(body.content.imoveis[0]?.id ?? "");
    setStatus("ready");
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setMessage(body?.message ?? "Senha inválida.");
      return;
    }

    setPassword("");
    await loadContent();
  }

  async function handleSave() {
    if (!content) {
      return;
    }

    setStatus("saving");
    setMessage("");

    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      setStatus("ready");
      setMessage("Não foi possível salvar. Faça login novamente.");
      return;
    }

    const savedContent = (await response.json()) as SiteContent;
    setContent(savedContent);
    setStatus("ready");
    setMessage("Alterações salvas.");
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setContent(null);
    setStatus("login");
  }

  function updateContent(nextContent: SiteContent) {
    setContent(nextContent);
  }

  function updateSiteConfig<K extends keyof SiteContent["siteConfig"]>(key: K, value: SiteContent["siteConfig"][K]) {
    if (!content) {
      return;
    }

    updateContent({
      ...content,
      siteConfig: {
        ...content.siteConfig,
        [key]: value,
      },
    });
  }

  function updateHero<K extends keyof SiteContent["siteConfig"]["hero"]>(
    key: K,
    value: SiteContent["siteConfig"]["hero"][K],
  ) {
    if (!content) {
      return;
    }

    updateContent({
      ...content,
      siteConfig: {
        ...content.siteConfig,
        hero: {
          ...content.siteConfig.hero,
          [key]: value,
        },
      },
    });
  }

  function addImovel() {
    if (!content) {
      return;
    }

    const id = crypto.randomUUID();
    const newImovel: Imovel = {
      id,
      slug: `novo-imovel-${Date.now()}`,
      titulo: "Novo imóvel",
      finalidade: "Venda",
      tipo: "Apartamento",
      preco: "R$ 0",
      bairro: "Centro",
      cidade: "Itajaí",
      endereco: "",
      descricaoCurta: "Descrição curta do imóvel.",
      descricaoCompleta: "Descrição completa do imóvel.",
      quartos: 1,
      banheiros: 1,
      vagas: 0,
      area: "0 m²",
      imagens: ["/images/imovel-apartamento-centro.jpg"],
      destaque: false,
      ativo: true,
    };

    updateContent({ ...content, imoveis: [newImovel, ...content.imoveis] });
    setSelectedId(id);
  }

  function removeImovel(id: string) {
    if (!content) {
      return;
    }

    const nextImoveis = content.imoveis.filter((imovel) => imovel.id !== id);
    updateContent({ ...content, imoveis: nextImoveis });
    setSelectedId(nextImoveis[0]?.id ?? "");
  }

  function updateImovel<K extends keyof Imovel>(key: K, value: Imovel[K]) {
    if (!content || !selectedImovel) {
      return;
    }

    const nextImoveis = content.imoveis.map((imovel) =>
      imovel.id === selectedImovel.id
        ? {
            ...imovel,
            [key]: value,
          }
        : imovel,
    );
    updateContent({ ...content, imoveis: nextImoveis });
  }

  async function handleHeroImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    updateHero("imagem", dataUrl);
    event.target.value = "";
  }

  async function handlePropertyImagesUpload(event: ChangeEvent<HTMLInputElement>) {
    if (!selectedImovel) {
      return;
    }

    const files = Array.from(event.target.files ?? []);
    if (!files.length) {
      return;
    }

    const dataUrls = await Promise.all(files.map(readFileAsDataUrl));
    updateImovel("imagens", [...selectedImovel.imagens, ...dataUrls]);
    event.target.value = "";
  }

  if (status === "checking") {
    return (
      <div className="grid min-h-[55vh] place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-brand-gold" />
      </div>
    );
  }

  if (status === "login") {
    return (
      <section className="mx-auto max-w-md px-4 pb-20 pt-32">
        <div className="rounded-[8px] border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold-dark">Admin</p>
          <h1 className="mt-2 text-2xl font-bold text-neutral-950">Acesso administrativo</h1>
          <form onSubmit={handleLogin} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-neutral-700">
              Senha
              <span className="flex h-12 overflow-hidden rounded-[8px] border border-neutral-200 bg-white">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="focus-ring min-w-0 flex-1 px-3 text-neutral-950"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="focus-ring grid w-12 place-items-center text-neutral-500"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            {message ? <p className="text-sm font-semibold text-red-600">{message}</p> : null}
            <button
              type="submit"
              className="focus-ring inline-flex h-12 items-center justify-center rounded-[8px] bg-brand-black text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              Entrar
            </button>
          </form>
        </div>
      </section>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <section className="bg-slate-50 pb-20 pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold-dark">Admin</p>
            <h1 className="mt-2 text-3xl font-bold text-neutral-950">Conteúdo do site</h1>
            {message ? <p className="mt-2 text-sm font-semibold text-emerald-700">{message}</p> : null}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={status === "saving"}
              className="focus-ring inline-flex h-11 items-center gap-2 rounded-[8px] bg-brand-gold px-4 text-sm font-bold text-black transition hover:bg-yellow-300 disabled:opacity-60"
            >
              <Save size={17} />
              {status === "saving" ? "Salvando" : "Salvar"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="focus-ring inline-flex h-11 items-center gap-2 rounded-[8px] border border-neutral-200 bg-white px-4 text-sm font-bold text-neutral-700 transition hover:border-neutral-300"
            >
              <LogOut size={17} />
              Sair
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-8">
            <AdminCard title="Banner principal">
              <TextInput label="Título" value={content.siteConfig.hero.titulo} onChange={(value) => updateHero("titulo", value)} />
              <TextareaInput
                label="Subtítulo"
                value={content.siteConfig.hero.subtitulo}
                onChange={(value) => updateHero("subtitulo", value)}
              />
              <TextInput label="Imagem" value={content.siteConfig.hero.imagem} onChange={(value) => updateHero("imagem", value)} />
              <FileInput label="Subir imagem do banner pelo PC" onChange={handleHeroImageUpload} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  label="Botão principal"
                  value={content.siteConfig.hero.botaoPrimario}
                  onChange={(value) => updateHero("botaoPrimario", value)}
                />
                <TextInput
                  label="Botão secundário"
                  value={content.siteConfig.hero.botaoSecundario}
                  onChange={(value) => updateHero("botaoSecundario", value)}
                />
              </div>
            </AdminCard>

            <AdminCard title="Dados gerais">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput label="Nome" value={content.siteConfig.nome} onChange={(value) => updateSiteConfig("nome", value)} />
                <TextInput label="Slogan" value={content.siteConfig.slogan} onChange={(value) => updateSiteConfig("slogan", value)} />
                <TextInput label="WhatsApp" value={content.siteConfig.whatsapp} onChange={(value) => updateSiteConfig("whatsapp", value)} />
                <TextInput label="E-mail" value={content.siteConfig.email} onChange={(value) => updateSiteConfig("email", value)} />
                <TextInput label="Endereço" value={content.siteConfig.endereco} onChange={(value) => updateSiteConfig("endereco", value)} />
                <TextInput label="Horário" value={content.siteConfig.horario} onChange={(value) => updateSiteConfig("horario", value)} />
              </div>
            </AdminCard>
          </div>

          <div className="grid gap-8">
            <AdminCard
              title="Imóveis"
              action={
                <button
                  type="button"
                  onClick={addImovel}
                  className="focus-ring inline-flex h-10 items-center gap-2 rounded-[8px] bg-brand-black px-3 text-sm font-bold text-white"
                >
                  <Plus size={17} />
                  Adicionar
                </button>
              }
            >
              <div className="grid gap-3">
                {content.imoveis.map((imovel) => (
                  <button
                    key={imovel.id}
                    type="button"
                    onClick={() => setSelectedId(imovel.id)}
                    className={`focus-ring rounded-[8px] border p-3 text-left transition ${
                      selectedImovel?.id === imovel.id
                        ? "border-brand-gold bg-brand-cream"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <strong className="line-clamp-1 text-sm text-neutral-950">{imovel.titulo}</strong>
                      <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${imovel.ativo ? "bg-emerald-100 text-emerald-700" : "bg-neutral-200 text-neutral-500"}`}>
                        {imovel.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </span>
                    <span className="mt-1 block text-xs text-neutral-500">
                      {imovel.finalidade} | {imovel.tipo} | {imovel.bairro}
                    </span>
                  </button>
                ))}
              </div>
            </AdminCard>

            {selectedImovel ? (
              <AdminCard
                title="Editar imóvel"
                action={
                  <button
                    type="button"
                    onClick={() => removeImovel(selectedImovel.id)}
                    className="focus-ring inline-flex h-10 items-center gap-2 rounded-[8px] border border-red-200 bg-white px-3 text-sm font-bold text-red-600"
                  >
                    <Trash2 size={17} />
                    Remover
                  </button>
                }
              >
                <div className="grid gap-4">
                  <TextInput label="Título" value={selectedImovel.titulo} onChange={(value) => updateImovel("titulo", value)} />
                  <TextInput
                    label="Slug"
                    value={selectedImovel.slug}
                    onChange={(value) => updateImovel("slug", slugify(value))}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <SelectInput
                      label="Finalidade"
                      value={selectedImovel.finalidade}
                      options={finalidades}
                      onChange={(value) => updateImovel("finalidade", value as Finalidade)}
                    />
                    <SelectInput
                      label="Tipo"
                      value={selectedImovel.tipo}
                      options={tiposImovel}
                      onChange={(value) => updateImovel("tipo", value as TipoImovel)}
                    />
                    <TextInput label="Preço" value={selectedImovel.preco} onChange={(value) => updateImovel("preco", value)} />
                    <TextInput label="Área" value={selectedImovel.area ?? ""} onChange={(value) => updateImovel("area", value)} />
                    <TextInput label="Bairro" value={selectedImovel.bairro} onChange={(value) => updateImovel("bairro", value)} />
                    <TextInput label="Cidade" value={selectedImovel.cidade} onChange={(value) => updateImovel("cidade", value)} />
                  </div>
                  <TextInput
                    label="Endereço"
                    value={selectedImovel.endereco ?? ""}
                    onChange={(value) => updateImovel("endereco", value)}
                  />
                  <TextareaInput
                    label="Descrição curta"
                    value={selectedImovel.descricaoCurta}
                    onChange={(value) => updateImovel("descricaoCurta", value)}
                  />
                  <TextareaInput
                    label="Descrição completa"
                    value={selectedImovel.descricaoCompleta}
                    onChange={(value) => updateImovel("descricaoCompleta", value)}
                  />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <NumberInput label="Quartos" value={selectedImovel.quartos} onChange={(value) => updateImovel("quartos", value)} />
                    <NumberInput
                      label="Banheiros"
                      value={selectedImovel.banheiros}
                      onChange={(value) => updateImovel("banheiros", value)}
                    />
                    <NumberInput label="Vagas" value={selectedImovel.vagas} onChange={(value) => updateImovel("vagas", value)} />
                  </div>
                  <TextareaInput
                    label="Fotos"
                    value={selectedImovel.imagens.join("\n")}
                    onChange={(value) => updateImovel("imagens", value.split("\n").map((line) => line.trim()).filter(Boolean))}
                  />
                  <FileInput label="Adicionar fotos do PC" multiple onChange={handlePropertyImagesUpload} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ToggleInput label="Imóvel ativo" checked={selectedImovel.ativo} onChange={(value) => updateImovel("ativo", value)} />
                    <ToggleInput
                      label="Mostrar em destaque"
                      checked={selectedImovel.destaque}
                      onChange={(value) => updateImovel("destaque", value)}
                    />
                  </div>
                </div>
              </AdminCard>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-[8px] border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-neutral-950">{title}</h2>
        {action}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-neutral-700">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring h-11 rounded-[8px] border border-neutral-200 bg-white px-3 text-neutral-950"
      />
    </label>
  );
}

function FileInput({
  label,
  multiple = false,
  onChange,
}: {
  label: string;
  multiple?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-neutral-700">
      {label}
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={onChange}
        className="focus-ring rounded-[8px] border border-dashed border-neutral-300 bg-slate-50 px-3 py-3 text-sm text-neutral-700 file:mr-4 file:rounded-[8px] file:border-0 file:bg-brand-black file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
      />
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: number;
  onChange: (value: number | undefined) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-neutral-700">
      {label}
      <input
        type="number"
        min="0"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value === "" ? undefined : Number(event.target.value))}
        className="focus-ring h-11 rounded-[8px] border border-neutral-200 bg-white px-3 text-neutral-950"
      />
    </label>
  );
}

function TextareaInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-neutral-700">
      {label}
      <textarea
        value={value}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring resize-y rounded-[8px] border border-neutral-200 bg-white px-3 py-3 text-neutral-950"
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-neutral-700">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring h-11 rounded-[8px] border border-neutral-200 bg-white px-3 text-neutral-950"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleInput({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-[8px] border border-neutral-200 bg-slate-50 p-4 text-sm font-semibold text-neutral-700">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-brand-gold"
      />
    </label>
  );
}

function slugify(value: string) {
  return value
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
