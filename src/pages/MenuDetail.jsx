import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDishById } from "../api/chefApi";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { ArrowLeft } from "lucide-react";

export default function MenuDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile, fetchProfile } = useAuth();

  const [orderType, setOrderType] = useState("dine");
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [table, setTable] = useState("");
  const [address, setAddress] = useState("");
  const [placed, setPlaced] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [authPrompt, setAuthPrompt] = useState(false);

  const { data: dish, isLoading } = useQuery({
    queryKey: ["dish", id],
    queryFn: () => getDishById(id),
  });

  // Pre-fill details from profile
  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
    }
  }, [profile]);

  const toggleAddon = (label) => {
    setSelectedAddons((prev) =>
      prev.includes(label) ? prev.filter((a) => a !== label) : [...prev, label]
    );
  };

  const addonTotal =
    dish?.addons
      ?.filter((a) => selectedAddons.includes(a.label))
      .reduce((sum, a) => sum + a.price, 0) || 0;

  const itemTotal = dish ? dish.price * quantity : 0;
  const service = (itemTotal + addonTotal) * 0.1;
  const total = itemTotal + addonTotal + service;

  const handleSubmit = async () => {
    if (!user) {
      setAuthPrompt(true);
      return;
    }
    if (!name.trim()) return;

    setSubmitting(true);
    const code = "#ORD-" + Math.floor(1000 + Math.random() * 9000);

    const selectedAddonObjects = dish.addons?.filter((a) =>
      selectedAddons.includes(a.label)
    );

    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      dish_id: dish.id,
      dish_name: dish.name,
      dish_price: dish.price,
      quantity,
      addons: selectedAddonObjects || [],
      order_type: orderType,
      table_number: orderType === "dine" ? table : null,
      delivery_address: orderType === "delivery" ? address : null,
      special_instructions: note,
      total,
      status: "pending",
      order_code: code,
    });

    if (!error) {
      await supabase
        .from("profiles")
        .update({ loyalty_points: (profile?.loyalty_points || 0) + 10 })
        .eq("id", user.id);

      await fetchProfile(user.id);
      setOrderCode(code);
      setPlaced(true);
    }

    setSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-warm-gray font-body text-sm">Loading dish...</p>
        </div>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center text-center px-6">
        <div>
          <p className="font-display text-3xl text-charcoal mb-4">Dish not found</p>
          <button onClick={() => navigate("/menu")} className="text-gold text-sm tracking-widest uppercase font-body hover:underline">
            ← Back to menu
          </button>
        </div>
      </div>
    );
  }

  if (placed) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center p-10">
          <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4 text-gold text-xl">✓</div>
          <h2 className="font-display text-4xl font-light mb-2">Order placed, <em>thank you!</em></h2>
          <p className="text-warm-gray font-body text-sm mb-4">Your order has been sent to the kitchen</p>
          <p className="font-display text-3xl text-gold tracking-widest mb-6">{orderCode}</p>
          <p className="text-sm text-warm-gray font-body">Estimated time: <strong>20–25 minutes</strong></p>
          <p className="text-xs text-gold font-body mt-2">+10 loyalty points earned!</p>
          <div className="flex gap-3 justify-center mt-8">
            <button onClick={() => navigate("/menu")} className="px-6 py-3 border border-gold/30 text-sm tracking-wide font-body hover:bg-gold hover:text-charcoal transition-all">← Back to menu</button>
            <button onClick={() => navigate("/profile")} className="px-6 py-3 bg-charcoal text-cream text-sm tracking-wide font-body hover:bg-gold hover:text-charcoal transition-all">View orders</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-2">
        <button onClick={() => navigate("/menu")} className="flex items-center gap-2 text-warm-gray hover:text-gold transition-colors font-body text-sm">
          <ArrowLeft size={14} />
          Back to menu
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="relative h-64 sm:h-80 overflow-hidden mt-4 bg-gray-100">
          <img src={dish.image} alt={dish.name} className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1567364816519-cbc9c4ffe1eb?w=600&h=400&fit=crop&q=80"; }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(28,28,28,0.75) 0%, transparent 50%)" }} />
          <div className="absolute top-4 left-4">
            <span className="text-gold font-body text-xs tracking-widest uppercase">Chef's Selection</span>
          </div>
          <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
            {dish.tags.map((tag) => (
              <span key={tag} className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs px-2.5 py-0.5 font-body tracking-wide">{tag}</span>
            ))}
            {dish.area && <span className="bg-gold/90 text-charcoal text-xs px-2.5 py-0.5 font-body tracking-wide">{dish.area}</span>}
          </div>
        </div>

        <div className="mt-6 mb-2">
          <h1 className={`font-display font-light leading-tight text-charcoal ${dish.name.length > 20 ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"}`}>{dish.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-display text-2xl text-gold">${dish.price}</span>
            <span className="text-warm-gray text-xs font-body">· By {dish.chef}</span>
            {user && profile && (
              <span className="ml-auto text-xs font-body text-gold border border-gold/30 px-2 py-0.5">★ {profile.loyalty_points || 0} pts</span>
            )}
          </div>
        </div>

        {authPrompt && (
          <div className="bg-gold/10 border border-gold/30 p-4 mt-4 flex items-center justify-between">
            <p className="text-sm font-body text-charcoal">Sign in to place your order and earn loyalty points</p>
            <div className="flex gap-2">
              <button onClick={() => navigate("/auth")} className="text-xs tracking-widest uppercase font-body bg-charcoal text-cream px-4 py-2 hover:bg-gold hover:text-charcoal transition-all">Sign In</button>
              <button onClick={() => setAuthPrompt(false)} className="text-xs text-warm-gray font-body hover:text-charcoal">✕</button>
            </div>
          </div>
        )}

        {dish.ingredients?.length > 0 && (
          <div className="mb-8 mt-4">
            <div className="text-xs tracking-widest uppercase text-gold font-body mb-3">Key Ingredients</div>
            <div className="flex flex-wrap gap-2">
              {dish.ingredients.map((ing) => (
                <span key={ing} className="text-xs px-3 py-1 border border-gold/25 text-warm-gray font-body tracking-wide bg-white">{ing}</span>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-4">
            <div className="bg-white border border-gold/15 p-6">
              <p className="text-xs tracking-widest uppercase text-warm-gray font-body mb-4">Order Type</p>
              <div className="grid grid-cols-3 gap-3">
                {[{ id: "dine", label: "Dine in" }, { id: "takeaway", label: "Takeaway" }, { id: "delivery", label: "Delivery" }].map((t) => (
                  <button key={t.id} onClick={() => setOrderType(t.id)}
                    className={`py-3 border text-sm font-body tracking-wide transition-all ${orderType === t.id ? "border-gold bg-gold/5 text-charcoal" : "border-gold/20 text-warm-gray hover:border-gold/40"}`}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <p className="text-xs tracking-widest uppercase text-warm-gray font-body mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex border border-gold/20">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-gold/5 transition-colors text-charcoal font-body">−</button>
                    <span className="px-4 py-2 min-w-[40px] text-center font-body font-medium text-sm">{quantity}</span>
                    <button onClick={() => setQuantity((q) => q + 1)} className="px-4 py-2 hover:bg-gold/5 transition-colors text-charcoal font-body">+</button>
                  </div>
                  <span className="text-sm text-warm-gray font-body">× ${dish.price.toFixed(2)} each</span>
                </div>
              </div>
            </div>

            {dish.addons?.length > 0 && (
              <div className="bg-white border border-gold/15 p-6">
                <p className="text-xs tracking-widest uppercase text-warm-gray font-body mb-4">Extras & Add-ons</p>
                <div className="space-y-2">
                  {dish.addons.map((addon) => (
                    <div key={addon.label} onClick={() => toggleAddon(addon.label)}
                      className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${selectedAddons.includes(addon.label) ? "border-gold bg-gold/5" : "border-gold/15 hover:border-gold/30"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 border flex items-center justify-center text-xs ${selectedAddons.includes(addon.label) ? "bg-gold border-gold text-charcoal" : "border-gold/30"}`}>
                          {selectedAddons.includes(addon.label) && "✓"}
                        </div>
                        <span className="font-body text-sm text-charcoal">{addon.label}</span>
                      </div>
                      <span className="font-body text-sm text-gold">+${addon.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white border border-gold/15 p-6">
              <p className="text-xs tracking-widest uppercase text-warm-gray font-body mb-4">Special Instructions</p>
              <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="Allergies, spice level preference, or anything for the chef..."
                className="w-full bg-stone-50 border border-gold/15 p-3 font-body text-sm text-charcoal placeholder-warm-gray/50 resize-none focus:border-gold focus:outline-none transition-colors" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-gold/15 p-6">
              <p className="text-xs tracking-widest uppercase text-warm-gray font-body mb-4">Your Details</p>
              {!user && (
                <p className="text-xs font-body text-warm-gray bg-stone-50 border border-gold/15 p-3 mb-3">
                  <button onClick={() => navigate("/auth")} className="text-gold hover:underline">Sign in</button> to pre-fill your details and earn loyalty points
                </p>
              )}
              <div className="space-y-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full border border-gold/15 p-3 font-body text-sm focus:outline-none focus:border-gold bg-stone-50" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" type="tel" className="w-full border border-gold/15 p-3 font-body text-sm focus:outline-none focus:border-gold bg-stone-50" />
                {orderType === "dine" && (
                  <input value={table} onChange={(e) => setTable(e.target.value)} placeholder="Table number" className="w-full border border-gold/15 p-3 font-body text-sm focus:outline-none focus:border-gold bg-stone-50" />
                )}
                {orderType === "delivery" && (
                  <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery address" className="w-full border border-gold/15 p-3 font-body text-sm focus:outline-none focus:border-gold bg-stone-50" />
                )}
              </div>
            </div>

            <div className="bg-white border border-gold/15 p-6">
              <p className="text-xs tracking-widest uppercase text-warm-gray font-body mb-4">Order Summary</p>
              <div className="space-y-2 text-sm font-body">
                <div className="flex justify-between text-charcoal">
                  <span>{dish.name} × {quantity}</span>
                  <span>${itemTotal.toFixed(2)}</span>
                </div>
                {addonTotal > 0 && (
                  <div className="flex justify-between text-warm-gray">
                    <span>Add-ons</span><span>${addonTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-warm-gray">
                  <span>Service charge (10%)</span><span>${service.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base border-t border-gold/15 pt-3 mt-3 text-charcoal">
                  <span>Total</span>
                  <span className="text-gold font-display text-xl">${total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={handleSubmit} disabled={submitting}
                className="w-full mt-5 py-3 bg-charcoal text-cream text-xs tracking-widest uppercase font-body hover:bg-gold hover:text-charcoal transition-all disabled:opacity-50">
                {submitting ? "Placing order..." : `Place Order · ${orderType === "dine" ? "Dine In" : orderType === "takeaway" ? "Takeaway" : "Delivery"}`}
              </button>
              {!name.trim() && (
                <p className="text-xs text-warm-gray/60 font-body text-center mt-2">Please enter your name to continue</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
