import { useState, useEffect } from 'react';
import { useTestimonials } from '../hooks/useTestimonials';
import SkeletonCard from '../components/shared/SkeletonCard';

export default function Testimonials() {
  const { data, isLoading } = useTestimonials();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prev => (data ? (prev + 1) % data.length : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, [data]);

  return (
    <section id="testimonials" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14 text-center">
          <span className="text-gold text-xs tracking-widest uppercase">Reviews</span>
          <h2 className="font-display text-5xl md:text-6xl font-light mt-2">
            What Guests <em className="italic">Say</em>
          </h2>
          <div className="w-14 h-px bg-gold mx-auto mt-4"/>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1,2].map(i => <SkeletonCard key={i} className="h-40"/>)}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {data?.map((t, i) => (
                <div key={t.id} onClick={() => setActive(i)}
                  className={`p-8 cursor-pointer transition-all duration-300 border-l-4 border-gold bg-white
                    ${active === i ? 'shadow-lg scale-[1.01]' : 'opacity-70'}`}>
                  <div className="flex gap-1 mb-4">
                    {Array(t.stars).fill(0).map((_, j) => <span key={j} className="text-gold text-sm">★</span>)}
                  </div>
                  <p className="font-display text-lg font-light italic text-charcoal leading-relaxed mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center font-body text-sm font-medium text-charcoal">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-body text-sm font-medium">{t.name}</div>
                      <div className="font-body text-xs text-warm-gray">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-8">
              {data?.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-300 ${active === i ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-gold-light'}`}/>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}