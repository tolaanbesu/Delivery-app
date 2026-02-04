export const userData = {
  name: "Tola Anbesu",
  email: "tola@example.com",
  password: "password123",
  phone: "+251 911 000 000",
  avatar: "https://i.pravatar.cc/150?u=alex",
  memberSince: "August 2024",
  stats: {
    orders: 42,
    credits: "$12.50",
    points: "1,240"
  },
  menuinfo: {
    history: "42 completed orders",
    addressSummary: "Home, Office",
    paymentSummary: "Visa **** 4242",
    rewards: "1,240 points"
  },
  addresses: [
    { id: 1, label: "Home", detail: "Maple Street, House 42, Addis Ababa", icon: "🏠" },
    { id: 2, label: "Office", detail: "Culinary Drive, Suite 400, Addis Ababa", icon: "💼" }
  ],
  recentOrders: [
    { id: "ORD-9921", restaurant: "The Burger Project", status: "Delivered", total: "$24.00", date: "Yesterday" },
    { id: "ORD-9845", restaurant: "Sakura Zen", status: "Delivered", total: "$45.50", date: "3 days ago" }
  ]
};

export const adminData = {
  email: "admin@unified.com",
  password: "adminpassword",
};

// --- DELIVERY & LOGISTICS DATA ---
export const driverData = {
  id: "d1",
  name: "Alex Johnson",
  phone: "+251 922 888 777",
  avatar: "https://i.pravatar.cc/150?u=driver",
  vehicle: "Toyota Prius",
  plate: "AA 7KRM392",
  distance: "2.4 miles",
  rating: 4.9,
  currentLocation: { lat: 9.035, lng: 38.752 }
};

// --- SUPPORT & COMPANY DATA ---
export const officeData = {
  name: "Unified Food HQ",
  address: "123 Culinary Drive, Suite 400, Addis Ababa, Ethiopia",
  phone: "+251 911 000 000",
  email: "support@unifiedfood.com",
  coordinates: { lat: 9.03, lng: 38.74 }
};

export const categories = [
  { name: 'Pizza', icon: '🍕' },
  { name: 'Burgers', icon: '🍔' },
  { name: 'Sushi', icon: '🍣' },
  { name: 'Asian', icon: '🍜' },
  { name: 'Desserts', icon: '🍩' }
];

export const allRestaurants = [
  // --- Featured / High Priority (Matching your image) ---
  { 
    id: 1, 
    category: 'Burgers', 
    name: "The Burger Project", 
    type: "American • Burger", 
    rating: 4.8, 
    time: "15-25 min", 
    priceRange: "$$", 
    deliveryFee: "Free Delivery", 
    isFeatured: true,
    promo: "FREE DELIVERY", 
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800" 
  },
  { 
    id: 2, 
    category: 'Sushi', 
    name: "Sakura Zen", 
    type: "Japanese • Sushi", 
    rating: 4.9, 
    time: "20-30 min", 
    priceRange: "$$$", 
    deliveryFee: "$2.99 Delivery", 
    isFeatured: true,
    promo: "TOP RATED", 
    img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800" 
  },

  // --- Pizza Items ---
  { 
    id: 3, 
    category: 'Pizza', 
    name: "Bella Napoli", 
    type: "Italian • Pizza", 
    rating: 4.7, 
    time: "15-25 min", 
    priceRange: "$$", 
    deliveryFee: "$1.99 Delivery", 
    isFeatured: false,
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800" 
  },
  { 
    id: 4, 
    category: 'Pizza', 
    name: "Mamma's Kitchen", 
    type: "Italian • Pasta • Pizza", 
    rating: 4.9, 
    time: "25-35 min", 
    priceRange: "$$", 
    deliveryFee: "Free Delivery", 
    isFeatured: false,
    img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800" 
  },

  // --- Asian / Thai Items ---
  { 
    id: 5, 
    category: 'Asian', 
    name: "Thai Terrace", 
    type: "Thai • Asian", 
    rating: 4.5, 
    time: "25-35 min", 
    priceRange: "$$", 
    deliveryFee: "Free Delivery", 
    isFeatured: false,
    img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800" 
  },
  { 
    id: 6, 
    category: 'Asian', 
    name: "Tokyo Drift", 
    type: "Japanese • Sashimi", 
    rating: 4.9, 
    time: "30-40 min", 
    priceRange: "$$$", 
    deliveryFee: "Free Delivery", 
    isFeatured: false,
    img: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800" 
  },

  // --- Dessert Items ---
  { 
    id: 7, 
    category: 'Desserts', 
    name: "Sweet Treats Co.", 
    type: "Bakery • Desserts", 
    rating: 4.2, 
    time: "10-15 min", 
    priceRange: "$", 
    deliveryFee: "$0.99 Delivery", 
    isFeatured: false,
    img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800" 
  },
  { 
    id: 8, 
    category: 'Desserts', 
    name: "Gelato Galaxy", 
    type: "Ice Cream • Italian", 
    rating: 4.8, 
    time: "5-10 min", 
    priceRange: "$", 
    deliveryFee: "$1.50 Delivery", 
    isFeatured: false,
    img: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?q=80&w=800" 
  },

  // --- More Burgers ---
  { 
    id: 9, 
    category: 'Burgers', 
    name: "Smash Town", 
    type: "Crispy • Smashed • Shakes", 
    rating: 4.8, 
    time: "10-20 min", 
    priceRange: "$$", 
    deliveryFee: "Free Delivery", 
    isFeatured: false,
    img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800" 
  },
  { 
    id: 10, 
    category: 'Burgers', 
    name: "Vegan Stack", 
    type: "Healthy • Plant-based", 
    rating: 4.5, 
    time: "20-25 min", 
    priceRange: "$$", 
    deliveryFee: "Free Delivery", 
    isFeatured: false,
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000" 
  }
];
// export const categories = [
//   { name: 'Pizza', icon: '🍕' },
//   { name: 'Burgers', icon: '🍔' },
//   { name: 'Sushi', icon: '🍣' }
// ];

