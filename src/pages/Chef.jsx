import { useState } from 'react';
import { useChefs } from '../hooks/useChefs';
import SkeletonCard from '../components/shared/SkeletonCard';
import StarRating from '../components/shared/StarRating';
import ChefModal from '../components/shared/ChefModal';

export default function Chefs() {
  const { data: chefs, isLoading } = useChefs();
  const [selected, setSelected] = useState(null);

  return (
    <section id="chefs" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <span className="text-gold text-xs tracking-widest uppercase">The Team</span>
          <h2 className="font-display text-5xl md:text-6xl font-light mt-2 leading-none">
            Our <em className="italic">Master</em> Chefs
          </h2>
          <div className="w-14 h-px bg-gold my-4"/>
          <p className="text-warm-gray font-body max-w-lg leading-relaxed">
            Each member of our culinary team brings decades of refined technique and an unwavering passion for excellence.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1,2,3].map(i => <SkeletonCard key={i} className="h-80"/>)}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {chefs?.map(chef => (
              <div key={chef.id} className="card-hover cursor-pointer" onClick={() => setSelected(chef)}>
                <div className="h-72 overflow-hidden">
                  <img src={chef.image} alt={chef.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"/>
                </div>
                <div className="bg-white border border-gold/15 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display text-xl font-semibold">{chef.name}</div>
                      <div className="text-warm-gray text-xs tracking-wider uppercase mt-1">{chef.title}</div>
                    </div>
                    <StarRating rating={chef.rating}/>
                  </div>
                  <div className="w-8 h-px bg-gold my-3"/>
                  <div className="text-xs text-gold tracking-wider uppercase mb-3">{chef.specialty}</div>
                  <p className="text-warm-gray text-sm leading-relaxed line-clamp-2">{chef.bio}</p>
                  <div className="mt-4 flex gap-3">
                    <span className="text-xs px-2.5 py-1 bg-cream border border-gold/40 text-warm-gray tracking-wide">{chef.experience}</span>
                    <span className="text-xs px-2.5 py-1 bg-cream border border-gold/40 text-warm-gray tracking-wide">{chef.dishes} dishes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ChefModal chef={selected} onClose={() => setSelected(null)}/>
    </section>
  );
}