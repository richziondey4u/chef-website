import { NavLink, useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NAV_LINKS } from "../../constants";

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "Location",
    value: "14 Rue de la Paix, Paris · 36 W 57th St, New York",
  },
  { icon: Phone, label: "Phone", value: "+1 (212) 555-0192" },
  { icon: Mail, label: "Email", value: "reservations@maisonfontaine.com" },
  { icon: Clock, label: "Hours", value: "Mon–Sat, 9am–8pm EST" },
];

const SOCIALS = [
  { platform: "Instagram", handle: "@maisonfontaine", href: "#" },
  { platform: "Facebook", handle: "Maison Fontaine", href: "#" },
  { platform: "LinkedIn", handle: "Maison Fontaine Co.", href: "#" },
];

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div
              className="text-gold tracking-widest uppercase mb-1"
              style={{ fontSize: 9, letterSpacing: "0.3em" }}
            >
              MAISON
            </div>
            <div className="font-display text-4xl font-light text-cream tracking-wide">
              Fontaine
            </div>
            <div className="w-10 h-px bg-gold mt-4 mb-5" />
            <p className="text-warm-gray font-body text-sm leading-relaxed">
              Exceptional culinary experiences for the occasions that matter
              most.
            </p>
            <p className="text-warm-gray/50 font-body text-xs mt-3 tracking-wide">
              Paris · New York · London
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div className="text-gold text-xs tracking-widest uppercase mb-6">
              Navigation
            </div>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map(({ label, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === "/"}
                  className={({ isActive }) =>
                    `font-body text-sm transition-colors duration-200
                     ${isActive ? "text-gold" : "text-warm-gray hover:text-cream"}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Contact info */}
          <div>
            <div className="text-gold text-xs tracking-widest uppercase mb-6">
              Contact
            </div>
            <div className="flex flex-col gap-4">
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon size={14} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <div
                      className="text-gold/70 uppercase tracking-widest mb-0.5"
                      style={{ fontSize: 9 }}
                    >
                      {label}
                    </div>
                    <div className="font-body text-xs text-warm-gray leading-relaxed">
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social + newsletter teaser */}
          <div>
            <div className="text-gold text-xs tracking-widest uppercase mb-6">
              Follow Us
            </div>
            <div className="flex flex-col gap-4 mb-8">
              {SOCIALS.map(({ platform, handle, href }) => (
                <a
                  key={platform}
                  href={href}
                  className="group flex items-center justify-between"
                >
                  <div>
                    <div className="font-body text-sm text-warm-gray group-hover:text-cream transition-colors">
                      {platform}
                    </div>
                    <div className="font-body text-xs text-warm-gray/40">
                      {handle}
                    </div>
                  </div>

                  <span className="text-warm-gray/30 group-hover:text-gold transition-colors text-lg">
                    →
                  </span>
                </a>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate("/contact")}
              className="w-full text-xs tracking-widest uppercase py-3
                border border-gold/40 text-gold hover:bg-gold hover:text-charcoal
                transition-all duration-300 font-body"
            >
              Make a Reservation
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <Separator className="bg-warm-gray/10" />
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="font-body text-xs text-warm-gray/40">
          © {year} Maison Fontaine. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
            (item) => (
              <button
                key={item}
                className="font-body text-xs text-warm-gray/40 hover:text-warm-gray transition-colors"
              >
                {item}
              </button>
            ),
          )}
        </div>
      </div>
    </footer>
  );
}
