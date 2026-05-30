const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Auto-generates a stable slug ID from dish name
const slugify = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const createDishes = (dishes) =>
  dishes.map(dish => ({ ...dish, id: slugify(dish.name) }));

const nigerianDishes = createDishes([

  // ── STARTERS (14) ──────────────────────────────────────────

  {
    name: "Suya Skewers",
    category: "starters",
    price: 18,
    chef: "Marcus Osei",
    tags: ["signature", "spicy"],
    area: "Northern Nigeria",
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=280&fit=crop&q=80",
    ingredients: ["Beef sirloin", "Groundnut paste", "Yaji spice", "Onions", "Tomatoes", "Vegetable oil"],
    addons: [
      { label: "Extra yaji spice", price: 1.5 },
      { label: "Side of sliced onions", price: 1.0 },
      { label: "Zobo drink", price: 4.0 },
      { label: "Extra skewer", price: 5.0 },
    ],
  },
  {
    name: "Akara Bites",
    category: "starters",
    price: 14,
    chef: "Isabelle Fontaine",
    tags: ["vegetarian", "seasonal"],
    area: "Yoruba",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cee6b4?w=400&h=280&fit=crop&q=80",
    ingredients: ["Black-eyed peas", "Scotch bonnet", "Onion", "Crayfish", "Palm oil", "Salt"],
    addons: [
      { label: "Ogi (pap) pairing", price: 3.0 },
      { label: "Extra pepper dip", price: 1.5 },
      { label: "Zobo drink", price: 4.0 },
    ],
  },
  {
    name: "Peppered Snail",
    category: "starters",
    price: 26,
    chef: "Marcus Osei",
    tags: ["signature", "premium"],
    area: "Southern Nigeria",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=280&fit=crop&q=80",
    ingredients: ["Giant African snail", "Tomatoes", "Scotch bonnet", "Utazi leaves", "Palm oil", "Seasoning"],
    addons: [
      { label: "Extra pepper sauce", price: 2.0 },
      { label: "Side of agbalumo chutney", price: 3.5 },
      { label: "Chapman drink", price: 5.0 },
    ],
  },
  {
    name: "Boli & Groundnut",
    category: "starters",
    price: 12,
    chef: "Marcus Osei",
    tags: ["vegetarian"],
    area: "Lagos",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=280&fit=crop&q=80",
    ingredients: ["Plantain", "Groundnuts", "Palm oil", "Scotch bonnet", "Onion"],
    addons: [
      { label: "Extra groundnut sauce", price: 1.5 },
      { label: "Smoked fish side", price: 4.0 },
      { label: "Kunu drink", price: 3.5 },
    ],
  },
  {
    name: "Moi Moi Royale",
    category: "starters",
    price: 16,
    chef: "Marcus Osei",
    tags: ["signature"],
    area: "Pan-Nigerian",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=280&fit=crop&q=80",
    ingredients: ["Black-eyed peas", "Boiled egg", "Smoked prawns", "Crayfish", "Red bell pepper", "Scotch bonnet", "Palm oil"],
    addons: [
      { label: "Extra smoked prawns", price: 4.0 },
      { label: "Pepper sauce drizzle", price: 1.5 },
      { label: "Zobo drink", price: 4.0 },
    ],
  },
  {
    name: "Nkwobi",
    category: "starters",
    price: 22,
    chef: "Marcus Osei",
    tags: ["signature", "spicy"],
    area: "Igbo",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=280&fit=crop&q=80",
    ingredients: ["Cow foot", "Ugba", "Palm nut paste", "Utazi", "Onions", "Crayfish", "Seasoning"],
    addons: [
      { label: "Extra utazi leaves", price: 1.0 },
      { label: "Extra cow foot portion", price: 8.0 },
      { label: "Palmwine mocktail", price: 5.0 },
    ],
  },
  {
    name: "Gizdodo",
    category: "starters",
    price: 20,
    chef: "Isabelle Fontaine",
    tags: ["signature", "spicy"],
    area: "Lagos",
    image: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=400&h=280&fit=crop&q=80",
    ingredients: ["Chicken gizzard", "Ripe plantain", "Tomatoes", "Bell pepper", "Scotch bonnet", "Onion", "Seasoning"],
    addons: [
      { label: "Extra gizzard", price: 5.0 },
      { label: "Extra plantain", price: 3.0 },
      { label: "Chapman drink", price: 5.0 },
    ],
  },
  {
    name: "Isi Ewu",
    category: "starters",
    price: 28,
    chef: "Marcus Osei",
    tags: ["premium", "spicy"],
    area: "Enugu",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=280&fit=crop&q=80",
    ingredients: ["Goat head", "Ugba", "Palm oil", "Utazi", "Onion", "Ehuru", "Crayfish"],
    addons: [
      { label: "Extra ugba dressing", price: 2.5 },
      { label: "Side of garden egg", price: 2.0 },
      { label: "Kunu drink", price: 3.5 },
    ],
  },
  {
    name: "Peppered Turkey Wings",
    category: "starters",
    price: 24,
    chef: "Isabelle Fontaine",
    tags: ["signature", "spicy"],
    area: "Pan-Nigerian",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=280&fit=crop&q=80",
    ingredients: ["Turkey wings", "Scotch bonnet", "Tomatoes", "Bell pepper", "Onion", "Thyme", "Seasoning"],
    addons: [
      { label: "Extra pepper sauce", price: 2.0 },
      { label: "Fried plantain side", price: 3.0 },
      { label: "Chapman drink", price: 5.0 },
    ],
  },
  {
    name: "Asun Peppered Goat",
    category: "starters",
    price: 26,
    chef: "Marcus Osei",
    tags: ["spicy", "signature"],
    area: "Ekiti",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=280&fit=crop&q=80",
    ingredients: ["Goat meat", "Scotch bonnet", "Green pepper", "Onion", "Seasoning cubes", "Vegetable oil"],
    addons: [
      { label: "Extra goat meat", price: 6.0 },
      { label: "Zobo drink", price: 4.0 },
      { label: "Extra pepper", price: 1.5 },
    ],
  },
  {
    name: "Fried Yam & Ata Dindin",
    category: "starters",
    price: 13,
    chef: "Isabelle Fontaine",
    tags: ["vegetarian"],
    area: "Yoruba",
    image: "https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?w=400&h=280&fit=crop&q=80",
    ingredients: ["White yam", "Pepper sauce", "Onion", "Scotch bonnet", "Vegetable oil", "Salt"],
    addons: [
      { label: "Extra ata dindin sauce", price: 2.0 },
      { label: "Fried fish side", price: 5.0 },
      { label: "Kunu drink", price: 3.5 },
    ],
  },
  {
    name: "Grilled Tilapia Starter",
    category: "starters",
    price: 22,
    chef: "Marcus Osei",
    tags: ["seasonal"],
    area: "Lagos",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=280&fit=crop&q=80",
    ingredients: ["Tilapia fish", "Scotch bonnet", "Lemon", "Ginger", "Garlic", "Seasoning", "Vegetable oil"],
    addons: [
      { label: "Extra pepper sauce", price: 2.0 },
      { label: "Side of coleslaw", price: 3.0 },
      { label: "Chapman drink", price: 5.0 },
    ],
  },
  {
    name: "Kuli Kuli Salad",
    category: "starters",
    price: 15,
    chef: "Isabelle Fontaine",
    tags: ["vegetarian", "seasonal"],
    area: "Northern Nigeria",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=280&fit=crop&q=80",
    ingredients: ["Kuli kuli", "Mixed greens", "Tomatoes", "Cucumber", "Red onion", "Groundnut dressing"],
    addons: [
      { label: "Extra kuli kuli", price: 2.0 },
      { label: "Extra groundnut dressing", price: 1.5 },
      { label: "Zobo drink", price: 4.0 },
    ],
  },
  {
    name: "Smoke-Roasted Prawns",
    category: "starters",
    price: 30,
    chef: "Marcus Osei",
    tags: ["premium", "signature"],
    area: "Lagos",
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=280&fit=crop&q=80",
    ingredients: ["Tiger prawns", "Scotch bonnet", "Garlic", "Butter", "Lemon", "Thyme", "Seasoning"],
    addons: [
      { label: "Extra prawns", price: 7.0 },
      { label: "Garlic butter sauce", price: 2.5 },
      { label: "Chapman drink", price: 5.0 },
    ],
  },

  // ── MAINS (22) ────────────────────────────────────────────

  {
    name: "Jollof Rice Royal",
    category: "mains",
    price: 38,
    chef: "Marcus Osei",
    tags: ["signature", "premium"],
    area: "West Africa",
    image: "https://images.unsplash.com/photo-1567364816519-cbc9c4ffe1eb?w=400&h=280&fit=crop&q=80",
    ingredients: ["Long grain rice", "Tomatoes", "Red bell pepper", "Scotch bonnet", "Onion", "Chicken stock", "Bay leaves"],
    addons: [
      { label: "Extra fried plantain", price: 3.0 },
      { label: "Grilled chicken side", price: 8.0 },
      { label: "Moi moi addition", price: 4.0 },
      { label: "Zobo drink", price: 4.0 },
    ],
  },
  {
    name: "Egusi Soup & Pounded Yam",
    category: "mains",
    price: 46,
    chef: "Marcus Osei",
    tags: ["signature"],
    area: "Igbo",
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=280&fit=crop&q=80",
    ingredients: ["Egusi", "Assorted meat", "Smoked fish", "Bitter leaf", "Palm oil", "Crayfish", "Stockfish", "Yam"],
    addons: [
      { label: "Extra pounded yam", price: 4.0 },
      { label: "Extra assorted meat", price: 7.0 },
      { label: "Extra stockfish", price: 5.0 },
      { label: "Palmwine mocktail", price: 5.0 },
    ],
  },
  {
    name: "Ofe Onugbu & Fufu",
    category: "mains",
    price: 44,
    chef: "Marcus Osei",
    tags: ["premium", "seasonal"],
    area: "Anambra",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=280&fit=crop&q=80",
    ingredients: ["Bitter leaf", "Oxtail", "Stockfish", "Crayfish", "Palm oil", "Ogiri", "Cassava fufu"],
    addons: [
      { label: "Extra fufu portion", price: 3.5 },
      { label: "Extra oxtail", price: 9.0 },
      { label: "Kunu drink", price: 3.5 },
    ],
  },
  {
    name: "Catfish Pepper Soup",
    category: "mains",
    price: 34,
    chef: "Isabelle Fontaine",
    tags: ["spicy", "seasonal"],
    area: "Delta",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=280&fit=crop&q=80",
    ingredients: ["Catfish", "Ehuru", "Utazi leaf", "Uyayak", "Scotch bonnet", "Onion", "Seasoning"],
    addons: [
      { label: "Extra catfish piece", price: 6.0 },
      { label: "Agidi (corn pudding) side", price: 3.0 },
      { label: "Extra pepper", price: 1.0 },
      { label: "Chapman drink", price: 5.0 },
    ],
  },
  {
    name: "Ofada Rice & Ayamase",
    category: "mains",
    price: 42,
    chef: "Marcus Osei",
    tags: ["signature", "spicy"],
    area: "Ogun State",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=280&fit=crop&q=80",
    ingredients: ["Ofada rice", "Green pepper", "Assorted meat", "Iru", "Palm oil", "Crayfish"],
    addons: [
      { label: "Extra ayamase sauce", price: 3.0 },
      { label: "Extra assorted meat", price: 7.0 },
      { label: "Fried plantain side", price: 3.0 },
      { label: "Zobo drink", price: 4.0 },
    ],
  },
  {
    name: "Banga Soup & Starch",
    category: "mains",
    price: 48,
    chef: "Marcus Osei",
    tags: ["signature", "premium"],
    area: "Delta",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=280&fit=crop&q=80",
    ingredients: ["Palm nuts", "Dried fish", "Oxtail", "Banga spice", "Onions", "Crayfish", "Cassava starch"],
    addons: [
      { label: "Extra starch portion", price: 4.0 },
      { label: "Extra oxtail", price: 9.0 },
      { label: "Extra dried fish", price: 5.0 },
      { label: "Palmwine mocktail", price: 5.0 },
    ],
  },
  {
    name: "Edikang Ikong",
    category: "mains",
    price: 50,
    chef: "Isabelle Fontaine",
    tags: ["premium", "signature"],
    area: "Cross River",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=280&fit=crop&q=80",
    ingredients: ["Waterleaf", "Fluted pumpkin leaf", "Periwinkles", "Assorted seafood", "Palm oil", "Crayfish", "Stockfish"],
    addons: [
      { label: "Extra periwinkles", price: 5.0 },
      { label: "Pounded yam side", price: 4.0 },
      { label: "Garri (eba) side", price: 2.5 },
      { label: "Chapman drink", price: 5.0 },
    ],
  },
  {
    name: "Ogbono Soup & Eba",
    category: "mains",
    price: 40,
    chef: "Marcus Osei",
    tags: ["seasonal"],
    area: "Yoruba",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=280&fit=crop&q=80",
    ingredients: ["Ogbono seeds", "Okra", "Assorted meat", "Dried fish", "Palm oil", "Crayfish", "Garri"],
    addons: [
      { label: "Extra eba portion", price: 2.5 },
      { label: "Extra assorted meat", price: 7.0 },
      { label: "Okra addition", price: 3.0 },
      { label: "Zobo drink", price: 4.0 },
    ],
  },
  {
    name: "Afang Soup & Fufu",
    category: "mains",
    price: 48,
    chef: "Marcus Osei",
    tags: ["premium"],
    area: "Akwa Ibom",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=280&fit=crop&q=80",
    ingredients: ["Afang leaves", "Waterleaf", "Assorted meat", "Periwinkles", "Palm oil", "Crayfish", "Fufu"],
    addons: [
      { label: "Extra fufu portion", price: 3.5 },
      { label: "Extra periwinkles", price: 5.0 },
      { label: "Kunu drink", price: 3.5 },
    ],
  },
  {
    name: "Nigerian Fried Rice",
    category: "mains",
    price: 36,
    chef: "Isabelle Fontaine",
    tags: ["signature"],
    area: "Pan-Nigerian",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=280&fit=crop&q=80",
    ingredients: ["Long grain rice", "Liver", "Prawns", "Carrots", "Green peas", "Green beans", "Curry", "Thyme"],
    addons: [
      { label: "Grilled chicken side", price: 8.0 },
      { label: "Coleslaw addition", price: 3.0 },
      { label: "Extra prawns", price: 6.0 },
      { label: "Zobo drink", price: 4.0 },
    ],
  },
  {
    name: "Oha Soup & Pounded Yam",
    category: "mains",
    price: 45,
    chef: "Marcus Osei",
    tags: ["seasonal", "premium"],
    area: "Igbo",
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=280&fit=crop&q=80",
    ingredients: ["Oha leaves", "Cocoyam", "Assorted meat", "Stockfish", "Palm oil", "Crayfish", "Yam"],
    addons: [
      { label: "Extra pounded yam", price: 4.0 },
      { label: "Extra oha leaves", price: 2.5 },
      { label: "Extra assorted meat", price: 7.0 },
      { label: "Palmwine mocktail", price: 5.0 },
    ],
  },
  {
    name: "Tuwo Shinkafa & Miyan Kuka",
    category: "mains",
    price: 38,
    chef: "Marcus Osei",
    tags: ["signature", "seasonal"],
    area: "Hausa",
    image: "https://images.unsplash.com/photo-1567364816519-cbc9c4ffe1eb?w=400&h=280&fit=crop&q=80",
    ingredients: ["Soft rice", "Baobab leaves", "Lamb", "Smoked fish", "Dawadawa", "Onion", "Pepper"],
    addons: [
      { label: "Extra lamb portion", price: 8.0 },
      { label: "Extra tuwo portion", price: 3.5 },
      { label: "Kunu drink", price: 3.5 },
    ],
  },
  {
    name: "Abak Atama Soup",
    category: "mains",
    price: 52,
    chef: "Isabelle Fontaine",
    tags: ["premium", "signature"],
    area: "Akwa Ibom",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=280&fit=crop&q=80",
    ingredients: ["Palm nuts", "Atama leaves", "Fresh prawns", "Goat meat", "Periwinkles", "Crayfish", "Seasoning"],
    addons: [
      { label: "Pounded yam side", price: 4.0 },
      { label: "Extra fresh prawns", price: 7.0 },
      { label: "Extra periwinkles", price: 5.0 },
      { label: "Chapman drink", price: 5.0 },
    ],
  },
  {
    name: "Masa & Miyan Taushe",
    category: "mains",
    price: 34,
    chef: "Marcus Osei",
    tags: ["vegetarian", "seasonal"],
    area: "Kano",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=280&fit=crop&q=80",
    ingredients: ["Fermented rice", "Pumpkin leaves", "Goat meat", "Groundnut paste", "Onion", "Scotch bonnet"],
    addons: [
      { label: "Extra masa cakes", price: 3.0 },
      { label: "Extra goat meat", price: 7.0 },
      { label: "Kunu drink", price: 3.5 },
    ],
  },
  {
    name: "Ofe Akwu & Pounded Yam",
    category: "mains",
    price: 44,
    chef: "Marcus Osei",
    tags: ["signature"],
    area: "Igbo",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=280&fit=crop&q=80",
    ingredients: ["Palm fruit", "Chicken", "Smoked fish", "Crayfish", "Onion", "Seasoning", "Yam"],
    addons: [
      { label: "Extra pounded yam", price: 4.0 },
      { label: "Extra chicken", price: 7.0 },
      { label: "Palmwine mocktail", price: 5.0 },
    ],
  },
  {
    name: "Efo Riro & Amala",
    category: "mains",
    price: 42,
    chef: "Isabelle Fontaine",
    tags: ["signature", "spicy"],
    area: "Yoruba",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=280&fit=crop&q=80",
    ingredients: ["Spinach", "Assorted meat", "Crayfish", "Palm oil", "Locust beans", "Scotch bonnet", "Yam flour"],
    addons: [
      { label: "Extra amala portion", price: 3.5 },
      { label: "Extra assorted meat", price: 7.0 },
      { label: "Zobo drink", price: 4.0 },
    ],
  },
  {
    name: "Goat Meat Pepper Soup",
    category: "mains",
    price: 36,
    chef: "Marcus Osei",
    tags: ["spicy", "seasonal"],
    area: "Pan-Nigerian",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=280&fit=crop&q=80",
    ingredients: ["Goat meat", "Ehuru", "Utazi leaf", "Uyayak", "Scotch bonnet", "Onion", "Pepper soup spice"],
    addons: [
      { label: "Extra goat meat", price: 7.0 },
      { label: "Agidi side", price: 3.0 },
      { label: "Extra pepper", price: 1.0 },
      { label: "Chapman drink", price: 5.0 },
    ],
  },
  {
    name: "Nigerian Beef Stew & Rice",
    category: "mains",
    price: 40,
    chef: "Isabelle Fontaine",
    tags: ["signature"],
    area: "Pan-Nigerian",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=280&fit=crop&q=80",
    ingredients: ["Beef", "Tomatoes", "Red bell pepper", "Onion", "Curry", "Thyme", "Long grain rice"],
    addons: [
      { label: "Fried plantain side", price: 3.0 },
      { label: "Coleslaw side", price: 2.5 },
      { label: "Extra beef", price: 7.0 },
      { label: "Zobo drink", price: 4.0 },
    ],
  },
  {
    name: "Seafood Okra Soup",
    category: "mains",
    price: 54,
    chef: "Isabelle Fontaine",
    tags: ["premium", "signature"],
    area: "Lagos",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=280&fit=crop&q=80",
    ingredients: ["Okra", "Tiger prawns", "Crab", "Periwinkles", "Palm oil", "Crayfish", "Scotch bonnet"],
    addons: [
      { label: "Extra seafood mix", price: 10.0 },
      { label: "Pounded yam side", price: 4.0 },
      { label: "Eba side", price: 2.5 },
      { label: "Chapman drink", price: 5.0 },
    ],
  },
  {
    name: "Lamb Yassa",
    category: "mains",
    price: 50,
    chef: "Marcus Osei",
    tags: ["premium", "signature"],
    area: "West Africa",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=280&fit=crop&q=80",
    ingredients: ["Lamb shoulder", "Caramelised onion", "Lemon", "Mustard", "Scotch bonnet", "Garlic", "Long grain rice"],
    addons: [
      { label: "Extra lamb", price: 9.0 },
      { label: "Jollof rice base instead", price: 3.0 },
      { label: "Palmwine mocktail", price: 5.0 },
    ],
  },
  {
    name: "Groundnut Soup & Fufu",
    category: "mains",
    price: 46,
    chef: "Marcus Osei",
    tags: ["signature"],
    area: "Hausa",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=280&fit=crop&q=80",
    ingredients: ["Groundnut paste", "Chicken", "Tomatoes", "Onion", "Scotch bonnet", "Crayfish", "Fufu"],
    addons: [
      { label: "Extra fufu", price: 3.5 },
      { label: "Extra chicken", price: 7.0 },
      { label: "Kunu drink", price: 3.5 },
    ],
  },
  {
    name: "Vegetable Soup & Semovita",
    category: "mains",
    price: 38,
    chef: "Isabelle Fontaine",
    tags: ["vegetarian"],
    area: "Pan-Nigerian",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=280&fit=crop&q=80",
    ingredients: ["Ugwu leaves", "Waterleaf", "Palm oil", "Crayfish", "Seasoning", "Semovita"],
    addons: [
      { label: "Extra semovita", price: 3.0 },
      { label: "Smoked fish addition", price: 5.0 },
      { label: "Zobo drink", price: 4.0 },
    ],
  },

  // ── DESSERTS (14) ──────────────────────────────────────────

  {
    name: "Puff Puff Royale",
    category: "desserts",
    price: 14,
    chef: "Yuki Tanaka",
    tags: ["signature", "vegetarian"],
    area: "Pan-Nigerian",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=280&fit=crop&q=80",
    ingredients: ["Flour", "Yeast", "Nutmeg", "Vanilla", "Sugar", "Dark chocolate"],
    addons: [
      { label: "Extra chocolate dip", price: 2.0 },
      { label: "Caramel drizzle", price: 1.5 },
      { label: "Kunu drink pairing", price: 3.5 },
    ],
  },
  {
    name: "Chin Chin Crumble",
    category: "desserts",
    price: 16,
    chef: "Yuki Tanaka",
    tags: ["vegetarian"],
    area: "Pan-Nigerian",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=280&fit=crop&q=80",
    ingredients: ["Flour", "Coconut", "Pineapple", "Lime", "Sugar", "Butter", "Egg"],
    addons: [
      { label: "Extra coconut cream", price: 2.0 },
      { label: "Ice cream scoop", price: 3.5 },
      { label: "Zobo drink pairing", price: 4.0 },
    ],
  },
  {
    name: "Zobo Sorbet",
    category: "desserts",
    price: 18,
    chef: "Yuki Tanaka",
    tags: ["signature", "vegetarian", "seasonal"],
    area: "Northern Nigeria",
    image: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&h=280&fit=crop&q=80",
    ingredients: ["Dried hibiscus", "Cloves", "Ginger", "Pineapple", "Sugar", "Lime juice"],
    addons: [
      { label: "Extra sorbet scoop", price: 4.0 },
      { label: "Candied ginger topping", price: 2.0 },
      { label: "Mint garnish", price: 1.0 },
    ],
  },
  {
    name: "Coconut Candy Tart",
    category: "desserts",
    price: 15,
    chef: "Yuki Tanaka",
    tags: ["signature", "vegetarian"],
    area: "Lagos",
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=280&fit=crop&q=80",
    ingredients: ["Coconut", "Palm sugar", "Butter", "Flour", "Eggs", "Vanilla", "Cream"],
    addons: [
      { label: "Vanilla ice cream", price: 3.5 },
      { label: "Extra palm sugar drizzle", price: 1.5 },
      { label: "Zobo drink pairing", price: 4.0 },
    ],
  },
  {
    name: "Kunu Panna Cotta",
    category: "desserts",
    price: 17,
    chef: "Yuki Tanaka",
    tags: ["vegetarian", "seasonal"],
    area: "Northern Nigeria",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=280&fit=crop&q=80",
    ingredients: ["Cream", "Ginger", "Cloves", "Dates", "Tamarind", "Sugar", "Gelatin"],
    addons: [
      { label: "Extra tamarind caramel", price: 2.0 },
      { label: "Candied date topping", price: 2.5 },
      { label: "Kunu drink pairing", price: 3.5 },
    ],
  },
  {
    name: "Agege Bread Pudding",
    category: "desserts",
    price: 14,
    chef: "Yuki Tanaka",
    tags: ["vegetarian", "signature"],
    area: "Lagos",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=280&fit=crop&q=80",
    ingredients: ["Agege bread", "Eggs", "Coconut milk", "Nutmeg", "Raisins", "Sugar", "Butter"],
    addons: [
      { label: "Vanilla sauce", price: 2.5 },
      { label: "Ice cream scoop", price: 3.5 },
      { label: "Extra raisins", price: 1.5 },
      { label: "Zobo drink pairing", price: 4.0 },
    ],
  },
  {
    name: "Tiger Nut Creme Brulee",
    category: "desserts",
    price: 20,
    chef: "Yuki Tanaka",
    tags: ["signature", "vegetarian", "premium"],
    area: "Pan-Nigerian",
    image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&h=280&fit=crop&q=80",
    ingredients: ["Tiger nuts", "Cream", "Cardamom", "Palm sugar", "Eggs", "Vanilla"],
    addons: [
      { label: "Fresh berry garnish", price: 3.0 },
      { label: "Extra brulee portion", price: 6.0 },
      { label: "Kunu drink pairing", price: 3.5 },
    ],
  },
  {
    name: "Ube & Chocolate Fondant",
    category: "desserts",
    price: 19,
    chef: "Yuki Tanaka",
    tags: ["signature", "vegetarian"],
    area: "Eastern Nigeria",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=280&fit=crop&q=80",
    ingredients: ["Dark chocolate", "African pear", "Palm wine", "Butter", "Eggs", "Flour", "Sugar"],
    addons: [
      { label: "Vanilla ice cream", price: 3.5 },
      { label: "Extra chocolate sauce", price: 2.0 },
      { label: "Zobo drink pairing", price: 4.0 },
    ],
  },
  {
    name: "Plantain Ice Cream",
    category: "desserts",
    price: 16,
    chef: "Yuki Tanaka",
    tags: ["signature", "vegetarian"],
    area: "Pan-Nigerian",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=280&fit=crop&q=80",
    ingredients: ["Ripe plantain", "Cream", "Sugar", "Vanilla", "Coconut milk", "Nutmeg"],
    addons: [
      { label: "Extra scoop", price: 4.0 },
      { label: "Caramel drizzle", price: 2.0 },
      { label: "Zobo drink pairing", price: 4.0 },
    ],
  },
  {
    name: "Tapioca Coconut Pudding",
    category: "desserts",
    price: 15,
    chef: "Yuki Tanaka",
    tags: ["vegetarian", "seasonal"],
    area: "Southern Nigeria",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=280&fit=crop&q=80",
    ingredients: ["Tapioca pearls", "Coconut milk", "Palm sugar", "Ginger", "Lime zest", "Mango"],
    addons: [
      { label: "Mango coulis", price: 2.5 },
      { label: "Extra coconut cream", price: 2.0 },
      { label: "Kunu drink pairing", price: 3.5 },
    ],
  },
  {
    name: "Groundnut Cake Parfait",
    category: "desserts",
    price: 17,
    chef: "Yuki Tanaka",
    tags: ["vegetarian", "signature"],
    area: "Northern Nigeria",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=280&fit=crop&q=80",
    ingredients: ["Kulikuli", "Cream", "Sugar", "Ginger", "Vanilla", "Honey"],
    addons: [
      { label: "Extra kulikuli crumble", price: 2.0 },
      { label: "Honey drizzle", price: 1.5 },
      { label: "Zobo drink pairing", price: 4.0 },
    ],
  },
  {
    name: "Soursop & Lime Cheesecake",
    category: "desserts",
    price: 21,
    chef: "Yuki Tanaka",
    tags: ["premium", "vegetarian", "signature"],
    area: "Lagos",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=280&fit=crop&q=80",
    ingredients: ["Soursop", "Cream cheese", "Lime", "Graham crackers", "Butter", "Sugar", "Eggs"],
    addons: [
      { label: "Extra soursop coulis", price: 3.0 },
      { label: "Candied lime zest", price: 1.5 },
      { label: "Chapman drink pairing", price: 5.0 },
    ],
  },
  {
    name: "Palm Wine Mousse",
    category: "desserts",
    price: 18,
    chef: "Yuki Tanaka",
    tags: ["signature", "vegetarian"],
    area: "Eastern Nigeria",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=280&fit=crop&q=80",
    ingredients: ["Palm wine reduction", "Cream", "Eggs", "Sugar", "Gelatin", "Vanilla"],
    addons: [
      { label: "Dark chocolate shavings", price: 2.0 },
      { label: "Extra mousse portion", price: 5.0 },
      { label: "Palmwine mocktail pairing", price: 5.0 },
    ],
  },
  {
    name: "African Pear Tarte Tatin",
    category: "desserts",
    price: 22,
    chef: "Yuki Tanaka",
    tags: ["premium", "signature", "vegetarian"],
    area: "Eastern Nigeria",
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=280&fit=crop&q=80",
    ingredients: ["African pear (ube)", "Puff pastry", "Palm sugar", "Butter", "Cinnamon", "Star anise"],
    addons: [
      { label: "Clotted cream side", price: 3.0 },
      { label: "Vanilla ice cream", price: 3.5 },
      { label: "Zobo drink pairing", price: 4.0 },
    ],
  },
]);

