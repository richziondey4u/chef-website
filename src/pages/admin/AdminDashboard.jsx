import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Users, ShoppingBag, TrendingUp, Eye, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (!user) return;
    loadStats();
  }, [user]);

  async function loadStats() {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      // Fetch all in parallel
      const [
        usersRes,
        todayUsersRes,
        ordersRes,
        pendingRes,
        viewsRes,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'user'),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'user').gte('created_at', todayISO),
        supabase.from('orders').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('page_views').select('page'),
      ]);

      // Check for RLS errors
      if (usersRes.error)    throw new Error(`Profiles error: ${usersRes.error.message}`);
      if (ordersRes.error)   throw new Error(`Orders error: ${ordersRes.error.message}`);
      if (viewsRes.error)    throw new Error(`Page views error: ${viewsRes.error.message}`);

      // Count page views per section
      const pageViews = (viewsRes.data || []).reduce((acc, v) => {
        acc[v.page] = (acc[v.page] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalUsers:    usersRes.count    ?? 0,
        todayUsers:    todayUsersRes.count ?? 0,
        totalOrders:   ordersRes.count   ?? 0,
        pendingOrders: pendingRes.count  ?? 0,
        pageViews,
      });
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded w-48 animate-pulse mb-2" />
          <div className="h-4 bg-gray-100 rounded w-64 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white border border-gold/15 p-6 animate-pulse">
              <div className="h-5 w-5 bg-gray-200 rounded mb-3" />
              <div className="h-10 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
        <div className="bg-white border border-gold/15 p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-48 mb-6" />
          {[1,2,3].map(i => (
            <div key={i} className="mb-4">
              <div className="h-3 bg-gray-100 rounded mb-1" />
              <div className="h-1.5 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 p-6 rounded-sm">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-body font-medium text-red-700 mb-1">
                Failed to load dashboard data
              </h3>
              <p className="text-red-600 text-sm font-body mb-4">{error}</p>
              <div className="text-sm text-red-500 font-body space-y-1">
                <p>This is usually caused by one of:</p>
                <p>1. Your account role is not set to <code className="bg-red-100 px-1">admin</code> in the profiles table</p>
                <p>2. RLS policies haven't been applied yet</p>
                <p>3. Run: <code className="bg-red-100 px-1">UPDATE profiles SET role = 'admin' WHERE email = '{user?.email}';</code></p>
              </div>
              <button
                onClick={loadStats}
                className="mt-4 bg-red-500 text-white text-xs tracking-widest
                  uppercase px-6 py-2 hover:bg-red-600 transition-colors font-body"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users',    value: stats.totalUsers,    icon: Users,       color: 'text-blue-400' },
    { label: 'New Today',      value: stats.todayUsers,    icon: TrendingUp,  color: 'text-green-400' },
    { label: 'Total Orders',   value: stats.totalOrders,   icon: ShoppingBag, color: 'text-gold' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Eye,         color: 'text-red-400' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-light text-charcoal">Dashboard</h1>
        <p className="text-warm-gray font-body text-sm mt-1">
          Welcome back, {profile?.full_name} ·{' '}
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long', year: 'numeric',
            month: 'long', day: 'numeric',
          })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gold/15 p-6">
            <div className={`${color} mb-3`}><Icon size={20} /></div>
            <div className="font-display text-4xl font-light text-charcoal">
              {value}
            </div>
            <div className="text-warm-gray font-body text-xs tracking-widest
              uppercase mt-1">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Page views */}
      <div className="bg-white border border-gold/15 p-6">
        <div className="text-xs tracking-widest uppercase text-gold font-body mb-6">
          Requests per Section
        </div>
        {Object.keys(stats.pageViews).length === 0 ? (
          <p className="text-warm-gray font-body text-sm">
            No page view data yet. Views are tracked when logged-in users visit pages.
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(stats.pageViews)
              .sort(([, a], [, b]) => b - a)
              .map(([page, count]) => {
                const max = Math.max(...Object.values(stats.pageViews));
                const pct = Math.round((count / max) * 100);
                return (
                  <div key={page}>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-body text-sm text-charcoal capitalize">
                        {page}
                      </span>
                      <span className="font-body text-sm text-gold font-medium">
                        {count} {count === 1 ? 'visit' : 'visits'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}