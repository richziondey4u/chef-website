import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, ShoppingBag, Clock, LogOut, Fingerprint, Save } from 'lucide-react';

const TABS = [
  { key: 'overview', label: 'Overview',     icon: User },
  { key: 'orders',   label: 'Order History', icon: ShoppingBag },
  { key: 'security', label: 'Security',      icon: Fingerprint },
];

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100 text-blue-700',
  preparing:  'bg-orange-100 text-orange-700',
  ready:      'bg-green-100 text-green-700',
  delivered:  'bg-gray-100 text-gray-600',
  cancelled:  'bg-red-100 text-red-600',
};

export default function Profile() {
  const { user, profile, signOut, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab]         = useState('overview');
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({
    full_name: '', phone: '', avatar_url: '',
  });

  // Populate form from profile
  useEffect(() => {
    if (profile) {
      setForm({
        full_name:  profile.full_name  || '',
        phone:      profile.phone      || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile]);

  // Fetch orders
  useEffect(() => {
    if (tab !== 'orders' || !user) return;
    setLoading(true);
    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data || []);
        setLoading(false);
      });
  }, [tab, user]);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name:  form.full_name,
        phone:      form.phone,
        avatar_url: form.avatar_url,
      })
      .eq('id', user.id);

    if (error) {
      toast.error('Failed to save changes');
    } else {
      toast.success('Profile updated!');
      await fetchProfile(user.id);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // ── Biometric registration ──────────────────────────────
  const handleBiometricSetup = async () => {
    try {
      const supported = window.PublicKeyCredential;
      if (!supported) {
        toast.error('Biometrics not supported on this device');
        return;
      }
      // In production: call your backend to get a WebAuthn
      // registration challenge, then use startRegistration()
      // from @simplewebauthn/browser
      toast('Biometric setup requires a backend WebAuthn endpoint.\nAdd it when your backend is ready.', {
        icon: '🔐', duration: 5000,
      });
    } catch {
      toast.error('Biometric setup failed');
    }
  };

  const handlePasswordChange = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    if (error) toast.error(error.message);
    else toast.success('Password reset link sent to your email!');
  };

  const inputCls = `w-full bg-transparent border-b border-warm-gray/30 py-3
    font-body text-sm text-charcoal placeholder-warm-gray/50
    focus:border-gold focus:outline-none transition-colors`;

  return (
    <div className="min-h-screen bg-cream pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <span className="text-gold text-xs tracking-widest uppercase font-body">
              My Account
            </span>
            <h1 className="font-display text-4xl font-light mt-1">
              {profile?.full_name || 'Profile'}
            </h1>
            <div className="w-14 h-px bg-gold mt-3" />
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-warm-gray hover:text-red-500
              transition-colors font-body text-sm mt-2"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gold/20 mb-8">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-6 py-3 font-body text-sm
                tracking-wide border-b-2 transition-all
                ${tab === key
                  ? 'border-gold text-charcoal'
                  : 'border-transparent text-warm-gray hover:text-charcoal'}`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Overview ─────────────────────────────────── */}
        {tab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-8">

            {/* Avatar */}
            <div className="md:col-span-1">
              <div className="bg-white border border-gold/15 p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-gold flex items-center justify-center
                  text-charcoal font-display text-3xl mx-auto mb-4">
                  {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                </div>
                <div className="font-display text-xl text-charcoal">
                  {profile?.full_name || '—'}
                </div>
                <div className="text-warm-gray font-body text-xs mt-1">
                  {user?.email}
                </div>
                <div className="mt-3">
                  <span className="text-xs px-3 py-1 bg-gold/10 text-gold border
                    border-gold/30 font-body tracking-wide capitalize">
                    {profile?.role || 'user'}
                  </span>
                </div>
                <div className="text-warm-gray/50 font-body text-xs mt-4">
                  Member since {new Date(profile?.created_at).toLocaleDateString('en-GB', {
                    month: 'long', year: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {/* Edit form */}
            <div className="md:col-span-2">
              <div className="bg-white border border-gold/15 p-8">
                <h2 className="font-display text-2xl font-light mb-6">
                  Personal Details
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-gold text-xs tracking-widest uppercase block mb-2"
                      style={{ fontSize: 9 }}>
                      Full Name
                    </label>
                    <input name="full_name" value={form.full_name}
                      onChange={handleChange} placeholder="Your full name"
                      className={inputCls} />
                  </div>
                  <div>
                    <label className="text-gold text-xs tracking-widest uppercase block mb-2"
                      style={{ fontSize: 9 }}>
                      Email Address
                    </label>
                    <input value={user?.email} disabled
                      className={`${inputCls} opacity-50 cursor-not-allowed`} />
                    <p className="text-warm-gray/50 text-xs font-body mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  <div>
                    <label className="text-gold text-xs tracking-widest uppercase block mb-2"
                      style={{ fontSize: 9 }}>
                      Phone Number
                    </label>
                    <input name="phone" value={form.phone}
                      onChange={handleChange} placeholder="+234 800 000 0000"
                      className={inputCls} />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-charcoal text-cream text-xs
                      tracking-widest uppercase px-8 py-3 hover:bg-gold
                      hover:text-charcoal transition-all font-body disabled:opacity-60"
                  >
                    {saving
                      ? <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                      : <Save size={14} />
                    }
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Order History ─────────────────────────────── */}
        {tab === 'orders' && (
          <div>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent
                  rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-white border border-gold/15">
                <ShoppingBag size={40} className="text-warm-gray/30 mx-auto mb-4" />
                <p className="font-display text-2xl font-light text-charcoal mb-2">
                  No orders yet
                </p>
                <p className="text-warm-gray font-body text-sm mb-6">
                  Your order history will appear here
                </p>
                <button onClick={() => navigate('/menu')}
                  className="bg-charcoal text-cream text-xs tracking-widest uppercase
                    px-8 py-3 hover:bg-gold hover:text-charcoal transition-all font-body">
                  Explore Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id}
                    className="bg-white border border-gold/15 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-display text-xl font-semibold">
                          {order.dish_name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-warm-gray font-body text-xs">
                            Qty: {order.quantity}
                          </span>
                          <span className="text-warm-gray font-body text-xs">·</span>
                          <span className="text-warm-gray font-body text-xs capitalize">
                            {order.order_type}
                          </span>
                          <span className="text-warm-gray font-body text-xs">·</span>
                          <span className="text-warm-gray font-body text-xs flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(order.created_at).toLocaleDateString('en-GB', {
                              day: '2-digit', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-xl text-gold">
                          ${order.total?.toFixed(2)}
                        </div>
                        <span className={`text-xs font-body px-2 py-0.5 rounded-full
                          capitalize mt-1 inline-block ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Add-ons */}
                    {order.addons?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gold/10">
                        <div className="text-warm-gray/50 text-xs font-body mb-1">
                          Add-ons:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {order.addons.map((a, i) => (
                            <span key={i}
                              className="text-xs border border-gold/20 px-2 py-0.5
                                text-warm-gray font-body">
                              {a.label} +${a.price}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {order.special_instructions && (
                      <div className="mt-3 pt-3 border-t border-gold/10">
                        <span className="text-warm-gray/50 text-xs font-body">
                          Note: {order.special_instructions}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Security ──────────────────────────────────── */}
        {tab === 'security' && (
          <div className="grid md:grid-cols-2 gap-6">

            {/* Password */}
            <div className="bg-white border border-gold/15 p-8">
              <h2 className="font-display text-2xl font-light mb-2">Password</h2>
              <div className="w-8 h-px bg-gold mb-4" />
              <p className="text-warm-gray font-body text-sm mb-6 leading-relaxed">
                We'll send a reset link to <strong>{user?.email}</strong>. Follow
                the link to set a new password.
              </p>
              <button onClick={handlePasswordChange}
                className="bg-charcoal text-cream text-xs tracking-widest uppercase
                  px-8 py-3 hover:bg-gold hover:text-charcoal transition-all font-body">
                Send Reset Link
              </button>
            </div>

            {/* Biometrics */}
            <div className="bg-white border border-gold/15 p-8">
              <h2 className="font-display text-2xl font-light mb-2">Biometrics</h2>
              <div className="w-8 h-px bg-gold mb-4" />
              <p className="text-warm-gray font-body text-sm mb-6 leading-relaxed">
                Add fingerprint or Face ID to sign in faster without a password.
                Requires a device with biometric hardware.
              </p>
              <button onClick={handleBiometricSetup}
                className="flex items-center gap-2 border border-charcoal text-charcoal
                  text-xs tracking-widest uppercase px-8 py-3 hover:bg-charcoal
                  hover:text-cream transition-all font-body">
                <Fingerprint size={14} />
                Set Up Biometrics
              </button>
            </div>

            {/* Active session info */}
            <div className="bg-white border border-gold/15 p-8 md:col-span-2">
              <h2 className="font-display text-2xl font-light mb-2">
                Session Policy
              </h2>
              <div className="w-8 h-px bg-gold mb-4" />
              <p className="text-warm-gray font-body text-sm leading-relaxed">
                For your security, your session automatically expires after
                <strong> 3 minutes of inactivity</strong>. You will be prompted
                to sign in again. All your data and order history is safely stored.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}