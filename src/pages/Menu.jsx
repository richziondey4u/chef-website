import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import { MENU_CATEGORIES } from '../constants';

function MenuCardSkeleton() {
  return (
    <div className="bg-white border border-gold/10 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 bg-gray-200 rounded w-2/3" />
          <div className="h-5 bg-gray-200 rounded w-12" />
        </div>
        <div className="h-3 bg-gray-100 rounded w-1/2 mt-1" />
        <div className="flex gap-1 mt-2">
          <div className="h-3 bg-gray-100 rounded w-16" />
          <div className="h-3 bg-gray-100 rounded w-16" />
        </div>
        <div className="h-3 bg-gray-100 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}

export default function Menu() {
  const [category, setCategory] = useState('all');
  const navigate = useNavigate();
  const { data: items, isLoading, isFetching } = useMenu(category);

  const loading = isLoading || isFetching;

  return (
    <section id="menu" className="py-24" style={{ background: '#FAF7F2' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-12">
          <span className="text-gold text-xs tracking-widest uppercase">Cuisine</span>
          <h2 className="font-display text-5xl md:text-6xl font-light mt-2 leading-none">
            Nigerian <em className="italic">Menu</em>
          </h2>
          <div className="w-14 h-px bg-gold my-4" />
          <p className="text-warm-gray font-body text-sm max-w-md leading-relaxed">
            A celebration of Nigeria's finest flavours, elevated with classical technique and served with pride.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-6 mb-10 border-b border-gold/20 overflow-x-auto">
          {MENU_CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`tab-btn pb-3 font-body text-sm tracking-wider uppercase whitespace-nowrap transition-all
                ${category === c ? 'active' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(6).fill(0).map((_, i) => <MenuCardSkeleton key={i} />)
            : items?.map(item => (
                <div
                  key={item.id}
                  className="bg-white border border-gold/15 card-hover overflow-hidden cursor-pointer group"
                  onClick={() => navigate(`/menu/${item.id}`)}
                >
                  {/* Image */}
                  <div className="h-44 overflow-hidden relative bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={e => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1567364816519-cbc9c4ffe1eb?w=400&h=280&fit=crop&q=80';
                      }}
                    />
                    {/* Tags */}
                    <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                      {item.tags.includes('signature') && (
                        <span className="bg-gold text-charcoal text-xs px-2 py-0.5 tracking-wide font-body">
                          Signature
                        </span>
                      )}
                      {item.tags.includes('vegetarian') && (
                        <span className="bg-deep-green text-cream text-xs px-2 py-0.5 tracking-wide font-body">
                          Vegetarian
                        </span>
                      )}
                      {item.tags.includes('spicy') && (
                        <span className="bg-red-700 text-cream text-xs px-2 py-0.5 tracking-wide font-body">
                          🌶 Spicy
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-display text-lg font-semibold leading-tight pr-2">
                        {item.name}
                      </h3>
                      <span className="font-display text-lg text-gold shrink-0">${item.price}</span>
                    </div>

                    {/* Ingredients preview — replaces description */}
                    {item.ingredients?.length > 0 && (
                      <p className="text-warm-gray text-xs font-body leading-relaxed line-clamp-1">
                        {item.ingredients.slice(0, 4).join(' · ')}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                        <span className="text-xs text-warm-gray font-body">By {item.chef}</span>
                      </div>
                      {item.area && (
                        <span className="text-xs px-2 py-0.5 border border-gold/30 text-warm-gray tracking-wide font-body">
                          {item.area}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}