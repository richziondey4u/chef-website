import { useNavigate } from "react-router-dom";
import hero from "../assets/videos/hero.mp4";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1A2E1E 0%, #2D1B0E 40%, #1C1C1C 100%)",
      }}
    >
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9A84C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative circles — desktop only */}
      <div className="absolute top-1/4 right-10 w-64 h-64 rounded-full border border-gold opacity-10 hidden md:block pointer-events-none" />
      <div className="absolute top-1/3 right-20 w-40 h-40 rounded-full border border-gold opacity-5 hidden md:block pointer-events-none" />

      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-6 w-full pt-28 pb-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* ── Left: copy ── */}
        <div className="flex flex-col order-2 md:order-1">
          <div className="hero-text">
            <span className="text-gold text-xs tracking-widest uppercase font-body">
              Est. 2007 · Paris &amp; New York
            </span>
            <h1
              className="font-display text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-cream mt-4 leading-none"
              style={{ letterSpacing: "-0.02em" }}
            >
              The Art of
              <br />
              <em className="italic text-gold">Fine</em> Dining
            </h1>
          </div>

          <div className="hero-sub">
            <div className="w-14 h-px bg-gold mt-6" />
            <p className="font-body text-warm-gray text-base md:text-lg font-light mt-4 leading-relaxed max-w-md">
              Private chef experiences, bespoke catering, and culinary
              excellence for the occasions that define your story.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="hero-cta flex flex-wrap gap-4 mt-10">
            <button
              onClick={() => navigate("/menu")}
              className="bg-transparent text-cream text-xs tracking-widest uppercase
                px-8 py-4 border border-cream/70
                hover:bg-cream hover:text-charcoal hover:border-cream
                active:scale-95 transition-all duration-300 cursor-pointer"
            >
              Explore Menu
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="bg-gold text-charcoal text-xs tracking-widest uppercase
                px-8 py-4 border border-gold
                hover:bg-gold/80 hover:border-gold/80
                active:scale-95 transition-all duration-300 cursor-pointer"
            >
              Book a Chef
            </button>
          </div>

          {/* Stats */}
          <div className="mt-12 flex gap-10">
            {[
              ["★ 4.9", "Average Rating"],
              ["2,400+", "Events Catered"],
            ].map(([val, lbl]) => (
              <div key={lbl}>
                <div className="font-display text-3xl text-cream">{val}</div>
                <div className="font-body text-xs text-warm-gray tracking-widest uppercase mt-1">
                  {lbl}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: single chef portrait ── */}
        {/* ── Right: Luxury Video Showcase ── */}
        <div className="relative flex items-center justify-center order-1 md:order-2 h-[420px] sm:h-[520px] lg:h-[620px]">
          {/* Decorative background frame */}
          <div
            className="absolute top-6 right-6 w-[82%] h-[90%] hidden md:block"
            style={{
              border: "1px solid rgba(201,168,76,0.18)",
              background: "rgba(201,168,76,0.03)",
            }}
          />

          {/* Main video container */}
          <div
            className="relative z-10 w-full md:w-[82%] h-full overflow-hidden rounded-sm shadow-2xl"
            style={{
              border: "1px solid rgba(201,168,76,0.35)",
            }}
          >
            {/* Video */}
            <video
              src={hero}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Dark cinematic overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.1) 100%)",
              }}
            />

            {/* Michelin badge top */}
            <div className="absolute top-5 left-5 z-20">
              <div className="bg-gold text-charcoal px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-semibold shadow-xl">
                ★ Michelin Recognised
              </div>
            </div>

            {/* Bottom chef details */}
            <div className="absolute bottom-0 left-0 right-0 z-20 px-6 py-6">
              <div
                className="text-gold uppercase tracking-[0.3em] mb-2"
                style={{ fontSize: "11px" }}
              >
                Executive Chef
              </div>

              <h2 className="text-3xl md:text-4xl font-display text-cream font-light leading-none">
                Isabelle Fontaine
              </h2>

              <p className="text-warm-gray text-sm mt-3 max-w-sm leading-relaxed">
                Crafting unforgettable culinary experiences with elegance,
                precision, and modern French artistry.
              </p>
            </div>

            {/* Bottom right luxury tag */}
            <div className="absolute bottom-5 right-5 z-20">
              <div className="border border-gold/40 bg-black/30 backdrop-blur-sm px-4 py-2">
                <span className="text-gold text-[10px] uppercase tracking-[0.25em]">
                  Luxury Dining
                </span>
              </div>
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 md:left-[8%] w-8 h-8 border-t-2 border-l-2 border-gold/40 z-20" />

          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold/40 z-20" />

          {/* Vertical side text */}
          <div
            className="absolute left-0 md:left-[1%] top-1/2 hidden md:block"
            style={{
              writingMode: "vertical-rl",
              transform: "translateY(-50%) rotate(180deg)",
            }}
          >
            <span className="text-gold/30 text-[11px] tracking-[0.3em] uppercase">
              Maison Fontaine · Since 2007
            </span>
          </div>
        </div>
      </div>

      {/* Marquee — bottom strip */}
      <div className="absolute bottom-0 left-0 right-0 py-3 overflow-hidden border-t border-gold/20">
        <div className="flex whitespace-nowrap marquee-track">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <span
                key={i}
                className="font-display text-sm italic text-gold mx-8 opacity-50 select-none"
              >
                Private Dining&nbsp;·&nbsp;Weddings&nbsp;·&nbsp;Corporate
                Events&nbsp;·&nbsp; Tasting Menus&nbsp;·&nbsp;Cooking
                Classes&nbsp;·&nbsp;Pop-Up Experiences&nbsp;·
              </span>
            ))}
        </div>
      </div>
    </section>
  );
}