// ─── API Functions ──────────────────────────────────────────

export const getMenuItems = async (category = 'all') => {
  await delay(500);
  if (category === 'all') return nigerianDishes;
  return nigerianDishes.filter(d => d.category === category);
};

// id is now a slug string e.g. "jollof-rice-royal"
export const getDishById = async (id) => {
  await delay(200);
  return nigerianDishes.find(d => d.id === id) || null;
};

export const searchDishes = async (query) => {
  await delay(300);
  const q = query.toLowerCase();
  return nigerianDishes.filter(
    d =>
      d.name.toLowerCase().includes(q) ||
      d.area.toLowerCase().includes(q) ||
      d.ingredients.some(i => i.toLowerCase().includes(q))
  );
};

export const getChefs = async () => {
  await delay(500);
  return [
    {
      id: 1,
      name: "Isabelle Fontaine",
      title: "Executive Chef",
      specialty: "French-Nigerian Fusion",
      experience: "18 years",
      bio: "Trained at Le Cordon Bleu Paris, Isabelle brings classical French technique to bold Nigerian flavours, creating a cuisine that bridges continents.",
      image: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&h=500&fit=crop&crop=top&q=80",
      rating: 4.9,
      dishes: 48,
      awards: ["Michelin Star 2022", "James Beard Nominee 2023"],
    },
    {
      id: 2,
      name: "Marcus Osei",
      title: "Head Chef",
      specialty: "Modern Nigerian Cuisine",
      experience: "12 years",
      bio: "Marcus grew up in Lagos and trained across West Africa, mastering the deep spice traditions of Nigerian cooking and elevating them for fine dining.",
      image: "https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?w=400&h=500&fit=crop",
      rating: 4.8,
      dishes: 36,
      awards: ["Best New Chef – Food & Wine 2021"],
    },
    {
      id: 3,
      name: "Yuki Tanaka",
      title: "Pastry Chef",
      specialty: "Afro-Japanese Pâtisserie",
      experience: "9 years",
      bio: "Yuki fuses Japanese precision with Nigerian ingredients — zobo, puff puff, chin chin — reimagined as world-class dessert experiences.",
      image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&h=500&fit=crop",
      rating: 4.9,
      dishes: 24,
      awards: ["World's Best Pastry Chef – 2023"],
    },
  ];
};

