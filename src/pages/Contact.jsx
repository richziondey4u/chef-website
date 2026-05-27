import { useState } from 'react';
import { useBooking } from '../hooks/useBooking';

const inputCls = "w-full bg-transparent border-b border-warm-gray/30 py-3 font-body text-sm text-charcoal placeholder-warm-gray transition-colors outline-none";

export default function Contact() {
  const mutation = useBooking();
  console.log("fired!!!");
  const [form, setForm] = useState({ name:'', email:'', phone:'', event_type:'', guests:'', date:'', notes:'' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.event_type) return;
    const result = await mutation.mutateAsync(form);
    if (result.success) setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24" style={{ background: '#FAF7F2' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-gold text-xs tracking-widest uppercase">Get in Touch</span>
            <h2 className="font-display text-5xl md:text-6xl font-light mt-2 leading-none">
              Book Your<br/><em className="italic text-gold">Experience</em>
            </h2>
            <div className="w-14 h-px bg-gold my-4"/>
            <p className="text-warm-gray font-body leading-relaxed">
              Every great meal begins with a conversation. Tell us about your occasion and we'll craft a culinary experience worthy of the moment.
            </p>
            <div className="mt-10 space-y-6">
              {[
                ['📍','Location','14 Rue de la Paix, Paris · 36 W 57th St, New York'],
                ['📞','Phone','+1 (212) 555-0192'],
                ['✉️','Email','reservations@maisonfontaine.com'],
                ['🕐','Hours','Mon–Sat, 9am–8pm EST'],
              ].map(([icon, label, value]) => (
                <div key={label} className="flex items-start gap-4">
                  <span className="text-xl mt-0.5">{icon}</span>
                  <div>
                    <div className="text-gold text-xs tracking-widest uppercase" style={{fontSize: 10}}>{label}</div>
                    <div className="font-body text-sm mt-1">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 border border-gold/15">
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✓</div>
                <div className="font-display text-3xl text-gold mb-2">Merci!</div>
                <p className="text-warm-gray font-body">We'll be in touch within 24 hours.</p>
              </div>
            ) : (
              <>
                <h3 className="font-display text-2xl mb-8">Reservation Enquiry</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-gold block mb-2 text-xs tracking-widest uppercase" style={{fontSize:9}}>Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className={inputCls}/>
                    </div>
                    <div>
                      <label className="text-gold block mb-2 text-xs tracking-widest uppercase" style={{fontSize:9}}>Email *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className={inputCls}/>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-gold block mb-2 text-xs tracking-widest uppercase" style={{fontSize:9}}>Phone</label>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className={inputCls}/>
                    </div>
                    <div>
                      <label className="text-gold block mb-2 text-xs tracking-widest uppercase" style={{fontSize:9}}>Event Type *</label>
                      <select name="event_type" value={form.event_type} onChange={handleChange} className={inputCls} style={{appearance:'none'}}>
                        <option value="">Select type</option>
                        <option>Private Dining</option>
                        <option>Wedding</option>
                        <option>Corporate Event</option>
                        <option>Cooking Class</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-gold block mb-2 text-xs tracking-widest uppercase" style={{fontSize:9}}>Preferred Date</label>
                      <input name="date" type="date" value={form.date} onChange={handleChange} className={inputCls}/>
                    </div>
                    <div>
                      <label className="text-gold block mb-2 text-xs tracking-widest uppercase" style={{fontSize:9}}>Guest Count</label>
                      <input name="guests" type="number" value={form.guests} onChange={handleChange} placeholder="10" className={inputCls}/>
                    </div>
                  </div>
                  <div>
                    <label className="text-gold block mb-2 text-xs tracking-widest uppercase" style={{fontSize:9}}>Notes</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows="3"
                      placeholder="Dietary requirements, preferences..." className={inputCls} style={{resize:'none'}}/>
                  </div>
                  <button onClick={handleSubmit} disabled={mutation.isPending}
                    className="w-full bg-charcoal text-cream text-xs tracking-widest uppercase py-4 border border-charcoal hover:bg-gold hover:border-gold hover:text-charcoal transition-all flex items-center justify-center gap-2 mt-4">
                    {mutation.isPending ? 'Sending...' : 'Send Enquiry'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}