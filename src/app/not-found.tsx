import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center bg-slate-50 px-4 pt-24 text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-gold-dark">404</p>
        <h1 className="mt-3 text-3xl font-bold text-neutral-950">Página não encontrada</h1>
        <p className="mt-3 text-neutral-600">O endereço acessado não está disponível.</p>
        <Link
          href="/"
          className="focus-ring mt-8 inline-flex h-11 items-center justify-center rounded-[8px] bg-brand-black px-5 text-sm font-bold text-white"
        >
          Voltar para o início
        </Link>
      </div>
    </section>
  );
}
