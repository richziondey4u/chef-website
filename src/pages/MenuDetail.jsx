import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDishById } from '../api/chefApi';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Minus, Plus, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MenuDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { user, profile } = useAuth();

  const [orderType, setOrderType]       = useState('Dine in');
  const [quantity, setQuantity]         = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [note, setNote]                 = useState('');
  const [ordered, setOrdered]           = useState(false);
  const [placing, setPlacing]           = useState(false);

  const { data: dish, isLoading } = useQuery({
    queryKey: ['dish', id],
    queryFn:  () => getDishById(id),
  });

  const toggleAddon = (addon) => {
    setSelectedAddons(prev =>
      prev.find(a => a.label === addon.label)
        ? prev.filter(a => a.label !== addon.label)
        : [...prev, addon]
    );
  };

  const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const total      = dish ? (dish.price + addonTotal) * quantity : 0;

  const handlePlaceOrder = async () => {
    // If not logged in — redirect to auth then come back
    if (!user) {
      toast('Please sign in to place an order', { icon: '🔐' });
      navigate('/auth', { state: { from: { pathname: `/menu/${id}` } } });
      return;
    }

    setPlacing(true);
    try {
      const orderPayload = {
        user_id:              user.id,
        user_email:           user.email,
        dish_id:              dish.id,
        dish_name:            dish.name,
        dish_price:           dish.price,
        quantity,
        addons:               selectedAddons,
        order_type:           orderType,
        special_instructions: note || null,
        total:                parseFloat(total.toFixed(2)),
        status:               'pending',
      };

      const { error } = await supabase
        .from('orders')
        .insert(orderPayload);

      if (error) throw error;

      setOrdered(true);
      toast.success(`Order placed! ${dish.name} is on its way.`, {
        icon: '🍽️', duration: 4000,
      });
    } catch (err) {
      toast.error(`Failed to place order: ${err.message}`);
    } finally {
      setPlacing(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent
          rounded-full animate-spin" />
      </div>
    );
  }

  // ── Not found ────────────────────────────────────────────
  if (!dish) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center
        text-center px-6">
        <div>
          <p className="font-display text-3xl text-charcoal mb-4">Dish not found</p>
          <button onClick={() => navigate('/menu')}
            className="text-gold text-sm tracking-widest uppercase font-body
              hover:underline">
            ← Back to menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* Back */}
      <div className="max-w-2xl mx-auto px-6 pt-8 pb-2">
        <button onClick={() => navigate('/menu')}
          className="flex items-center gap-2 text-warm-gray hover:text-gold
            transition-colors font-body text-sm">
          <ArrowLeft size={14} /> Back to menu
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-20">

        {/* Hero image */}
        <div className="relative h-64 sm:h-80 overflow-hidden mt-4 bg-gray-100">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
            onError={e => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1567364816519-cbc9c4ffe1eb?w=600&h=400&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(28,28,28,0.75) 0%, transparent 50%)',
            }}
          />
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            <span className="text-gold font-body text-xs tracking-widest uppercase">
              Chef's Selection
            </span>
          </div>
          <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
            {dish.tags?.map(tag => (
              <span key={tag}
                className="bg-white/20 backdrop-blur-sm border border-white/30
                  text-white text-xs px-2.5 py-0.5 font-body tracking-wide capitalize">
                {tag}
              </span>
            ))}
            {dish.area && (
              <span className="bg-gold/90 text-charcoal text-xs px-2.5 py-0.5
                font-body tracking-wide">
                {dish.area}
              </span>
            )}
          </div>
        </div>

        {/* Dish info */}
        <div className="mt-6 mb-2">
          <h1 className={`font-display font-light leading-tight text-charcoal
            ${dish.name.length > 20 ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'}`}>
            {dish.name}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-display text-2xl text-gold">
              ${dish.price}
            </span>
            <span className="text-warm-gray text-xs font-body">
              · By {dish.chef}
            </span>
          </div>
        </div>

        <p className="text-warm-gray font-body leading-relaxed text-sm mb-6">
          {dish.description}
        </p>

        {/* Ingredients */}
        {dish.ingredients?.length > 0 && (
          <div className="mb-8">
            <div className="text-xs tracking-widest uppercase text-gold font-body mb-3">
              Key Ingredients
            </div>
            <div className="flex flex-wrap gap-2">
              {dish.ingredients.map(ing => (
                <span key={ing}
                  className="text-xs px-3 py-1 border border-gold/25 text-warm-gray
                    font-body tracking-wide bg-white">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Order type */}
        <div className="bg-white border border-gold/15 p-6 mb-4">
          <div className="text-xs tracking-widest uppercase text-warm-gray font-body mb-4">
            Order Type
          </div>
          <div className="flex gap-3 flex-wrap">
            {['Dine in', 'Takeaway', 'Delivery'].map(type => (
              <button key={type} onClick={() => setOrderType(type)}
                className={`px-5 py-2.5 text-sm font-body tracking-wide border
                  transition-all
                  ${orderType === type
                    ? 'border-gold text-charcoal bg-gold/10'
                    : 'border-warm-gray/30 text-warm-gray hover:border-gold/50'}`}>
                {type}
              </button>
            ))}
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <div className="text-xs tracking-widest uppercase text-warm-gray font-body mb-3">
              Quantity
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-warm-gray/30">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center
                    hover:bg-gold/10 transition-colors text-charcoal">
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-body text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center
                    hover:bg-gold/10 transition-colors text-charcoal">
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-warm-gray text-sm font-body">
                × ${dish.price.toFixed(2)} each
              </span>
            </div>
          </div>
        </div>

        {/* Add-ons */}
        {dish.addons?.length > 0 && (
          <div className="bg-white border border-gold/15 p-6 mb-4">
            <div className="text-xs tracking-widest uppercase text-warm-gray
              font-body mb-4">
              Extras & Add-ons
            </div>
            <div className="space-y-3">
              {dish.addons.map(addon => {
                const selected = !!selectedAddons.find(a => a.label === addon.label);
                return (
                  <label key={addon.label}
                    className="flex items-center justify-between cursor-pointer
                      group py-2 border-b border-gold/10 last:border-0">
                    <div className="flex items-center gap-3"
                      onClick={() => toggleAddon(addon)}>
                      <div className={`w-5 h-5 border flex items-center justify-center
                        transition-all shrink-0
                        ${selected
                          ? 'border-gold bg-gold'
                          : 'border-warm-gray/40 group-hover:border-gold/60'}`}>
                        {selected && (
                          <Check size={11} className="text-charcoal" strokeWidth={3} />
                        )}
                      </div>
                      <span className="font-body text-sm text-charcoal">
                        {addon.label}
                      </span>
                    </div>
                    <span className="font-body text-sm text-gold">
                      +${addon.price.toFixed(2)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Special instructions */}
        <div className="bg-white border border-gold/15 p-6 mb-6">
          <div className="text-xs tracking-widest uppercase text-warm-gray font-body mb-3">
            Special Instructions
          </div>
          <textarea
            rows={3}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Allergies, spice level preference, or anything for the chef..."
            className="w-full bg-transparent border border-warm-gray/20 p-3 font-body
              text-sm text-charcoal placeholder-warm-gray/50 resize-none
              focus:border-gold focus:outline-none transition-colors"
          />
        </div>

        {/* Login prompt if not signed in */}
        {!user && (
          <div className="bg-gold/10 border border-gold/30 p-4 mb-4 flex
            items-center gap-3">
            <span className="text-gold text-lg">🔐</span>
            <div>
              <p className="font-body text-sm text-charcoal font-medium">
                Sign in to place an order
              </p>
              <p className="font-body text-xs text-warm-gray mt-0.5">
                Your order history will be saved to your account
              </p>
            </div>
          </div>
        )}

        {/* Order summary + CTA */}
        <div className="bg-charcoal p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-cream font-body text-sm tracking-wide">
              {quantity} × {dish.name}
            </span>
            <span className="font-display text-lg text-cream">
              ${(dish.price * quantity).toFixed(2)}
            </span>
          </div>
          {selectedAddons.length > 0 && (
            <div className="space-y-1 mb-2">
              {selectedAddons.map(a => (
                <div key={a.label}
                  className="flex items-center justify-between">
                  <span className="text-warm-gray font-body text-xs">
                    + {a.label}
                  </span>
                  <span className="text-warm-gray font-body text-xs">
                    +${(a.price * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="border-t border-warm-gray/20 pt-3 mt-3 flex items-center
            justify-between mb-4">
            <span className="text-cream font-body text-sm tracking-wide">Total</span>
            <span className="font-display text-2xl text-gold">
              ${total.toFixed(2)}
            </span>
          </div>

          {ordered ? (
            // ── Success state ──
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-gold flex items-center
                justify-center mx-auto mb-3">
                <Check size={22} className="text-charcoal" />
              </div>
              <div className="text-gold font-body text-sm tracking-widest
                uppercase mb-1">
                Order Placed!
              </div>
              <p className="text-warm-gray font-body text-xs mb-4">
                Check your order history to track status
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={() => navigate('/profile?tab=orders')}
                  className="bg-gold text-charcoal text-xs tracking-widest uppercase
                    px-6 py-2.5 hover:bg-gold/80 transition-all font-body">
                  View Order History
                </button>
                <button
                  onClick={() => navigate('/menu')}
                  className="border border-warm-gray/30 text-cream text-xs
                    tracking-widest uppercase px-6 py-2.5 hover:border-gold
                    transition-all font-body">
                  Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            // ── Place order button ──
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full bg-gold text-charcoal text-xs tracking-widest
                uppercase py-4 font-body font-medium hover:bg-gold/80
                active:scale-[0.98] transition-all flex items-center
                justify-center gap-2 disabled:opacity-60"
            >
              {placing ? (
                <>
                  <div className="w-4 h-4 border-2 border-charcoal/30
                    border-t-charcoal rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  {user ? `Place Order · ${orderType}` : 'Sign in to Order'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}