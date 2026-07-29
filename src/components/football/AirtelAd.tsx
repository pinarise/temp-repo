export function AirtelAd() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-md"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 45%, rgba(120,40,30,0.55) 75%, rgba(180,60,40,0.85) 100%), url(https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1600&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center justify-between px-4 lg:px-8 py-3 lg:py-6">
        <div className="flex items-center gap-3 lg:gap-5 text-white">
          <div className="flex items-center gap-1 leading-none">
            <span className="text-base lg:text-2xl font-extrabold tracking-tight text-red-500">airtel</span>
          </div>
          <div className="hidden lg:block w-px h-10 bg-white/30" />
          <div className="leading-tight">
            <p className="text-[10px] lg:text-sm">Unlimited Data for</p>
            <p className="text-sm lg:text-3xl font-extrabold">Unlimited Entertainment</p>
            <p className="hidden lg:block text-[11px] mt-1 text-white/80">Enjoy unlimited data, plus up to 6-hour backup battery.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-red-600 text-white text-[10px] lg:text-sm font-bold px-2 py-1 rounded">5G</div>
          <div className="h-8 lg:h-14 w-3 lg:w-5 bg-white rounded-sm" />
        </div>
      </div>
    </div>
  );
}
