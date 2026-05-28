import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const { user, profile, signOut, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
    }
  }, [profile]);

  // Re-fetch orders every time this page is visited (even coming back from menu)
  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setOrdersLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setOrdersLoading(false);
  }, [user]);

  // Runs every time location changes (i.e. every time user lands on /profile)
  useEffect(() => {
    if (user) fetchOrders();
  }, [location.key, user]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({ full_name: fullName, phone, address });
    if (!error) {
      setSaveMsg('Profile updated!');
      setEditing(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const firstName = profile?.full_name
    ? profile.full_name.trim().split(' ')[0]
    : user?.email?.split('@')[0] || 'there';

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-700',
    preparing: 'bg-blue-100 text-blue-700',
    ready: 'bg-green-100 text-green-700',
    delivered: 'bg-gray-100 text-gray-600',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <span className="text-gold text-xs tracking-widest uppercase font-body">Account</span>
            <h1 className="font-display text-4xl font-light text-charcoal mt-1">
              Hello, <em>{firstName}</em>
            </h1>
            <p className="text-warm-gray text-sm font-body mt-1">{user?.email}</p>
            {profile?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="mt-2 text-xs tracking-widest uppercase font-body text-gold border border-gold/30 px-3 py-1 hover:bg-gold hover:text-charcoal transition-all"
              >
                Admin Dashboard →
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/menu')}
              className="text-xs tracking-widest uppercase font-body text-warm-gray border border-gold/20 px-4 py-2 hover:border-gold hover:text-charcoal transition-all"
            >
              Browse Menu
            </button>
            <button
              onClick={handleSignOut}
              className="text-xs tracking-widest uppercase font-body text-warm-gray hover:text-red-600 transition-colors border border-gold/20 px-4 py-2"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_300px] gap-6">

          {/* LEFT — Order History */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs tracking-widest uppercase text-gold font-body">Order History</h2>
              <button
                onClick={fetchOrders}
                className="text-xs text-warm-gray font-body hover:text-gold transition-colors"
              >
                ↻ Refresh
              </button>
            </div>

            {ordersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white border border-gold/10 p-5 animate-pulse h-24" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-gold/15 p-8 text-center">
                <p className="text-warm-gray font-body text-sm">No orders yet.</p>
                <button
                  onClick={() => navigate('/menu')}
                  className="mt-4 text-gold text-xs tracking-widest uppercase font-body hover:underline"
                >
                  Browse menu →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="bg-white border border-gold/15 p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-display text-lg text-charcoal">{order.dish_name}</p>
                        <p className="text-warm-gray text-xs font-body mt-0.5">
                          {order.order_code} · {order.order_type} · qty {order.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-gold text-lg">${order.total?.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-0.5 font-body mt-1 inline-block ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    {order.addons?.length > 0 && (
                      <p className="text-xs text-warm-gray font-body">
                        Add-ons: {order.addons.map(a => a.label).join(', ')}
                      </p>
                    )}
                    {order.special_instructions && (
                      <p className="text-xs text-warm-gray/70 font-body mt-1 italic">
                        "{order.special_instructions}"
                      </p>
                    )}
                    {order.delivery_address && (
                      <p className="text-xs text-warm-gray font-body mt-1">📍 {order.delivery_address}</p>
                    )}
                    {order.table_number && (
                      <p className="text-xs text-warm-gray font-body mt-1">🪑 Table {order.table_number}</p>
                    )}
                    <p className="text-xs text-warm-gray/50 font-body mt-2">
                      {new Date(order.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Profile + Loyalty */}
          <div className="space-y-4">

            {/* Loyalty points */}
            <div className="bg-charcoal p-6 text-center">
              <p className="text-gold text-xs tracking-widest uppercase font-body mb-2">Loyalty Points</p>
              <p className="font-display text-5xl text-cream">{profile?.loyalty_points ?? 0}</p>
              <p className="text-warm-gray text-xs font-body mt-2">Earn 10 points per order</p>
              <div className="w-full bg-white/10 h-1 mt-4">
                <div
                  className="bg-gold h-1 transition-all duration-500"
                  style={{ width: `${Math.min(((profile?.loyalty_points ?? 0) % 100), 100)}%` }}
                />
              </div>
              <p className="text-warm-gray/60 text-xs font-body mt-2">
                {100 - ((profile?.loyalty_points ?? 0) % 100)} points to next reward
              </p>
            </div>

            {/* Profile details */}
            <div className="bg-white border border-gold/15 p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs tracking-widest uppercase text-warm-gray font-body">Your Details</p>
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-xs text-gold font-body hover:underline tracking-wide"
                >
                  {editing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-warm-gray/70 font-body mb-1">Full Name</p>
                  {editing ? (
                    <input value={fullName} onChange={e => setFullName(e.target.value)}
                      className="w-full border border-gold/20 p-2.5 font-body text-sm focus:outline-none focus:border-gold bg-stone-50" />
                  ) : (
                    <p className="font-body text-sm text-charcoal">{profile?.full_name || '—'}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-warm-gray/70 font-body mb-1">Email</p>
                  <p className="font-body text-sm text-charcoal">{user?.email}</p>
                </div>

                <div>
                  <p className="text-xs text-warm-gray/70 font-body mb-1">Phone</p>
                  {editing ? (
                    <input value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="Your phone number"
                      className="w-full border border-gold/20 p-2.5 font-body text-sm focus:outline-none focus:border-gold bg-stone-50" />
                  ) : (
                    <p className="font-body text-sm text-charcoal">{profile?.phone || '—'}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-warm-gray/70 font-body mb-1">Delivery Address</p>
                  {editing ? (
                    <input value={address} onChange={e => setAddress(e.target.value)}
                      placeholder="Your delivery address"
                      className="w-full border border-gold/20 p-2.5 font-body text-sm focus:outline-none focus:border-gold bg-stone-50" />
                  ) : (
                    <p className="font-body text-sm text-charcoal">{profile?.address || '—'}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-warm-gray/70 font-body mb-1">Member Since</p>
                  <p className="font-body text-sm text-charcoal">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })
                      : '—'}
                  </p>
                </div>

                {editing && (
                  <button onClick={handleSave} disabled={saving}
                    className="w-full py-3 bg-charcoal text-cream text-xs tracking-widest uppercase font-body hover:bg-gold hover:text-charcoal transition-all">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                )}

                {saveMsg && (
                  <p className="text-green-600 text-xs font-body text-center">{saveMsg}</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}