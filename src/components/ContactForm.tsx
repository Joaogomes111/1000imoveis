"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

import { buildWhatsappUrl, resolveWhatsappNumber } from "@/lib/whatsapp";
import type { Imovel, SiteConfig } from "@/types/content";

type ContactFormProps = {
  config: SiteConfig;
  imovel?: Imovel;
};

export function ContactForm({ config, imovel }: ContactFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    imovel ? `Olá, tenho interesse no imóvel ${imovel.titulo}.` : "Olá, gostaria de atendimento da 1000 Imóveis.",
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fullMessage = [
      name ? `Nome: ${name}` : "",
      phone ? `Telefone: ${phone}` : "",
      message,
      imovel ? `Imóvel: ${imovel.titulo}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(buildWhatsappUrl(resolveWhatsappNumber(config), fullMessage), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="grid gap-2 text-sm font-semibold text-neutral-700">
        Nome
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="focus-ring h-12 rounded-[8px] border border-neutral-200 bg-white px-3 text-neutral-950"
          placeholder="Seu nome"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-neutral-700">
        Telefone
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="focus-ring h-12 rounded-[8px] border border-neutral-200 bg-white px-3 text-neutral-950"
          placeholder="(47) 99999-9999"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-neutral-700">
        Mensagem
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={5}
          className="focus-ring resize-none rounded-[8px] border border-neutral-200 bg-white px-3 py-3 text-neutral-950"
        />
      </label>
      <button
        type="submit"
        className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-brand-black px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
      >
        <Send size={18} />
        Enviar pelo WhatsApp
      </button>
    </form>
  );
}
