import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  User, ShoppingBag, Clock, LogOut,
  Fingerprint, Save, Calendar, Camera, X
} from 'lucide-react';

// ── Time-based greeting ───────────────────────────────────────
function getGreeting(name) {
  const hour = new Date().getHours();
  const firstName = name?.split(' ')[0] || 'there';
  if (hour < 12) return `Good morning, ${firstName} ☀️`;
  if (hour < 17) return `Good afternoon, ${firstName} 🌤`;
  if (hour < 21) return `Good evening, ${firstName} 🌆`;
  return `Good night, ${firstName} 🌙`;
}

// ── Status colors ─────────────────────────────────────────────
const STATUS_COLORS = {
  pending:     'bg-yellow-100 text-yellow-700',
  confirmed:   'bg-blue-100   text-blue-700',
  preparing:   'bg-orange-100 text-orange-700',
  ready:       'bg-green-100  text-green-700',
  delivered:   'bg-gray-100   text-gray-600',
  cancelled:   'bg-red-100    text-red-600',
  in_progress: 'bg-orange-100 text-orange-700',
  completed:   'bg-green-100  text-green-700',
};

const TABS = [
  { key: 'overview',  label: 'Overview',       icon: User },
  { key: 'orders',    label: 'Order History',  icon: ShoppingBag },
  { key: 'bookings',  label: 'Event Bookings', icon: Calendar },
  { key: 'security',  label: 'Security',       icon: Fingerprint },
];

