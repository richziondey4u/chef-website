import StarRating from '../shared/StarRating';

export default function ChefModal({ chef, onClose }) {
  if (!chef) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(28,28,28,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="bg-cream max-w-2xl w-full max-h-screen overflow-y-auto animate-fade-up"
        onClick={e => e.stopPropagation()}>
        <div className="relative h-64 overflow-hidden">
          <img src={chef.image} alt={chef.name} className="w-full h-full object-cover object-top"/>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-cream flex items-center justify-center hover:bg-gold transition-colors text-lg">
            ×
          </button>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="section-label text-gold text-xs tracking-widest uppercase">{chef.title}</span>
            <StarRating rating={chef.rating}/>
          </div>
          <h3 className="font-display text-4xl mt-1">{chef.name}</h3>
          <div className="w-14 h-px bg-gold my-4"/>
          <p className="text-warm-gray leading-relaxed">{chef.bio}</p>
          <div className="mt-6">
            <div className="text-xs tracking-widest uppercase text-gold mb-3">Recognition</div>
            {chef.awards.map(a => (
              <div key={a} className="flex items-center gap-2 mb-2">
                <span className="text-gold text-xs">★</span>
                <span className="font-body text-sm">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}