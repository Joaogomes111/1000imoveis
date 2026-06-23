type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export function SectionTitle({ eyebrow, title, subtitle, align = "left" }: SectionTitleProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-gold-dark">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-normal text-neutral-950 md:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-base leading-7 text-neutral-600">{subtitle}</p> : null}
    </div>
  );
}