export default function Profile() {
  const { user, profile, signOut, fetchProfile } = useAuth();
  const navigate  = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tab, setTab]               = useState(searchParams.get('tab') || 'overview');
  const [orders, setOrders]         = useState([]);
  const [bookings, setBookings]     = useState([]);
  const [ordersLoading, setOrdersLoading]   = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [saving, setSaving]         = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    full_name: '', phone: '',
  });

  // Sync form with profile
  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone:     profile.phone     || '',
      });
    }
  }, [profile]);

  // Sync tab with URL param
  const handleTabChange = (newTab) => {
    setTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // Fetch orders
  useEffect(() => {
    if (tab !== 'orders' || !user) return;
    setOrdersLoading(true);
    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Orders error:', error);
        setOrders(data || []);
        setOrdersLoading(false);
      });
  }, [tab, user]);

  // Fetch event bookings
  useEffect(() => {
    if (tab !== 'bookings' || !user) return;
    setBookingsLoading(true);
    supabase
      .from('event_bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Bookings error:', error);
        setBookings(data || []);
        setBookingsLoading(false);
      });
  }, [tab, user]);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ── Save profile ──────────────────────────────────────────
  const handleSave = async () => {
    if (!form.full_name.trim()) {
      toast.error('Name cannot be empty'); return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: form.full_name.trim(),
          phone:     form.phone.trim(),
        })
        .eq('id', user.id);

      if (error) throw error;
      await fetchProfile(user.id); // refresh AuthContext
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Avatar upload ─────────────────────────────────────────
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file'); return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be smaller than 2MB'); return;
    }

    setUploadingAvatar(true);
    try {
      // Upload to Supabase Storage
      const ext      = file.name.split('.').pop();
      const filePath = `avatars/${user.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      // Save URL to profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await fetchProfile(user.id);
      toast.success('Profile photo updated!');
    } catch (err) {
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setUploadingAvatar(false);
      e.target.value = ''; // reset file input
    }
  };

  // ── Remove avatar ─────────────────────────────────────────
  const handleRemoveAvatar = async () => {
    try {
      await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);
      await fetchProfile(user.id);
      toast.success('Profile photo removed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handlePasswordChange = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(
      user.email,
      { redirectTo: `${window.location.origin}/reset-password` }
    );
    if (error) toast.error(error.message);
    else toast.success('Password reset link sent to your email!');
  };

  const handleBiometricSetup = () => {
    if (!window.PublicKeyCredential) {
      toast.error('Biometrics not supported on this device');
      return;
    }
    toast('Biometric setup requires a backend WebAuthn endpoint.', {
      icon: '🔐', duration: 4000,
    });
  };

  const inputCls = `w-full bg-transparent border-b border-warm-gray/30 py-3
    font-body text-sm text-charcoal placeholder-warm-gray/50
    focus:border-gold focus:outline-none transition-colors`;

  // Avatar — either photo or initials
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-cream pb-20">

      {/* ── Header banner ── */}
      <div className="bg-charcoal px-6 pt-10 pb-16">
        <div className="max-w-4xl mx-auto flex items-start justify-between">
          <div>
            {/* Time-based greeting */}
            <p className="text-warm-gray font-body text-sm mb-1">
              {getGreeting(profile?.full_name)}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-light text-cream">
              My Account
            </h1>
            <div className="w-14 h-px bg-gold mt-3" />
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-warm-gray hover:text-red-400
              transition-colors font-body text-sm mt-1"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8">

        {/* ── Tabs ── */}
        <div className="bg-white border border-gold/15 mb-6 overflow-x-auto">
          <div className="flex">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`flex items-center gap-2 px-5 py-4 font-body text-sm
                  tracking-wide border-b-2 whitespace-nowrap transition-all
                  ${tab === key
                    ? 'border-gold text-charcoal bg-gold/5'
                    : 'border-transparent text-warm-gray hover:text-charcoal'}`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            OVERVIEW TAB
        ══════════════════════════════════════════════════ */}
        {tab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">

            {/* Avatar card */}
            <div className="md:col-span-1">
              <div className="bg-white border border-gold/15 p-6 text-center">

                {/* Avatar with upload */}
                <div className="relative inline-block mb-4">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      className="w-24 h-24 rounded-full object-cover border-2
                        border-gold/30"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gold flex items-center
                      justify-center text-charcoal font-display text-3xl mx-auto">
                      {initials}
                    </div>
                  )}

                  {/* Upload button overlay */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full
                      bg-charcoal border-2 border-white flex items-center
                      justify-center hover:bg-gold transition-colors"
                    title="Change photo"
                  >
                    {uploadingAvatar ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/30
                        border-t-white rounded-full animate-spin" />
                    ) : (
                      <Camera size={12} className="text-white" />
                    )}
                  </button>

                  {/* Remove photo button */}
                  {profile?.avatar_url && (
                    <button
                      onClick={handleRemoveAvatar}
                      className="absolute top-0 right-0 w-6 h-6 rounded-full
                        bg-red-500 border-2 border-white flex items-center
                        justify-center hover:bg-red-600 transition-colors"
                      title="Remove photo"
                    >
                      <X size={10} className="text-white" />
                    </button>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <p className="text-warm-gray font-body text-xs mb-4">
                  Click camera to upload photo<br />
                  <span className="text-warm-gray/50">Max 2MB · JPG, PNG, WebP</span>
                </p>

                <div className="font-display text-xl text-charcoal">
                  {profile?.full_name || '—'}
                </div>
                <div className="text-warm-gray font-body text-xs mt-1 break-all">
                  {user?.email}
                </div>
                <div className="mt-3">
                  <span className={`text-xs px-3 py-1 font-body tracking-wide
                    capitalize border
                    ${profile?.role === 'admin' || profile?.role === 'superadmin'
                      ? 'bg-gold/10 text-gold border-gold/30'
                      : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                    {profile?.role || 'user'}
                  </span>
                </div>
                <div className="text-warm-gray/50 font-body text-xs mt-4">
                  Member since{' '}
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString('en-GB', {
                        month: 'long', year: 'numeric',
                      })
                    : '—'}
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
                    <label className="text-gold text-xs tracking-widest uppercase
                      block mb-2 font-body" style={{ fontSize: 9 }}>
                      Full Name
                    </label>
                    <input
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={inputCls}
                    />
                    <p className="text-warm-gray/50 font-body text-xs mt-1">
                      This is how we'll greet you across the site
                    </p>
                  </div>
                  <div>
                    <label className="text-gold text-xs tracking-widest uppercase
                      block mb-2 font-body" style={{ fontSize: 9 }}>
                      Email Address
                    </label>
                    <input
                      value={user?.email}
                      disabled
                      className={`${inputCls} opacity-50 cursor-not-allowed`}
                    />
                    <p className="text-warm-gray/50 font-body text-xs mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  <div>
                    <label className="text-gold text-xs tracking-widest uppercase
                      block mb-2 font-body" style={{ fontSize: 9 }}>
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+234 800 000 0000"
                      className={inputCls}
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-charcoal text-cream
                      text-xs tracking-widest uppercase px-8 py-3 hover:bg-gold
                      hover:text-charcoal transition-all font-body
                      disabled:opacity-60"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-cream/30
                        border-t-cream rounded-full animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white border border-gold/15 p-5 text-center
                  cursor-pointer hover:border-gold/40 transition-colors"
                  onClick={() => handleTabChange('orders')}>
                  <div className="font-display text-3xl text-gold font-light">
                    {orders.length}
                  </div>
                  <div className="text-warm-gray font-body text-xs tracking-widest
                    uppercase mt-1">
                    Orders Placed
                  </div>
                </div>
                <div className="bg-white border border-gold/15 p-5 text-center
                  cursor-pointer hover:border-gold/40 transition-colors"
                  onClick={() => handleTabChange('bookings')}>
                  <div className="font-display text-3xl text-gold font-light">
                    {bookings.length}
                  </div>
                  <div className="text-warm-gray font-body text-xs tracking-widest
                    uppercase mt-1">
                    Event Bookings
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            ORDER HISTORY TAB
        ══════════════════════════════════════════════════ */}
        {tab === 'orders' && (
          <div>
            {ordersLoading ? (
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
                  Your food order history will appear here
                </p>
                <button onClick={() => navigate('/menu')}
                  className="bg-charcoal text-cream text-xs tracking-widest
                    uppercase px-8 py-3 hover:bg-gold hover:text-charcoal
                    transition-all font-body">
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
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-warm-gray font-body text-xs">
                            Qty: {order.quantity}
                          </span>
                          <span className="text-warm-gray font-body text-xs">·</span>
                          <span className="text-warm-gray font-body text-xs capitalize">
                            {order.order_type}
                          </span>
                          <span className="text-warm-gray font-body text-xs">·</span>
                          <span className="text-warm-gray font-body text-xs
                            flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(order.created_at).toLocaleDateString('en-GB', {
                              day: '2-digit', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className="font-display text-xl text-gold">
                          ${order.total?.toFixed(2)}
                        </div>
                        <span className={`text-xs font-body px-2 py-0.5
                          rounded-full capitalize mt-1 inline-block
                          ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Add-ons */}
                    {order.addons?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gold/10">
                        <div className="text-warm-gray/50 text-xs font-body mb-2">
                          Add-ons:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {order.addons.map((a, i) => (
                            <span key={i}
                              className="text-xs border border-gold/20 px-2
                                py-0.5 text-warm-gray font-body">
                              {a.label} +${a.price}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {order.special_instructions && (
                      <div className="mt-3 pt-3 border-t border-gold/10">
                        <span className="text-warm-gray/60 text-xs font-body italic">
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

        {/* ══════════════════════════════════════════════════
            EVENT BOOKINGS TAB
        ══════════════════════════════════════════════════ */}
        {tab === 'bookings' && (
          <div>
            {bookingsLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent
                  rounded-full animate-spin" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-20 bg-white border border-gold/15">
                <Calendar size={40} className="text-warm-gray/30 mx-auto mb-4" />
                <p className="font-display text-2xl font-light text-charcoal mb-2">
                  No event bookings yet
                </p>
                <p className="text-warm-gray font-body text-sm mb-6">
                  Your event and service bookings will appear here
                </p>
                <button onClick={() => navigate('/events')}
                  className="bg-charcoal text-cream text-xs tracking-widest
                    uppercase px-8 py-3 hover:bg-gold hover:text-charcoal
                    transition-all font-body">
                  Explore Services
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map(booking => (
                  <div key={booking.id}
                    className="bg-white border border-gold/15 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-display text-xl font-semibold">
                          {booking.service_title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          {booking.form_data?.date && (
                            <span className="text-warm-gray font-body text-xs
                              flex items-center gap-1">
                              <Clock size={10} />
                              {new Date(booking.form_data.date)
                                .toLocaleDateString('en-GB', {
                                  day: '2-digit', month: 'short', year: 'numeric',
                                })}
                            </span>
                          )}
                          {(booking.form_data?.guests ||
                            booking.form_data?.participants) && (
                            <span className="text-warm-gray font-body text-xs">
                              {booking.form_data.guests ||
                               booking.form_data.participants} guests
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs font-body px-3 py-1
                        rounded-sm capitalize shrink-0 ml-4
                        ${STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                        {booking.status?.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Key booking details */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4
                      pt-3 border-t border-gold/10">
                      {[
                        { key: 'venue',        label: 'Venue' },
                        { key: 'location',     label: 'Location' },
                        { key: 'cuisine',      label: 'Cuisine' },
                        { key: 'class_type',   label: 'Class' },
                        { key: 'event_type',   label: 'Event Type' },
                        { key: 'budget',       label: 'Budget' },
                        { key: 'service_style',label: 'Service' },
                      ].filter(f => booking.form_data?.[f.key])
                       .map(({ key, label }) => (
                        <div key={key}>
                          <div className="text-gold font-body"
                            style={{ fontSize: 9, letterSpacing: '0.15em' }}>
                            {label.toUpperCase()}
                          </div>
                          <div className="text-charcoal font-body text-xs mt-0.5">
                            {booking.form_data[key]}
                          </div>
                        </div>
                      ))}
                    </div>

                    {booking.notes && (
                      <div className="mt-3 pt-3 border-t border-gold/10">
                        <span className="text-warm-gray/60 text-xs font-body italic">
                          Note: {booking.notes}
                        </span>
                      </div>
                    )}

                    <div className="mt-3 pt-2 text-right">
                      <span className="text-warm-gray/40 font-body text-xs">
                        Submitted{' '}
                        {new Date(booking.created_at).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            SECURITY TAB
        ══════════════════════════════════════════════════ */}
        {tab === 'security' && (
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-white border border-gold/15 p-8">
              <h2 className="font-display text-2xl font-light mb-2">Password</h2>
              <div className="w-8 h-px bg-gold mb-4" />
              <p className="text-warm-gray font-body text-sm mb-6 leading-relaxed">
                We'll send a reset link to <strong>{user?.email}</strong>.
              </p>
              <button onClick={handlePasswordChange}
                className="bg-charcoal text-cream text-xs tracking-widest
                  uppercase px-8 py-3 hover:bg-gold hover:text-charcoal
                  transition-all font-body">
                Send Reset Link
              </button>
            </div>

            <div className="bg-white border border-gold/15 p-8">
              <h2 className="font-display text-2xl font-light mb-2">Biometrics</h2>
              <div className="w-8 h-px bg-gold mb-4" />
              <p className="text-warm-gray font-body text-sm mb-6 leading-relaxed">
                Add fingerprint or Face ID to sign in faster without a password.
              </p>
              <button onClick={handleBiometricSetup}
                className="flex items-center gap-2 border border-charcoal
                  text-charcoal text-xs tracking-widest uppercase px-8 py-3
                  hover:bg-charcoal hover:text-cream transition-all font-body">
                <Fingerprint size={14} />
                Set Up Biometrics
              </button>
            </div>

            <div className="bg-white border border-gold/15 p-8 md:col-span-2">
              <h2 className="font-display text-2xl font-light mb-2">
                Session Policy
              </h2>
              <div className="w-8 h-px bg-gold mb-4" />
              <p className="text-warm-gray font-body text-sm leading-relaxed">
                Your session automatically expires after{' '}
                <strong>3 minutes of inactivity</strong> for security.
                All your data and order history is safely stored in your account.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}