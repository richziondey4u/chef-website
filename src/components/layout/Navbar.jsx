import { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Menu, User, LogOut, ShoppingBag,
  ChevronDown, Shield, Calendar, RefreshCw
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '../../context/AuthContext';
import { NAV_LINKS } from '../../constants';

// ── Avatar — photo or initials ────────────────────────────────
function Avatar({ profile, user, size = 'md' }) {
  const [imgError, setImgError] = useState(false);

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?';

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-10 h-10 text-sm',
  };

  if (profile?.avatar_url && !imgError) {
    return (
      <img
        src={profile.avatar_url}
        alt={profile?.full_name || 'Profile'}
        className={`${sizes[size]} rounded-full object-cover border-2
          border-gold/30 shrink-0`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-gold flex items-center
      justify-center text-charcoal font-body font-medium shrink-0 select-none`}>
      {initials}
    </div>
  );
}

// ── Greeting ──────────────────────────────────────────────────
function getGreeting(name) {
  const hour      = new Date().getHours();
  const firstName = name?.split(' ')[0] || '';
  const suffix    = firstName ? `, ${firstName}` : '';
  if (hour < 12) return `Good morning${suffix} ☀️`;
  if (hour < 17) return `Good afternoon${suffix} 🌤`;
  if (hour < 21) return `Good evening${suffix} 🌆`;
  return `Good night${suffix} 🌙`;
}

// ── Dropdown item ─────────────────────────────────────────────
function DropdownItem({ icon: Icon, label, onClick, danger, gold, badge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 font-body text-sm
        transition-colors text-left
        ${danger ? 'text-red-500 hover:bg-red-50'  :
          gold   ? 'text-gold   hover:bg-gold/10'   :
                   'text-charcoal hover:bg-gray-50' }`}
    >
      <Icon size={14} className="shrink-0" />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="text-xs bg-gold text-charcoal px-1.5 py-0.5
          font-body font-medium">
          {badge}
        </span>
      )}
    </button>
  );
}

