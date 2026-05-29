import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed,
  Users, LogOut, ChevronRight
} from 'lucide-react';

const ADMIN_NAV = [
  { label: 'Dashboard',  path: '/admin',         icon: LayoutDashboard },
  { label: 'Orders',     path: '/admin/orders',   icon: ShoppingBag },
  { label: 'Menu',       path: '/admin/menu',     icon: UtensilsCrossed },
  { label: 'Users',      path: '/admin/users',    icon: Users },
];

export default function AdminLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Sidebar */}
      <aside className="w-64 bg-charcoal flex flex-col shrink-0">
        <div className="p-6 border-b border-warm-gray/20">
          <div className="text-gold text-xs tracking-widest uppercase mb-1" style={{ fontSize: 9 }}>
            MAISON
          </div>
          <div className="font-display text-2xl text-cream font-light">Admin</div>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center
              text-charcoal text-xs font-medium font-body">
              {profile?.full_name?.[0] || 'A'}
            </div>
            <div>
              <div className="text-cream text-xs font-body">{profile?.full_name}</div>
              <div className="text-warm-gray text-xs font-body capitalize">{profile?.role}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {ADMIN_NAV.map(({ label, path, icon: Icon }) => (
            <NavLink key={path} to={path} end={path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 font-body text-sm tracking-wide
                transition-all group
                ${isActive
                  ? 'bg-gold text-charcoal'
                  : 'text-warm-gray hover:text-cream hover:bg-white/5'}`
              }>
              <Icon size={16} />
              {label}
              <ChevronRight size={12} className="ml-auto opacity-50" />
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-warm-gray/20">
          <button onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-warm-gray
              hover:text-red-400 transition-colors font-body text-sm">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}