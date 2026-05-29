import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, ShoppingBag, Settings, ChevronDown, Shield } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '../../context/AuthContext';
import { NAV_LINKS } from '../../constants';

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [dropdown, setDropdown]   = useState(false);
  const dropdownRef               = useRef(null);
  const navigate                  = useNavigate();
  const { user, profile, isAdmin, signOut } = useAuth();

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown when clicking outside
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
    await signOut();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `gold-underline font-body text-sm tracking-wide transition-colors duration-200
     ${isActive ? 'text-gold' : 'text-charcoal hover:text-gold'}`;

  // Avatar initials
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled
        ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-gold/20'
        : 'bg-cream/80 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
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

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, path }) => (
            <NavLink key={path} to={path} end={path === '/'} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">

          {user ? (
            // ── Logged in — show avatar dropdown ──────────
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdown(d => !d)}
                className="flex items-center gap-2 group"
              >
                {/* Avatar circle */}
                <div className="w-9 h-9 rounded-full bg-gold flex items-center
                  justify-center text-charcoal font-body text-sm font-medium
                  group-hover:bg-gold/80 transition-colors shrink-0">
                  {initials}
                </div>

                {/* Name — desktop only */}
                <span className="font-body text-sm text-charcoal group-hover:text-gold
                  transition-colors max-w-[100px] truncate hidden lg:block">
                  {profile?.full_name?.split(' ')[0] || 'Account'}
                </span>

                <ChevronDown
                  size={14}
                  className={`text-warm-gray transition-transform duration-200
                    ${dropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown menu */}
              {dropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white
                  border border-gold/20 shadow-xl z-50 py-1">

                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-gold/10">
                    <p className="font-body text-sm font-medium text-charcoal truncate">
                      {profile?.full_name || 'User'}
                    </p>
                    <p className="font-body text-xs text-warm-gray truncate mt-0.5">
                      {user.email}
                    </p>
                    <span className={`inline-block mt-1.5 text-xs font-body px-2
                      py-0.5 capitalize
                      ${isAdmin
                        ? 'bg-gold/20 text-gold border border-gold/30'
                        : 'bg-gray-100 text-gray-500'}`}>
                      {profile?.role || 'user'}
                    </span>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <DropdownItem
                      icon={User}
                      label="My Profile"
                      onClick={() => { navigate('/profile'); setDropdown(false); }}
                    />
                    <DropdownItem
                      icon={ShoppingBag}
                      label="Order History"
                      onClick={() => { navigate('/profile?tab=orders'); setDropdown(false); }}
                    />
                    {isAdmin && (
                      <>
                        <div className="border-t border-gold/10 my-1" />
                        <DropdownItem
                          icon={Shield}
                          label="Admin Panel"
                          gold
                          onClick={() => { navigate('/admin'); setDropdown(false); }}
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
            // ── Not logged in — show login + register ──────
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

        {/* Mobile — hamburger + avatar */}
        <div className="md:hidden flex items-center gap-3">

          {/* Mobile avatar or login icon */}
          {user ? (
            <button
              onClick={() => navigate('/profile')}
              className="w-8 h-8 rounded-full bg-gold flex items-center justify-center
                text-charcoal font-body text-xs font-medium"
            >
              {initials}
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="text-charcoal hover:text-gold transition-colors"
            >
              <User size={20} />
            </button>
          )}

          {/* Mobile sheet drawer */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-1 text-charcoal hover:text-gold transition-colors">
                <Menu size={22} />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-cream border-l border-gold/20 w-72 flex flex-col pt-16"
            >
              {/* Logo inside drawer */}
              <div className="px-6 mb-8">
                <div className="text-gold tracking-widest uppercase font-body"
                  style={{ fontSize: 9 }}>MAISON</div>
                <div className="font-display text-3xl font-light tracking-wide
                  text-charcoal">Fontaine</div>
                <div className="w-10 h-px bg-gold mt-3" />
              </div>

              {/* User info in drawer */}
              {user && (
                <div className="px-6 mb-6 pb-6 border-b border-gold/15">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold flex items-center
                      justify-center text-charcoal font-body text-sm font-medium shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-body text-sm font-medium text-charcoal truncate">
                        {profile?.full_name || 'User'}
                      </p>
                      <p className="font-body text-xs text-warm-gray truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav links */}
              <nav className="flex flex-col px-6 gap-1 flex-1">
                {NAV_LINKS.map(({ label, path }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end={path === '/'}
                    className={({ isActive }) =>
                      `font-body text-base tracking-wide py-3 border-b border-gold/10
                       transition-colors
                       ${isActive ? 'text-gold' : 'text-charcoal hover:text-gold'}`
                    }
                  >
                    {label}
                  </NavLink>
                ))}

                {/* Admin link in mobile drawer */}
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `font-body text-base tracking-wide py-3 border-b border-gold/10
                       transition-colors flex items-center gap-2
                       ${isActive ? 'text-gold' : 'text-charcoal hover:text-gold'}`
                    }
                  >
                    <Shield size={14} />
                    Admin Panel
                  </NavLink>
                )}
              </nav>

              {/* Bottom actions */}
              <div className="px-6 pb-10 pt-4 space-y-3 border-t border-gold/15">
                {user ? (
                  <>
                    <button
                      onClick={() => navigate('/profile')}
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
                      onClick={() => navigate('/auth')}
                      className="w-full bg-charcoal text-cream text-xs tracking-widest
                        uppercase py-3 hover:bg-gold hover:text-charcoal transition-all
                        font-body"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => navigate('/auth?tab=register')}
                      className="w-full border border-charcoal text-charcoal text-xs
                        tracking-widest uppercase py-3 hover:bg-charcoal hover:text-cream
                        transition-all font-body"
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

// ── Reusable dropdown item ──────────────────────────────────
function DropdownItem({ icon: Icon, label, onClick, danger, gold }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 font-body text-sm
        transition-colors text-left
        ${danger ? 'text-red-500 hover:bg-red-50' :
          gold   ? 'text-gold   hover:bg-gold/10'  :
                   'text-charcoal hover:bg-gray-50'}`}
    >
      <Icon size={14} className="shrink-0" />
      {label}
    </button>
  );
}