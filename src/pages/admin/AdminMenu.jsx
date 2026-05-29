import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, Plus, X, Save } from 'lucide-react';
import { useMenu } from '../../hooks/useMenu';
import toast from 'react-hot-toast';

const EMPTY_DISH = {
  name: '', category: 'starters', price: '', description: '',
  chef: '', area: '', image: '', tags: [], ingredients: [],
  addons: [],
};

const CATEGORIES  = ['starters', 'mains', 'desserts'];
const CHEFS       = ['Marcus Osei', 'Isabelle Fontaine', 'Yuki Tanaka'];
const ALL_TAGS    = ['signature', 'spicy', 'vegetarian', 'premium', 'seasonal'];

export default function AdminMenu() {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState('all');
  const { data: dishes = [], isLoading } = useMenu(category);

  const [editing, setEditing] = useState(null);   // null | dish object
  const [isNew,   setIsNew]   = useState(false);
  const [saving,  setSaving]  = useState(false);

  // For this component we edit the local JSON data (chefApi.js)
  // When you have a real backend, replace these with API calls
  const openEdit = (dish) => { setEditing({ ...dish }); setIsNew(false); };
  const openNew  = ()     => { setEditing({ ...EMPTY_DISH }); setIsNew(true); };
  const closeEdit= ()     => { setEditing(null); setIsNew(false); };

  const handleChange = e => {
    const { name, value } = e.target;
    setEditing(prev => ({ ...prev, [name]: value }));
  };

  const toggleTag = (tag) => {
    setEditing(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleIngredientsChange = e => {
    setEditing(prev => ({
      ...prev,
      ingredients: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
    }));
  };

  // For a real backend, call your API here instead
  const handleSave = async () => {
    if (!editing.name || !editing.price || !editing.description) {
      toast.error('Name, price and description are required');
      return;
    }
    setSaving(true);
    // Simulate save delay
    await new Promise(r => setTimeout(r, 800));
    // Invalidate React Query cache so menu re-fetches
    await queryClient.invalidateQueries({ queryKey: ['menu'] });
    toast.success(isNew ? 'Dish added!' : 'Dish updated!');
    setSaving(false);
    closeEdit();
  };

  const handleDelete = async (dish) => {
    if (!confirm(`Delete "${dish.name}"? This cannot be undone.`)) return;
    // Call your API here
    await queryClient.invalidateQueries({ queryKey: ['menu'] });
    toast.success(`"${dish.name}" deleted`);
  };

  const inputCls = `w-full bg-transparent border-b border-warm-gray/30 py-2.5
    font-body text-sm text-charcoal placeholder-warm-gray/50
    focus:border-gold focus:outline-none transition-colors`;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-light text-charcoal">Menu</h1>
          <p className="text-warm-gray font-body text-sm mt-1">
            {dishes.length} dishes
          </p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-gold text-charcoal text-xs
            tracking-widest uppercase px-6 py-3 hover:bg-gold/80 transition-all font-body">
          <Plus size={14} />
          Add Dish
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-3 mb-6 overflow-x-auto">
        {['all', ...CATEGORIES].map(c => (
          <button key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 text-xs font-body tracking-wide capitalize
              whitespace-nowrap border transition-all
              ${category === c
                ? 'bg-charcoal text-cream border-charcoal'
                : 'bg-white text-warm-gray border-warm-gray/30 hover:border-gold'}`}>
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {dishes.map(dish => (
            <div key={dish.id}
              className="bg-white border border-gold/15 overflow-hidden group">
              <div className="h-36 overflow-hidden relative">
                <img src={dish.image} alt={dish.name}
                  className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0
                  group-hover:opacity-100 transition-opacity flex items-center
                  justify-center gap-3">
                  <button onClick={() => openEdit(dish)}
                    className="p-2 bg-gold text-charcoal hover:bg-gold/80 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(dish)}
                    className="p-2 bg-red-500 text-white hover:bg-red-600 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-base font-semibold leading-tight pr-2">
                    {dish.name}
                  </h3>
                  <span className="font-display text-base text-gold shrink-0">
                    ${dish.price}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-warm-gray font-body capitalize">
                    {dish.category}
                  </span>
                  <span className="text-warm-gray/30">·</span>
                  <span className="text-xs text-warm-gray font-body">{dish.area}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {dish.tags?.map(tag => (
                    <span key={tag}
                      className="text-xs px-1.5 py-0.5 bg-gold/10 text-gold
                        border border-gold/20 font-body capitalize">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(28,28,28,0.85)', backdropFilter: 'blur(6px)' }}>
          <div className="bg-cream w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between px-8 py-5
              border-b border-gold/20 sticky top-0 bg-cream z-10">
              <h2 className="font-display text-2xl font-light">
                {isNew ? 'Add New Dish' : `Edit — ${editing.name}`}
              </h2>
              <button onClick={closeEdit}
                className="text-warm-gray hover:text-charcoal transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-gold text-xs tracking-widest uppercase block mb-2"
                    style={{ fontSize: 9 }}>Dish Name *</label>
                  <input name="name" value={editing.name} onChange={handleChange}
                    placeholder="e.g. Jollof Rice Royal" className={inputCls} />
                </div>
                <div>
                  <label className="text-gold text-xs tracking-widest uppercase block mb-2"
                    style={{ fontSize: 9 }}>Category *</label>
                  <select name="category" value={editing.category} onChange={handleChange}
                    className={inputCls} style={{ appearance: 'none' }}>
                    {CATEGORIES.map(c => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gold text-xs tracking-widest uppercase block mb-2"
                    style={{ fontSize: 9 }}>Price ($) *</label>
                  <input name="price" type="number" value={editing.price}
                    onChange={handleChange} placeholder="38" className={inputCls} />
                </div>
                <div>
                  <label className="text-gold text-xs tracking-widest uppercase block mb-2"
                    style={{ fontSize: 9 }}>Chef</label>
                  <select name="chef" value={editing.chef} onChange={handleChange}
                    className={inputCls} style={{ appearance: 'none' }}>
                    <option value="">Select chef</option>
                    {CHEFS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gold text-xs tracking-widest uppercase block mb-2"
                    style={{ fontSize: 9 }}>Area / Region</label>
                  <input name="area" value={editing.area} onChange={handleChange}
                    placeholder="e.g. Lagos, Igbo, Hausa" className={inputCls} />
                </div>
                <div className="col-span-2">
                  <label className="text-gold text-xs tracking-widest uppercase block mb-2"
                    style={{ fontSize: 9 }}>Description *</label>
                  <textarea name="description" value={editing.description}
                    onChange={handleChange} rows={3}
                    placeholder="Describe the dish..."
                    className={`${inputCls} resize-none`} />
                </div>
                <div className="col-span-2">
                  <label className="text-gold text-xs tracking-widest uppercase block mb-2"
                    style={{ fontSize: 9 }}>Image URL</label>
                  <input name="image" value={editing.image} onChange={handleChange}
                    placeholder="https://images.unsplash.com/..." className={inputCls} />
                  {editing.image && (
                    <img src={editing.image} alt="preview"
                      className="h-24 w-full object-cover mt-2 border border-gold/20" />
                  )}
                </div>
                <div className="col-span-2">
                  <label className="text-gold text-xs tracking-widest uppercase block mb-2"
                    style={{ fontSize: 9 }}>Ingredients (comma-separated)</label>
                  <input
                    value={editing.ingredients?.join(', ')}
                    onChange={handleIngredientsChange}
                    placeholder="Beef, Onion, Tomatoes, Palm oil..."
                    className={inputCls}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-gold text-xs tracking-widest uppercase block mb-3"
                    style={{ fontSize: 9 }}>Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_TAGS.map(tag => (
                      <button key={tag} type="button" onClick={() => toggleTag(tag)}
                        className={`text-xs px-3 py-1.5 border font-body capitalize
                          transition-all ${editing.tags?.includes(tag)
                            ? 'bg-charcoal text-cream border-charcoal'
                            : 'bg-white text-warm-gray border-warm-gray/30 hover:border-gold'}`}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 bg-charcoal text-cream text-xs
                    tracking-widest uppercase px-8 py-3 hover:bg-gold hover:text-charcoal
                    transition-all font-body disabled:opacity-60">
                  {saving
                    ? <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                    : <Save size={14} />
                  }
                  {isNew ? 'Add Dish' : 'Save Changes'}
                </button>
                <button onClick={closeEdit}
                  className="border border-warm-gray/30 text-warm-gray text-xs
                    tracking-widest uppercase px-8 py-3 hover:border-charcoal
                    hover:text-charcoal transition-all font-body">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}