// export const allRestaurants = [
//   // --- Pizza Items ---
//   { id: 1, category: 'Pizza', name: "The Golden Grill", type: "Italian • Pizza • Gourmet", rating: 4.8, time: "20-30 MIN", delivery: "Free delivery", promo: "Over $20", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80" },
//   { id: 3, category: 'Pizza', name: "Mamma's Kitchen", type: "Italian • Pasta • Pizza", rating: 4.9, time: "25-35 MIN", delivery: "Free delivery", promo: "Top Rated", img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80" },
//   { id: 7, category: 'Pizza', name: "Pepperoni Palace", type: "Classic NY • Spicy • Family Size", rating: 4.6, time: "15-25 MIN", delivery: "$0.99 Delivery", promo: "Buy 1 Get 1", img: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80" },
//   { id: 8, category: 'Pizza', name: "Truffle Theory", type: "Modern • Truffle • Artisan", rating: 4.7, time: "30-40 MIN", delivery: "Free delivery", promo: "Free Drink", img: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80" },
  
//   // --- Burger Items ---
//   { id: 4, category: 'Burgers', name: "Big Bang Burgers", type: "American • Angus • Fries", rating: 4.7, time: "15-20 MIN", delivery: "$1.99 Delivery", promo: "New", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" },
//   { id: 5, category: 'Burgers', name: "Vegan Stack", type: "Healthy • Plant-based", rating: 4.5, time: "20-25 MIN", delivery: "Free delivery", promo: "Eco-friendly", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80" },
//   { id: 9, category: 'Burgers', name: "Smash Town", type: "Crispy • Smashed • Shakes", rating: 4.8, time: "10-20 MIN", delivery: "Free delivery", promo: "Student Deal", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80" },
//   { id: 10, category: 'Burgers', name: "The BBQ Pit", type: "Smoked • Pulled Pork • Sliders", rating: 4.4, time: "25-35 MIN", delivery: "$2.99 Delivery", promo: "Special Sauce", img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80" },
  
//   // --- Sushi Items ---
//   { id: 2, category: 'Sushi', name: "Sakura Zen", type: "Japanese • Sushi • Healthy", rating: 4.5, time: "15-25 MIN", delivery: "$1.99 Delivery", promo: "0.8 miles away", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80" },
//   { id: 6, category: 'Sushi', name: "Tokyo Drift", type: "Japanese • Sashimi", rating: 4.9, time: "30-40 MIN", delivery: "Free delivery", promo: "Top Rated", img: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80" },
//   { id: 11, category: 'Sushi', name: "Umami Rolls", type: "Fusion • Spicy Tuna • Miso", rating: 4.6, time: "20-30 MIN", delivery: "Free delivery", promo: "Lunch Box", img: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&w=800&q=80" },
//   { id: 12, category: 'Sushi', name: "Dragon Bento", type: "Nigiri • Tempura • Bento", rating: 4.3, time: "25-35 MIN", delivery: "$1.50 Delivery", promo: "New Roll", img: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=800&q=80" },
// ];