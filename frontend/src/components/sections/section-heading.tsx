export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 space-y-2">
      <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">{eyebrow}</p>
      <h2 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">{title}</h2>
      {description && <p className="max-w-2xl text-muted-foreground">{description}</p>}
    </div>
  );
}
