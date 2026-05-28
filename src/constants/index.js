export const NAV_LINKS = [
  { label: 'Home',     path: '/' },
  { label: 'Chefs',    path: '/chefs' },
  { label: 'Menu',     path: '/menu' },
  { label: 'Events',   path: '/events' },
  { label: 'Contact',  path: '/contact' },
];

export const MENU_CATEGORIES = ['all', 'starters', 'mains', 'desserts'];

export const SERVICES = [
  {
    icon: '🥂',
    title: 'Private Dining',
    path: '/events/private-dining',
    desc: 'Bespoke tasting menus in your home or chosen venue. 2–20 guests. Chef, sommelier, and service staff included.',
    from: 'From $1,200',
    color: 'from-amber-900/40 to-charcoal',
    features: [
      'Personal chef assigned',
      'Custom menu design',
      'Sommelier pairing',
      'Full service staff',
      'Venue setup included',
    ],
  },
  {
    icon: '💍',
    title: 'Weddings & Celebrations',
    path: '/events/weddings',
    desc: 'Full catering from intimate receptions to grand celebrations for 500 guests.',
    from: 'Custom Quote',
    color: 'from-rose-900/40 to-charcoal',
    features: [
      'Tasting session included',
      'Custom wedding menu',
      'Traditional & contemporary options',
      'Full catering crew',
      'Setup & cleanup',
    ],
  },
  {
    icon: '🏢',
    title: 'Corporate Catering',
    path: '/events/corporate',
    desc: 'Executive dinners, product launches, and team experiences designed to impress.',
    from: 'From $85/head',
    color: 'from-blue-900/40 to-charcoal',
    features: [
      'Branded menu cards',
      'Flexible guest count',
      'Dietary accommodations',
      'On-site chef',
      'Invoicing & receipts',
    ],
  },
  {
    icon: '📚',
    title: 'Cooking Classes',
    path: '/events/cooking-classes',
    desc: 'Intimate masterclasses with our head chefs. Learn from scratch.',
    from: 'From $180/person',
    color: 'from-green-900/40 to-charcoal',
    features: [
      'Max 12 participants',
      'Ingredients provided',
      'Recipe booklet included',
      'Certificate of completion',
      'Refreshments included',
    ],
  },
];