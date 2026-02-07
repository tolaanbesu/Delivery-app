export const userData = [
  {
    id: 1,
    name: "Tola Anbesu",
    email: "tola@example.com",
    password: "password123",
    phone: "+251 911 000 000",
    avatar: "https://i.pravatar.cc/150?u=alex",
    memberSince: "August 2024",
    stats: { 
      orders: 42, 
      credits: 12.50, 
      points: 1240 
    },
    menuinfo: {
      history: "42 completed orders",
      addressSummary: "Home, Office",
      paymentSummary: "Visa **** 4242",
      rewards: "1,240 points"
    }
  }
];

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
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800",
    Address: "mexico, Addis Ababa",
    lat: 9.0105,
    lng: 38.7469
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
    img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800",
    Address: "kolfe, Addis Ababa",
    lat: 9.0326,
    lng: 38.6936
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
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800",
    Address: "piassa, Addis Ababa",
    lat: 9.0339,
    lng: 38.7496
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
    img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800",
    Address: "bole, Addis Ababa",
    lat: 8.9973,
    lng: 38.787
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
    img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800",
    Address: "4 kilo, Addis Ababa",
    lat: 9.0373,
    lng: 38.7615
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
    img: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800",
    Address: "6 kilo, Addis Ababa",
    lat: 9.0468,
    lng: 38.7606
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
    img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800",
    Address: "lafto, Addis Ababa",
    lat: 8.9706,
    lng: 38.7087
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
    img: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?q=80&w=800",
    Address: "kirkos, Addis Ababa",
    lat: 9.0056,
    lng: 38.7616
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
    img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800",
    Address: "Megenanga, Addis Ababa",
    lat: 9.0434,
    lng: 38.8490
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
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000",
    Address: "Abinet, Addis Ababa",
    lat: 9.0021,
    lng: 38.7156
  }
];
