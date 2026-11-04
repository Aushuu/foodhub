// Initial seedable food items with high quality Unsplash photos
export const INITIAL_FOODS = [
  {
    name: "Classic Smash Cheeseburger",
    description: "Double smashed Angus beef patties, melted cheddar, crisp lettuce, vine tomatoes, pickles, and signature house sauce on a toasted brioche bun.",
    price: 12.99,
    category: "Burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    isVegetarian: false,
    isAvailable: true,
    rating: 4.9,
    prepTime: "15-20 min"
  },
  {
    name: "Wood-Fired Margherita Pizza",
    description: "San Marzano tomato sauce, fresh buffalo mozzarella, aromatic fresh basil leaves, extra virgin olive oil on hand-stretched dough.",
    price: 14.50,
    category: "Pizza",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
    isVegetarian: true,
    isAvailable: true,
    rating: 4.8,
    prepTime: "20-25 min"
  },
  {
    name: "Crispy Truffle Fries",
    description: "Hand-cut golden russet fries tossed in white truffle oil, grated aged parmesan, cracked black pepper, and fresh rosemary with garlic aioli.",
    price: 7.99,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    isVegetarian: true,
    isAvailable: true,
    rating: 4.7,
    prepTime: "10-15 min"
  },
  {
    name: "Spicy Tokyo Tonkotsu Ramen",
    description: "Rich 12-hour pork broth, springy artisan noodles, tender chashu pork belly, ajitsuke tamago egg, nori, bamboo shoots, and rayu chili oil.",
    price: 15.99,
    category: "Asian",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    isVegetarian: false,
    isAvailable: true,
    rating: 4.9,
    prepTime: "15-20 min"
  },
  {
    name: "Creamy Fettuccine Alfredo",
    description: "Al dente fettuccine pasta tossed in silky rich butter, double heavy cream, garlic, and 24-month Parmigiano-Reggiano with fresh parsley.",
    price: 13.99,
    category: "Pasta",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80",
    isVegetarian: true,
    isAvailable: true,
    rating: 4.6,
    prepTime: "15-20 min"
  },
  {
    name: "Avocado & Quinoa Power Bowl",
    description: "Tri-color quinoa, ripe Hass avocado, roasted sweet potato cubes, baby spinach, cherry tomatoes, and tahini-lemon dressing.",
    price: 11.99,
    category: "Bowls",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    isVegetarian: true,
    isAvailable: true,
    rating: 4.8,
    prepTime: "10-15 min"
  },
  {
    name: "Golden Crispy Buffalo Wings",
    description: "Jumbo chicken wings fried crisp, glazed in zesty cayenne buffalo sauce, served with celery sticks and cool buttermilk blue cheese dip.",
    price: 13.49,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80",
    isVegetarian: false,
    isAvailable: true,
    rating: 4.9,
    prepTime: "15-20 min"
  },
  {
    name: "Belgian Molten Chocolate Lava Cake",
    description: "Warm individual dark chocolate cake with a molten center of decadent Valrhona chocolate, dusted with powdered sugar and vanilla bean ice cream.",
    price: 8.50,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    isVegetarian: true,
    isAvailable: true,
    rating: 4.9,
    prepTime: "10 min"
  },
  {
    name: "Fresh Strawberry Basil Lemonade",
    description: "Muddled sweet California strawberries, freshly squeezed Meyer lemons, crushed ice, pure cane syrup, and aromatic Thai basil leaves.",
    price: 4.99,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    isVegetarian: true,
    isAvailable: true,
    rating: 4.7,
    prepTime: "5 min"
  }
];

export const CATEGORIES = [
  { id: "all", name: "All Dishes", icon: "🍽️" },
  { id: "Burgers", name: "Burgers", icon: "🍔" },
  { id: "Pizza", name: "Pizza", icon: "🍕" },
  { id: "Pasta", name: "Pasta", icon: "🍝" },
  { id: "Asian", name: "Asian", icon: "🍜" },
  { id: "Bowls", name: "Bowls", icon: "🥗" },
  { id: "Sides", name: "Sides", icon: "🍟" },
  { id: "Desserts", name: "Desserts", icon: "🍰" },
  { id: "Beverages", name: "Drinks", icon: "🥤" },
];