// ── Main Navbar ───────────────────────────────────────────────
export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [dropdown,  setDropdown]  = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dropdownRef = useRef(null);
  const navigate    = useNavigate();

  const { user, profile, isAdmin, signOut, fetchProfile } = useAuth();

  const firstName = profile?.full_name?.split(' ')[0] || 'Account';
  const greeting  = getGreeting(profile?.full_name);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async () => {
    setDropdown(false);
    setSheetOpen(false);
    await signOut();
    navigate('/');
  };

  const goTo = useCallback((path) => {
    setDropdown(false);
    setSheetOpen(false);
    navigate(path);
  }, [navigate]);

  // Manual role refresh — if they appear as wrong role
  const handleRefreshRole = async () => {
    if (!user || refreshing) return;
    setRefreshing(true);
    await fetchProfile(user.id);
    setRefreshing(false);
  };

  const linkClass = ({ isActive }) =>
    `gold-underline font-body text-sm tracking-wide transition-colors duration-200
     ${isActive ? 'text-gold' : 'text-charcoal hover:text-gold'}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-gold/20'
          : 'bg-cream/80 backdrop-blur-sm border-b border-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* ── Logo ── */}
        <NavLink to="/" className="flex flex-col leading-none group">
          <span
            className="text-gold tracking-widest uppercase group-hover:opacity-80
              transition-opacity font-body"
            style={{ fontSize: 9, letterSpacing: '0.3em' }}
          >
            MAISON
          </span>
          <span className="font-display text-2xl font-light tracking-wide text-charcoal">
            Fontaine
          </span>
        </NavLink>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, path }) => (
            <NavLink key={path} to={path} end={path === '/'} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── Desktop right ── */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdown(d => !d)}
                className="flex items-center gap-2 group py-1 px-1 rounded-full
                  hover:bg-gold/5 transition-colors"
              >
                <Avatar profile={profile} user={user} size="md" />

                <div className="hidden lg:block text-left">
                  <div className="font-body text-xs text-warm-gray leading-none mb-0.5">
                    {greeting.split(',')[0]}
                  </div>
                  <div className="font-body text-sm text-charcoal group-hover:text-gold
                    transition-colors max-w-[100px] truncate leading-none">
                    {firstName}
                  </div>
                </div>

                <ChevronDown size={14}
                  className={`text-warm-gray transition-transform duration-200
                    ${dropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown */}
              {dropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white
                  border border-gold/20 shadow-xl z-50 overflow-hidden">

                  {/* Header */}
                  <div className="px-4 py-4 border-b border-gold/10 bg-cream/50">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar profile={profile} user={user} size="lg" />
                      <div className="min-w-0 flex-1">
                        <p className="font-body text-sm font-medium text-charcoal truncate">
                          {profile?.full_name || 'User'}
                        </p>
                        <p className="font-body text-xs text-warm-gray truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-body px-2 py-0.5 capitalize
                        border
                        ${isAdmin
                          ? 'bg-gold/20 text-gold border-gold/30'
                          : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        {profile?.role || 'user'}
                      </span>

                      {/* Refresh role button — useful when role mismatch */}
                      <button
                        onClick={handleRefreshRole}
                        disabled={refreshing}
                        title="Refresh permissions"
                        className="text-warm-gray/50 hover:text-gold transition-colors
                          disabled:opacity-30"
                      >
                        <RefreshCw
                          size={11}
                          className={refreshing ? 'animate-spin' : ''}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="py-1">
                    <DropdownItem
                      icon={User}
                      label="My Profile"
                      onClick={() => goTo('/profile')}
                    />
                    <DropdownItem
                      icon={ShoppingBag}
                      label="Order History"
                      onClick={() => goTo('/profile?tab=orders')}
                    />
                    <DropdownItem
                      icon={Calendar}
                      label="Event Bookings"
                      onClick={() => goTo('/profile?tab=bookings')}
                    />

                    {isAdmin && (
                      <>
                        <div className="border-t border-gold/10 my-1" />
                        <DropdownItem
                          icon={Shield}
                          label="Admin Panel"
                          gold
                          onClick={() => goTo('/admin')}
                        />
                      </>
                    )}

                    <div className="border-t border-gold/10 my-1" />
                    <DropdownItem
                      icon={LogOut}
                      label="Sign Out"
                      danger
                      onClick={handleSignOut}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/auth')}
                className="flex items-center gap-1.5 font-body text-sm text-charcoal
                  hover:text-gold transition-colors tracking-wide"
              >
                <User size={15} />
                Sign In
              </button>
              <button
                onClick={() => navigate('/auth?tab=register')}
                className="bg-charcoal text-cream text-xs tracking-widest uppercase
                  px-5 py-2.5 border border-charcoal hover:bg-gold hover:border-gold
                  hover:text-charcoal transition-all duration-300 font-body"
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* ── Mobile right ── */}
        <div className="md:hidden flex items-center gap-3">
          {user ? (
            <button
              onClick={() => goTo('/profile')}
              className="shrink-0 hover:opacity-80 transition-opacity"
            >
              <Avatar profile={profile} user={user} size="sm" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="text-charcoal hover:text-gold transition-colors p-1"
            >
              <User size={20} />
            </button>
          )}

          {/* Mobile sheet */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button className="p-1 text-charcoal hover:text-gold transition-colors">
                <Menu size={22} />
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="bg-cream border-l border-gold/20 w-72 flex flex-col p-0"
            >
              {/* Sheet logo */}
              <div className="px-6 pt-8 pb-6 border-b border-gold/15">
                <div className="text-gold tracking-widest uppercase font-body mb-1"
                  style={{ fontSize: 9 }}>MAISON</div>
                <div className="font-display text-3xl font-light tracking-wide
                  text-charcoal">Fontaine</div>
                <div className="w-10 h-px bg-gold mt-3" />
              </div>

              {/* User info */}
              {user && (
                <div className="px-6 py-5 border-b border-gold/15">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar profile={profile} user={user} size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="font-body text-sm font-medium text-charcoal truncate">
                        {profile?.full_name || 'User'}
                      </p>
                      <p className="font-body text-xs text-warm-gray truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <p className="font-body text-xs text-warm-gray italic mb-2">
                    {greeting}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-body px-2 py-0.5 capitalize
                      border
                      ${isAdmin
                        ? 'bg-gold/20 text-gold border-gold/30'
                        : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {profile?.role || 'user'}
                    </span>
                    <button
                      onClick={handleRefreshRole}
                      disabled={refreshing}
                      title="Refresh permissions"
                      className="text-warm-gray/50 hover:text-gold transition-colors
                        disabled:opacity-30"
                    >
                      <RefreshCw
                        size={11}
                        className={refreshing ? 'animate-spin' : ''}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Nav links */}
              <nav className="flex flex-col px-6 py-2 flex-1 overflow-y-auto">
                {NAV_LINKS.map(({ label, path }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end={path === '/'}
                    onClick={() => setSheetOpen(false)}
                    className={({ isActive }) =>
                      `font-body text-base tracking-wide py-3.5 border-b
                       border-gold/10 transition-colors
                       ${isActive ? 'text-gold' : 'text-charcoal hover:text-gold'}`
                    }
                  >
                    {label}
                  </NavLink>
                ))}

                {user && (
                  <>
                    <button
                      onClick={() => goTo('/profile?tab=orders')}
                      className="flex items-center gap-2 font-body text-base
                        tracking-wide py-3.5 border-b border-gold/10 text-charcoal
                        hover:text-gold transition-colors text-left"
                    >
                      <ShoppingBag size={14} />
                      Order History
                    </button>
                    <button
                      onClick={() => goTo('/profile?tab=bookings')}
                      className="flex items-center gap-2 font-body text-base
                        tracking-wide py-3.5 border-b border-gold/10 text-charcoal
                        hover:text-gold transition-colors text-left"
                    >
                      <Calendar size={14} />
                      Event Bookings
                    </button>
                  </>
                )}

                {isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={() => setSheetOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 font-body text-base tracking-wide
                       py-3.5 border-b border-gold/10 transition-colors
                       ${isActive ? 'text-gold' : 'text-charcoal hover:text-gold'}`
                    }
                  >
                    <Shield size={14} />
                    Admin Panel
                  </NavLink>
                )}
              </nav>

              {/* Bottom */}
              <div className="px-6 pb-8 pt-4 border-t border-gold/15 space-y-3">
                {user ? (
                  <>
                    <button
                      onClick={() => goTo('/profile')}
                      className="w-full flex items-center gap-2 font-body text-sm
                        text-charcoal hover:text-gold transition-colors py-2"
                    >
                      <User size={14} />
                      My Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 font-body text-sm
                        text-red-500 hover:text-red-600 transition-colors py-2"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { navigate('/auth'); setSheetOpen(false); }}
                      className="w-full bg-charcoal text-cream text-xs tracking-widest
                        uppercase py-3.5 hover:bg-gold hover:text-charcoal
                        transition-all font-body"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { navigate('/auth?tab=register'); setSheetOpen(false); }}
                      className="w-full border border-charcoal text-charcoal text-xs
                        tracking-widest uppercase py-3.5 hover:bg-charcoal
                        hover:text-cream transition-all font-body"
                    >
                      Create Account
                    </button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}