import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";

import { ContactForm } from "@/components/ContactForm";
import { SectionTitle } from "@/components/SectionTitle";
import { getContent } from "@/lib/content-store";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a 1000 Imóveis em Itajaí por WhatsApp, e-mail ou formulário.",
};

export default async function ContatoPage() {
  const content = await getContent();
  const config = content.siteConfig;

  return (
    <section className="bg-slate-50 pb-20 pt-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <SectionTitle
            eyebrow="Contato"
            title="Fale com a 1000 Imóveis"
            subtitle="Atendimento para compra, venda, locação e captação de imóveis em Itajaí."
          />
          <div className="mt-8 grid gap-4">
            <ContactInfo icon={<MessageCircle size={20} />} title="WhatsApp" text="Use o botão verde para iniciar a conversa." />
            <ContactInfo icon={<Mail size={20} />} title="E-mail" text={config.email} />
            <ContactInfo icon={<MapPin size={20} />} title="Endereço" text={config.endereco} />
            <ContactInfo icon={<Clock size={20} />} title="Horário" text={config.horario} />
          </div>
        </div>

        <div className="rounded-[8px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">
          <ContactForm config={config} />
        </div>
      </div>
    </section>
  );
}

function ContactInfo({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-[8px] border border-neutral-200 bg-white p-4">
      <span className="text-brand-gold-dark">{icon}</span>
      <span>
        <strong className="block text-neutral-950">{title}</strong>
        <span className="text-sm text-neutral-600">{text}</span>
      </span>
    </div>
  );
}
