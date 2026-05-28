import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const STATUSES = ['all', 'pending', 'preparing', 'ready', 'delivered'];

const statusColor = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  preparing: 'bg-blue-100 text-blue-700 border-blue-200',
  ready: 'bg-green-100 text-green-700 border-green-200',
  delivered: 'bg-gray-100 text-gray-500 border-gray-200',
};

export default function Admin() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!loading) {
      if (!user) navigate('/auth');
      else if (profile && profile.role !== 'admin') navigate('/');
    }
  }, [user, profile, loading]);

  useEffect(() => {
    if (profile?.role === 'admin') fetchOrders();
  }, [profile]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*, profiles(full_name, phone)')
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setOrdersLoading(false);
  };

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setUpdating(null);
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    revenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
  };

  if (loading || ordersLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <span className="text-gold text-xs tracking-widest uppercase font-body">Admin</span>
          <h1 className="font-display text-5xl font-light text-charcoal mt-1">
            Order <em>Dashboard</em>
          </h1>
          <div className="w-14 h-px bg-gold mt-3" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: 'Total Orders', value: stats.total },
            { label: 'Pending', value: stats.pending },
            { label: 'Preparing', value: stats.preparing },
            { label: 'Ready', value: stats.ready },
            { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}` },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gold/15 p-5 text-center">
              <p className="font-display text-3xl text-gold">{s.value}</p>
              <p className="text-xs tracking-widest uppercase text-warm-gray font-body mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 text-xs tracking-widest uppercase font-body border transition-all
                ${filter === s ? 'bg-charcoal text-cream border-charcoal' : 'border-gold/20 text-warm-gray hover:border-gold/50'}`}
            >
              {s} {s !== 'all' && `(${orders.filter(o => o.status === s).length})`}
            </button>
          ))}
          <button
            onClick={fetchOrders}
            className="ml-auto px-4 py-2 text-xs tracking-widest uppercase font-body border border-gold/20 text-warm-gray hover:border-gold transition-all"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Orders table */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-gold/15 p-12 text-center">
            <p className="text-warm-gray font-body text-sm">No {filter === 'all' ? '' : filter} orders.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => (
              <div key={order.id} className="bg-white border border-gold/15 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">

                  {/* Order info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-display text-lg text-charcoal">{order.dish_name}</span>
                      <span className={`text-xs px-2 py-0.5 border font-body ${statusColor[order.status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-warm-gray text-xs font-body">
                      {order.order_code} · {order.order_type} · qty {order.quantity}
                    </p>
                    {order.profiles && (
                      <p className="text-warm-gray text-xs font-body mt-1">
                        👤 {order.profiles.full_name} {order.profiles.phone && `· ${order.profiles.phone}`}
                      </p>
                    )}
                    {order.delivery_address && (
                      <p className="text-warm-gray text-xs font-body mt-0.5">📍 {order.delivery_address}</p>
                    )}
                    {order.table_number && (
                      <p className="text-warm-gray text-xs font-body mt-0.5">🪑 Table {order.table_number}</p>
                    )}
                    {order.special_instructions && (
                      <p className="text-warm-gray text-xs font-body mt-0.5 italic">📝 "{order.special_instructions}"</p>
                    )}
                    {order.addons?.length > 0 && (
                      <p className="text-warm-gray text-xs font-body mt-0.5">
                        + {order.addons.map(a => a.label).join(', ')}
                      </p>
                    )}
                    <p className="text-warm-gray/50 text-xs font-body mt-2">
                      {new Date(order.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Price + status control */}
                  <div className="text-right shrink-0">
                    <p className="font-display text-xl text-gold mb-3">${order.total?.toFixed(2)}</p>
                    <div className="flex flex-col gap-1.5">
                      {['pending', 'preparing', 'ready', 'delivered'].map(s => (
                        <button
                          key={s}
                          onClick={() => updateStatus(order.id, s)}
                          disabled={order.status === s || updating === order.id}
                          className={`px-3 py-1.5 text-xs font-body tracking-wide border transition-all
                            ${order.status === s
                              ? 'bg-charcoal text-cream border-charcoal cursor-default'
                              : 'border-gold/20 text-warm-gray hover:border-gold hover:text-charcoal'
                            } disabled:opacity-50`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
