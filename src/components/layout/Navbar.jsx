import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NAV_LINKS } from '../../constants';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Add shadow + stronger bg after scrolling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    `gold-underline font-body text-sm tracking-wide transition-colors duration-200
     ${isActive ? 'text-gold' : 'text-charcoal hover:text-gold'}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-gold/20'
          : 'bg-cream/80 backdrop-blur-sm border-b border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/" className="flex flex-col leading-none group">
          <span
            className="text-gold tracking-widest uppercase group-hover:opacity-80 transition-opacity"
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

        {/* Desktop CTA */}
        <button
          onClick={() => navigate('/contact')}
          className="hidden md:flex items-center gap-2 bg-charcoal text-cream text-xs
            tracking-widest uppercase px-6 py-3 border border-charcoal
            hover:bg-gold hover:border-gold hover:text-charcoal transition-all duration-300"
        >
          Book Now
        </button>

        {/* Mobile nav — uses shadcn Sheet (drawer) */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden p-2 text-charcoal hover:text-gold transition-colors">
              <Menu size={22} />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-cream border-l border-gold/20 w-72 flex flex-col pt-16"
          >
            {/* Logo inside drawer */}
            <div className="px-6 mb-10">
              <div className="text-gold tracking-widest uppercase" style={{ fontSize: 9 }}>MAISON</div>
              <div className="font-display text-3xl font-light tracking-wide text-charcoal">Fontaine</div>
              <div className="w-10 h-px bg-gold mt-3" />
            </div>

            {/* Links */}
            <nav className="flex flex-col px-6 gap-1">
              {NAV_LINKS.map(({ label, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) =>
                    `font-body text-base tracking-wide py-3 border-b border-gold/10 transition-colors
                     ${isActive ? 'text-gold' : 'text-charcoal hover:text-gold'}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* CTA at bottom */}
            <div className="mt-auto px-6 pb-10">
              <button
                onClick={() => navigate('/contact')}
                className="w-full bg-charcoal text-cream text-xs tracking-widest
                  uppercase py-4 hover:bg-gold hover:text-charcoal transition-all"
              >
                Book Now
              </button>
            </div>
          </SheetContent>
        </Sheet>

      </div>
    </header>
  );
}