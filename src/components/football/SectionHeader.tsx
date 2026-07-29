export function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="relative inline-block text-xl lg:text-2xl font-bold text-foreground mb-4 pb-2 border-b-2 border-border">
      <span className="relative z-10">{title}</span>
      <span className="absolute -bottom-[2px] left-0 h-[3px] w-24 bg-brand" />
    </h2>
  );
}
