import { useNavigate } from 'react-router-dom';
import { SERVICES } from '../constants';
import { ArrowRight } from 'lucide-react';

export default function Events() {
  const navigate = useNavigate();

  return (
    <section id="events" className="py-24 bg-charcoal">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-14">
          <span className="text-gold text-xs tracking-widest uppercase">Services</span>
          <h2 className="font-display text-5xl md:text-6xl font-light text-cream mt-2 leading-none">
            Every <em className="italic text-gold">Occasion</em>
          </h2>
          <div className="w-14 h-px bg-gold my-4" />
          <p className="text-warm-gray font-body max-w-lg leading-relaxed">
            Whether an intimate birthday dinner or a gala for five hundred — we craft
            experiences as unique as the moments they celebrate.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s, i) => (
            <div
              key={i}
              onClick={() => navigate(s.path)}
              className="relative p-8 cursor-pointer group border border-gold/15
                overflow-hidden transition-all duration-300
                hover:border-gold/40 hover:-translate-y-1
                hover:shadow-2xl hover:shadow-black/40"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              {/* Hover glow background */}
              <div className={`absolute inset-0 bg-gradient-to-b ${s.color}
                opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div className="text-4xl mb-5 transition-transform duration-300 group-hover:scale-110 inline-block">
                  {s.icon}
                </div>

                {/* Title */}
                <h3 className="font-display text-2xl text-cream font-light mb-3
                  group-hover:text-gold transition-colors duration-300">
                  {s.title}
                </h3>

                {/* Description */}
                <p className="text-warm-gray text-sm leading-relaxed mb-6">
                  {s.desc}
                </p>

                {/* Features list — visible on hover */}
                <ul className="space-y-1.5 mb-6 max-h-0 overflow-hidden
                  group-hover:max-h-40 transition-all duration-500">
                  {s.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-cream/70 font-body">
                      <span className="w-1 h-1 rounded-full bg-gold shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="w-8 h-px bg-gold mb-4" />

                {/* Price + CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-gold font-body text-sm tracking-wide">{s.from}</span>
                  <div className="flex items-center gap-1 text-gold/60 group-hover:text-gold
                    group-hover:gap-2 transition-all duration-300">
                    <span className="text-xs font-body tracking-widest uppercase">Book</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-16 border border-gold/20 p-8 flex flex-col md:flex-row
          items-center justify-between gap-6">
          <div>
            <div className="font-display text-2xl text-cream font-light">
              Not sure which service fits?
            </div>
            <p className="text-warm-gray text-sm mt-1 font-body">
              Talk to us and we'll recommend the perfect package for your occasion.
            </p>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="shrink-0 bg-gold text-charcoal text-xs tracking-widest uppercase
              px-8 py-4 hover:bg-gold/80 transition-all font-body font-medium"
          >
            Get a Custom Quote
          </button>
        </div>
      </div>
    </section>
  );
}