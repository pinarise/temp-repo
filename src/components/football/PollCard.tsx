import { IMG } from "../../constants/data";

export type PollOption = { label: string; value: number };
export type Poll = {
  title?: string;
  subtitle?: string;
  prompt?: string;
  options: PollOption[];
  cta?: string;
  rating?: boolean;
};

export function PollCard({ poll }: { poll: Poll }) {
  return (
    <div className="relative rounded-xl overflow-hidden bg-brand-dark text-white p-5 lg:p-6 min-h-[260px]">
      <img
        src={IMG.celebrate}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/80 to-brand-dark/90" />
      <div className="relative z-10 flex flex-col h-full">
        <div className="text-center mb-4">
          {poll.title && (
            <h3 className="text-base lg:text-lg font-bold leading-tight">{poll.title}</h3>
          )}
          {poll.subtitle && (
            <p className="text-2xl lg:text-3xl font-extrabold mt-1">{poll.subtitle}</p>
          )}
          {poll.prompt && (
            <p className="text-[11px] lg:text-xs opacity-80 mt-2 max-w-xs mx-auto">{poll.prompt}</p>
          )}
        </div>
        <div className="space-y-2.5 mt-auto">
          {poll.options.map((o, i) => (
            <div
              key={i}
              className="relative flex items-center justify-between bg-black/60 rounded-full px-4 py-2 text-xs lg:text-sm overflow-hidden"
            >
              <div
                className="absolute left-0 top-0 bottom-0 bg-white/15 pointer-events-none"
                style={{ width: `${o.value}%` }}
              />
              <span className="relative font-medium tracking-wide">
                {poll.rating ? (
                  <span className="text-yellow-400 text-base lg:text-lg leading-none">
                    {"★".repeat(poll.options.length - i)}
                  </span>
                ) : (
                  o.label
                )}
              </span>
              <span className="relative font-semibold">{o.value}%</span>
            </div>
          ))}
        </div>
        {poll.cta && (
          <button className="mt-4 w-full bg-highlight text-highlight-foreground font-bold py-2.5 rounded-full text-sm">
            {poll.cta}
          </button>
        )}
      </div>
    </div>
  );
}
