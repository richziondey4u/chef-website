import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const EXTRAS = [
  { id: 1, name: 'Extra parmesan', price: 3 },
  { id: 2, name: 'Garlic bread', price: 4 },
  { id: 3, name: 'House salad', price: 5 },
  { id: 4, name: 'Glass of house wine', price: 6 },
];

export default function Order() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const item = state?.selectedItem;

  const [qty, setQty] = useState(1);
  const [orderType, setOrderType] = useState('dine');
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [notes, setNotes] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [table, setTable] = useState('');
  const [address, setAddress] = useState('');
  const [placed, setPlaced] = useState(false);
  const [orderCode] = useState('#ORD-' + Math.floor(1000 + Math.random() * 9000));

  if (!item) return <p className="p-10 text-center">No item selected. <button onClick={() => navigate('/#menu')} className="underline">Go to menu</button></p>;

  const basePrice = item.price ?? 24;
  const extrasTotal = selectedExtras.reduce((acc, id) => acc + (EXTRAS.find(e => e.id === id)?.price ?? 0), 0);
  const itemTotal = basePrice * qty;
  const service = (itemTotal + extrasTotal) * 0.1;
  const total = itemTotal + extrasTotal + service;

  const toggleExtra = (id) =>
    setSelectedExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    setPlaced(true);
  };

  if (placed) return (
    <section className="min-h-screen flex items-center justify-center" style={{ background: '#FAF7F2' }}>
      <div className="text-center p-10">
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4">
          ✓
        </div>
        <h2 className="font-display text-4xl font-light mb-2">Order placed, <em>thank you!</em></h2>
        <p className="text-warm-gray text-sm mb-4">Your order has been sent to the kitchen</p>
        <p className="font-display text-3xl text-gold tracking-widest mb-6">{orderCode}</p>
        <p className="text-sm text-warm-gray">Estimated time: <strong>20–25 minutes</strong></p>
        <button onClick={() => navigate('/#menu')} className="mt-8 px-8 py-3 border border-gold/30 text-sm tracking-wide hover:bg-gold hover:text-charcoal transition-all">
          ← Back to menu
        </button>
      </div>
    </section>
  );

  return (
    <section className="min-h-screen py-16 px-6" style={{ background: '#FAF7F2' }}>
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-sm text-warm-gray mb-8 flex items-center gap-2 hover:text-charcoal transition-colors">
          ← Back to menu
        </button>

        {/* Hero */}
        <div className="relative bg-charcoal rounded overflow-hidden p-8 mb-8">
          <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="relative z-10">
            <span className="text-gold text-xs tracking-widest uppercase">Chef's Selection</span>
            <h1 className="font-display text-4xl font-light text-cream mt-1">{item.name}</h1>
            <div className="flex gap-2 mt-2">
              {item.category && <span className="text-xs px-2 py-0.5 border border-gold/30 text-gold">{item.category}</span>}
              {item.area && <span className="text-xs px-2 py-0.5 border border-gold/30 text-gold">{item.area}</span>}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-6">
            {/* Order type */}
            <div className="bg-white border border-gold/15 p-6">
              <p className="text-xs tracking-widest uppercase text-warm-gray mb-4">Order type</p>
              <div className="grid grid-cols-3 gap-3">
                {[{id:'dine',label:'Dine in'},{id:'takeaway',label:'Takeaway'},{id:'delivery',label:'Delivery'}].map(t => (
                  <button key={t.id} onClick={() => setOrderType(t.id)}
                    className={`py-3 border text-sm tracking-wide transition-all ${orderType === t.id ? 'border-gold bg-gold/5 text-charcoal' : 'border-gold/20 text-warm-gray'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <p className="text-xs tracking-widest uppercase text-warm-gray mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex border border-gold/20">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-gold/5 transition-colors">−</button>
                    <span className="px-4 py-2 min-w-[40px] text-center font-medium">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} className="px-4 py-2 hover:bg-gold/5 transition-colors">+</button>
                  </div>
                  <span className="text-sm text-warm-gray">× ${basePrice.toFixed(2)} each</span>
                </div>
              </div>
            </div>

            {/* Extras */}
            <div className="bg-white border border-gold/15 p-6">
              <p className="text-xs tracking-widest uppercase text-warm-gray mb-4">Extras & add-ons</p>
              <div className="space-y-2">
                {EXTRAS.map(extra => (
                  <div key={extra.id} onClick={() => toggleExtra(extra.id)}
                    className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${selectedExtras.includes(extra.id) ? 'border-gold bg-gold/5' : 'border-gold/15 hover:border-gold/30'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 border flex items-center justify-center text-xs ${selectedExtras.includes(extra.id) ? 'bg-gold border-gold text-charcoal' : 'border-gold/30'}`}>
                        {selectedExtras.includes(extra.id) && '✓'}
                      </div>
                      <span className="text-sm">{extra.name}</span>
                    </div>
                    <span className="text-sm text-gold">+${extra.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white border border-gold/15 p-6">
              <p className="text-xs tracking-widest uppercase text-warm-gray mb-4">Special instructions</p>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Allergies, dietary needs, or anything for the chef…"
                className="w-full border border-gold/15 p-3 text-sm focus:outline-none focus:border-gold resize-none bg-stone-50"
                rows={3}/>
            </div>
          </div>

          <div className="space-y-6">
            {/* Customer details */}
            <div className="bg-white border border-gold/15 p-6">
              <p className="text-xs tracking-widest uppercase text-warm-gray mb-4">Your details</p>
              <div className="space-y-3">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
                  className="w-full border border-gold/15 p-3 text-sm focus:outline-none focus:border-gold bg-stone-50" />
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" type="tel"
                  className="w-full border border-gold/15 p-3 text-sm focus:outline-none focus:border-gold bg-stone-50" />
                {orderType === 'dine' && (
                  <input value={table} onChange={e => setTable(e.target.value)} placeholder="Table number"
                    className="w-full border border-gold/15 p-3 text-sm focus:outline-none focus:border-gold bg-stone-50" />
                )}
                {orderType === 'delivery' && (
                  <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Delivery address"
                    className="w-full border border-gold/15 p-3 text-sm focus:outline-none focus:border-gold bg-stone-50" />
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white border border-gold/15 p-6">
              <p className="text-xs tracking-widest uppercase text-warm-gray mb-4">Order summary</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>{item.name} × {qty}</span><span>${itemTotal.toFixed(2)}</span></div>
                {extrasTotal > 0 && <div className="flex justify-between text-warm-gray"><span>Extras</span><span>${extrasTotal.toFixed(2)}</span></div>}
                <div className="flex justify-between text-warm-gray"><span>Service charge (10%)</span><span>${service.toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold text-base border-t border-gold/15 pt-3 mt-3">
                  <span>Total</span><span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={handleSubmit}
                className="w-full mt-5 py-3 bg-charcoal text-cream text-sm tracking-wide hover:bg-gold hover:text-charcoal transition-all">
                Place order
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}