export const getTestimonials = async () => {
  await delay(400);
  return [
    {
      id: 1,
      name: "Adaeze Okonkwo",
      role: "Wedding Client · Lagos",
      stars: 5,
      text: "Marcus made the most incredible egusi and jollof for our traditional wedding. Every elder said it tasted like home — but elevated to something extraordinary.",
      avatar: "AO",
    },
    {
      id: 2,
      name: "David Chen",
      role: "Corporate Events Manager",
      stars: 5,
      text: "We booked Maison Fontaine for our Lagos office launch. The suya skewers and ofada rice had international guests going back for thirds.",
      avatar: "DC",
    },
    {
      id: 3,
      name: "Emeka Nwosu",
      role: "Private Client · Abuja",
      stars: 5,
      text: "The pepper soup alone was worth every naira. This is Nigerian cuisine treated with the respect and craft it has always deserved.",
      avatar: "EN",
    },
    {
      id: 4,
      name: "Sophia Laurent",
      role: "Food Critic · Le Monde",
      stars: 5,
      text: "Yuki's zobo sorbet is a revelation. Nigeria's hibiscus flower has never been treated with such finesse. A must-experience dessert.",
      avatar: "SL",
    },
  ];
};
export const submitEventBooking = async (data) => {
  // This is now handled directly in EventDetail via Supabase
  // Keeping for backwards compatibility
  await delay(500);
  return { success: true };
};

export const getStats = async () => {
  await delay(300);
  return [
    { label: "Years of Excellence", value: "18+" },
    { label: "Private Events Catered", value: "2,400+" },
    { label: "Awards Won", value: "32" },
    { label: "Satisfied Clients", value: "99%" },
  ];
};

export const submitBooking = async (data) => {
  await delay(1200);
  return { success: true, message: "Booking received! We'll contact you within 24 hours." };
};