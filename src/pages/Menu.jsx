import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import SkeletonCard from '../components/shared/SkeletonCard';
import { MENU_CATEGORIES } from '../constants';

export default function Menu() {
  const [category, setCategory] = useState('all');
  const { data: items, isLoading, isFetching } = useMenu(category);
  const navigate = useNavigate();

  const handleCardClick = (item) => {
    navigate('/order', { state: { selectedItem: item } });
  };

  return (
    <section id="menu" className="py-24" style={{ background: '#FAF7F2' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <span className="text-gold text-xs tracking-widest uppercase">Cuisine</span>
          <h2 className="font-display text-5xl md:text-6xl font-light mt-2 leading-none">
            Seasonal <em className="italic">Menu</em>
          </h2>
          <div className="w-14 h-px bg-gold my-4"/>
        </div>

        <div className="flex gap-8 mb-10 border-b border-gold/20">
          {MENU_CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`tab-btn pb-3 font-body text-sm tracking-wider uppercase ${category === c ? 'active' : ''}`}>
              {c}
            </button>
          ))}
        </div>

        {isLoading || isFetching ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} className="h-64"/>)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items?.map(item => (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="bg-white border border-gold/15 card-hover overflow-hidden cursor-pointer"
              >
                <div className="h-44 overflow-hidden relative">
                  <img src={item.image} alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"/>
                  <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                    {item.tags.includes('signature') && (
                      <span className="bg-gold text-charcoal text-xs px-2 py-0.5 tracking-wide">Signature</span>
                    )}
                    {item.tags.includes('vegetarian') && (
                      <span className="bg-deep-green text-cream text-xs px-2 py-0.5 tracking-wide">Vegetarian</span>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-xl font-semibold">{item.name}</h3>
                    <span className="font-display text-xl text-gold ml-4">${item.price}</span>
                  </div>
                  <p className="text-warm-gray text-sm leading-relaxed">{item.description}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold"/>
                    <span className="text-xs text-warm-gray">By {item.chef}</span>
                  </div>
                  {item.area && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
                      <span className="text-xs text-warm-gray/60 tracking-wide">{item.area} cuisine</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}