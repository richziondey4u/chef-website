import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Search, Shield, ShieldOff, AlertCircle, RefreshCw } from 'lucide-react';

const ROLE_COLORS = {
  user:       'bg-gray-100   text-gray-600',
  admin:      'bg-blue-100   text-blue-700',
  superadmin: 'bg-yellow-100 text-yellow-700',
};

export default function AdminUsers() {
  const { user, isSuperAdmin } = useAuth();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [search, setSearch]   = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setUsers(data || []);
    } catch (err) {
      console.error('Users fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchUsers();
  }, [user]);

  const updateRole = async (userId, newRole) => {
    if (!isSuperAdmin) {
      toast.error('Only superadmin can change user roles');
      return;
    }
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      toast.error(`Failed: ${error.message}`);
    } else {
      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, role: newRole } : u)
      );
      toast.success(`Role updated to ${newRole}`);
    }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  });

  const todayISO = new Date().toISOString().split('T')[0];
  const todayCount = users.filter(u => u.created_at?.startsWith(todayISO)).length;

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse mb-8" />
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white border border-gold/15 p-5 animate-pulse">
              <div className="h-10 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="bg-white border border-gold/15 p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0" />
            <div>
              <h3 className="font-body font-medium text-red-700 mb-1">
                Failed to load users
              </h3>
              <p className="text-red-600 text-sm font-body mb-3">{error}</p>
              <button onClick={fetchUsers}
                className="flex items-center gap-2 bg-red-500 text-white text-xs
                  tracking-widest uppercase px-6 py-2 hover:bg-red-600 font-body">
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-light text-charcoal">Users</h1>
          <div className="flex gap-4 mt-1">
            <span className="text-warm-gray font-body text-sm">
              {users.length} total accounts
            </span>
            <span className="text-gold font-body text-sm">
              {todayCount} joined today
            </span>
          </div>
        </div>
        <button onClick={fetchUsers}
          className="flex items-center gap-2 border border-warm-gray/30 text-warm-gray
            text-xs tracking-widest uppercase px-4 py-2 hover:border-gold
            hover:text-gold transition-all font-body">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Users',  value: users.filter(u => u.role === 'user').length,  color: 'text-charcoal' },
          { label: 'Admins',       value: users.filter(u => u.role === 'admin').length, color: 'text-blue-600' },
          { label: 'New Today',    value: todayCount,                                   color: 'text-green-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-gold/15 p-5 text-center">
            <div className={`font-display text-4xl font-light ${color}`}>{value}</div>
            <div className="text-warm-gray font-body text-xs tracking-widest
              uppercase mt-1">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2
          text-warm-gray pointer-events-none" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or phone..."
          className="w-full pl-9 pr-4 py-2.5 border border-warm-gray/30 bg-white
            font-body text-sm focus:border-gold focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gold/15">
          <p className="font-display text-2xl font-light text-charcoal">
            No users found
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(u => (
            <div key={u.id}
              className="bg-white border border-gold/15 p-5 flex flex-col
                sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center
                  justify-center text-gold font-display text-lg shrink-0">
                  {u.full_name?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <div className="font-body text-sm font-medium text-charcoal">
                    {u.full_name || '—'}
                  </div>
                  <div className="font-body text-xs text-warm-gray">{u.email}</div>
                  <div className="flex items-center flex-wrap gap-2 mt-1">
                    <span className={`text-xs font-body px-2 py-0.5 rounded-sm
                      capitalize ${ROLE_COLORS[u.role] || ROLE_COLORS.user}`}>
                      {u.role}
                    </span>
                    <span className="text-warm-gray/50 text-xs font-body">
                      Joined {new Date(u.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </span>
                    {u.phone && (
                      <span className="text-warm-gray/50 text-xs font-body">
                        {u.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Role controls — superadmin only */}
              {isSuperAdmin && u.id !== user?.id && (
                <div className="flex items-center gap-2 shrink-0">
                  {u.role === 'user' && (
                    <button
                      onClick={() => updateRole(u.id, 'admin')}
                      className="flex items-center gap-1.5 text-xs font-body
                        border border-blue-200 text-blue-600 px-3 py-1.5
                        hover:bg-blue-50 transition-colors"
                    >
                      <Shield size={12} /> Make Admin
                    </button>
                  )}
                  {u.role === 'admin' && (
                    <button
                      onClick={() => updateRole(u.id, 'user')}
                      className="flex items-center gap-1.5 text-xs font-body
                        border border-red-200 text-red-500 px-3 py-1.5
                        hover:bg-red-50 transition-colors"
                    >
                      <ShieldOff size={12} /> Remove Admin
                    </button>
                  )}
                  {u.role === 'superadmin' && (
                    <span className="text-xs text-gold font-body border
                      border-gold/30 px-3 py-1.5">
                      Superadmin
                    </span>
                  )}
                </div>
              )}

              {/* Can't edit yourself */}
              {u.id === user?.id && (
                <span className="text-xs text-warm-gray/40 font-body shrink-0">
                  (you)
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}