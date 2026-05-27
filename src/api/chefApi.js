import axios from 'axios';

const mealDB = axios.create({
  baseURL: 'https://www.themealdb.com/api/json/v1/1',
});

// ─── helpers ───────────────────────────────────────────────

// MealDB returns flat fields like strIngredient1...strIngredient20
// This cleans them into a neat array
const parseIngredients = (meal) => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure?.trim()} ${ingredient.trim()}`.trim());
    }
  }
  return ingredients;
};

// Map MealDB meal object → your app's shape
const formatMeal = (meal) => ({
  id: meal.idMeal,
  name: meal.strMeal,
  category: meal.strCategory?.toLowerCase() || 'mains',
  description: meal.strInstructions?.slice(0, 120) + '...' || '',
  image: meal.strMealThumb,
  area: meal.strArea,           // e.g. "Italian", "French"
  tags: meal.strTags
    ? meal.strTags.split(',').map(t => t.trim().toLowerCase())
    : [],
  ingredients: parseIngredients(meal),
  youtubeUrl: meal.strYoutube || null,
  // We assign chefs from your own data since MealDB has no chef concept
  chef: assignChef(meal.strArea),
  price: generatePrice(meal.strCategory),
});

// Assign one of your chefs based on cuisine origin
const assignChef = (area) => {
  const map = {
    French: 'Isabelle Fontaine',
    Italian: 'Isabelle Fontaine',
    British: 'Isabelle Fontaine',
    Japanese: 'Yuki Tanaka',
    Chinese: 'Yuki Tanaka',
    American: 'Marcus Osei',
    Jamaican: 'Marcus Osei',
    Moroccan: 'Marcus Osei',
    Indian: 'Marcus Osei',
  };
  return map[area] || 'Isabelle Fontaine';
};

// Generate a realistic price based on category
const generatePrice = (category) => {
  const priceMap = {
    Starter:  { min: 18, max: 38 },
    Seafood:  { min: 55, max: 85 },
    Beef:     { min: 65, max: 95 },
    Chicken:  { min: 42, max: 60 },
    Lamb:     { min: 58, max: 78 },
    Pasta:    { min: 32, max: 48 },
    Dessert:  { min: 16, max: 26 },
    Vegan:    { min: 28, max: 44 },
  };
  const range = priceMap[category] || { min: 35, max: 65 };
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
};

// ─── API functions ──────────────────────────────────────────

// Get menu items — maps MealDB categories to yours
export const getMenuItems = async (category = 'all') => {
  try {
    // Map your UI tabs to MealDB category names
    const categoryMap = {
      all:      ['Seafood', 'Beef', 'Chicken', 'Dessert'],
      starters: ['Starter', 'Side'],
      mains:    ['Seafood', 'Beef', 'Chicken', 'Lamb', 'Pasta'],
      desserts: ['Dessert'],
    };

    const categoriesToFetch = categoryMap[category] || categoryMap.all;

    // Fetch from multiple categories in parallel
    const responses = await Promise.all(
      categoriesToFetch.map(cat =>
        mealDB.get(`/filter.php?c=${cat}`).then(r => r.data.meals || [])
      )
    );

    // Flatten, deduplicate, limit to 12
    const allMeals = responses.flat();
    const unique = Array.from(new Map(allMeals.map(m => [m.idMeal, m])).values());
    const limited = unique.slice(0, 12);

    // filter.php only returns id + name + thumbnail
    // Fetch full details for each meal in parallel
    const detailed = await Promise.all(
      limited.map(meal =>
        mealDB.get(`/lookup.php?i=${meal.idMeal}`)
          .then(r => formatMeal(r.data.meals[0]))
      )
    );

    return detailed;
  } catch (error) {
    console.error('getMenuItems error:', error);
    return [];
  }
};

// Search meals by name — useful for a search bar later
export const searchMeals = async (query) => {
  try {
    const { data } = await mealDB.get(`/search.php?s=${query}`);
    return (data.meals || []).map(formatMeal);
  } catch (error) {
    console.error('searchMeals error:', error);
    return [];
  }
};

// Get a single meal by ID — useful for a detail/modal page
export const getMealById = async (id) => {
  try {
    const { data } = await mealDB.get(`/lookup.php?i=${id}`);
    return data.meals ? formatMeal(data.meals[0]) : null;
  } catch (error) {
    console.error('getMealById error:', error);
    return null;
  }
};

// Get all available categories from MealDB
export const getMealCategories = async () => {
  try {
    const { data } = await mealDB.get('/categories.php');
    return data.categories || [];
  } catch (error) {
    console.error('getMealCategories error:', error);
    return [];
  }
};

// ─── Keep your existing mock functions below ────────────────
// (chefs, stats, testimonials, booking are still your own data
//  since MealDB has no concept of chefs, reviews, or bookings)

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const getChefs = async () => {
  await delay(500);
  return [
    {
      id: 1, name: "Isabelle Fontaine", title: "Executive Chef",
      specialty: "French Contemporary", experience: "18 years",
      bio: "Trained at Le Cordon Bleu Paris, Isabelle brings a lifetime of culinary mastery to every plate.",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=500&fit=crop",
      rating: 4.9, dishes: 48, awards: ["Michelin Star 2022", "James Beard Nominee 2023"],
    },
    {
      id: 2, name: "Marcus Osei", title: "Head Chef",
      specialty: "Modern African Fusion", experience: "12 years",
      bio: "Marcus weaves the bold flavors of West Africa with Japanese precision techniques.",
      image: "https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?w=400&h=500&fit=crop",
      rating: 4.8, dishes: 36, awards: ["Best New Chef – Food & Wine 2021"],
    },
    {
      id: 3, name: "Yuki Tanaka", title: "Pastry Chef",
      specialty: "Japanese Pâtisserie", experience: "9 years",
      bio: "Yuki transforms dessert into poetry. Her delicate pastries marry Tokyo's precision with Parisian sensibility.",
      image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&h=500&fit=crop",
      rating: 4.9, dishes: 24, awards: ["World's Best Pastry Chef – 2023"],
    },
  ];
};

export const getTestimonials = async () => {
  await delay(400);
  return [
    { id: 1, name: "Sarah Whitmore", role: "Wedding Client", stars: 5, text: "Every single guest told me the food was the best they'd ever had at a wedding.", avatar: "SW" },
    { id: 2, name: "David Chen", role: "Corporate Events Manager", stars: 5, text: "We've booked them for 3 corporate dinners now. The presentation alone closes deals.", avatar: "DC" },
    { id: 3, name: "Amara Nkosi", role: "Private Client", stars: 5, text: "Marcus cooked a birthday dinner for 12 that felt like dining at a three-Michelin-star restaurant.", avatar: "AN" },
    { id: 4, name: "Olivier Dupont", role: "Food Critic, Le Monde", stars: 5, text: "Yuki's desserts deserve their own tasting menu. Her matcha opera cake is among the finest.", avatar: "OD" },
  ];
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