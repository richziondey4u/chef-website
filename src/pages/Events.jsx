import { SERVICES } from '../constants';

export default function Events() {
  return (
    <section id="events" className="py-24 bg-charcoal">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <span className="text-gold text-xs tracking-widest uppercase">Services</span>
          <h2 className="font-display text-5xl md:text-6xl font-light text-cream mt-2 leading-none">
            Every <em className="italic text-gold">Occasion</em>
          </h2>
          <div className="w-14 h-px bg-gold my-4"/>
          <p className="text-warm-gray font-body max-w-lg leading-relaxed">
            Whether an intimate birthday dinner or a gala for five hundred — we craft experiences as unique as the moments they celebrate.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s, i) => (
            <div key={i} className="p-8 card-hover cursor-pointer group border border-gold/15 bg-white/3">
              <div className="text-3xl mb-5">{s.icon}</div>
              <h3 className="font-display text-2xl text-cream font-light mb-3 group-hover:text-gold transition-colors">{s.title}</h3>
              <p className="text-warm-gray text-sm leading-relaxed mb-6">{s.desc}</p>
              <div className="w-8 h-px bg-gold"/>
              <div className="text-gold font-body text-sm tracking-wide mt-4">{s.from}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}