export const userData = [
  {
    id: 1,
    name: "Tola Anbesu",
    email: "tola@example.com",
    phone: "+251 911 000 000",
    avatar: "https://i.pravatar.cc/150?u=tola",
    memberSince: "August 2024",
    stats: { orders: 42, credits: 12.50, points: 1240 },
    menuinfo: { history: "42 orders", addressSummary: "Home, Office", paymentSummary: "Visa **** 4242" }
  },
  {
    id: 2,
    name: "Sara Gebre",
    email: "sara.g@example.com",
    phone: "+251 922 111 222",
    avatar: "https://i.pravatar.cc/150?u=sara",
    memberSince: "January 2025",
    stats: { orders: 12, credits: 5.00, points: 450 },
    menuinfo: { history: "12 orders", addressSummary: "Apartment 4B", paymentSummary: "MasterCard **** 8821" }
  },
  {
    id: 3,
    name: "Dawit Isaac",
    email: "dawit@example.com",
    phone: "+251 944 333 444",
    avatar: "https://i.pravatar.cc/150?u=dawit",
    memberSince: "March 2024",
    stats: { orders: 85, credits: 0.00, points: 3100 },
    menuinfo: { history: "85 orders", addressSummary: "Bole Road", paymentSummary: "Telebirr" }
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

// Centralized order history model (seed empty; actual runtime storage uses localStorage 'orders')
// Each order shape mirrors Checkout's newOrder and includes owner for auditing/multi-user scenarios.
export const orders = [
  // Example structure:
  // {
  //   id: 'uuid',
  //   restaurantName: 'The Burger Project',
  //   owner: { id: 1, name: 'Tola Anbesu', email: 'tola@example.com' },
  //   user: { ...fullUserAtOrderTime },
  //   deliveryPosition: { lat: 9.03, lng: 38.74 },
  //   grandTotal: 42.50,
  //   itemsCount: 3,
  //   status: 'active' | 'completed' | 'canceled',
  //   createdAt: 'ISO'
  // }
];

export const menuStructure = [
  {
    id: 'cat1',
    name: 'Appetizers',
    count: 2,
    status: 'Active',
    items: [
      { id: 'i1', name: 'Truffle Fries', price: 8.50, description: 'Vegan, Gluten-Free', img: 'https://images.unsplash.com/photo-1573082801974-af29627374f0?w=120', active: true },
      { id: 'i2', name: 'Buffalo Wings', price: 12.00, description: '12 pcs, Spicy', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=120', active: false },
    ]
  },
  { 
    id: 'cat2', 
    name: 'Main Courses', 
    count: 2, 
    status: 'Active', 
    items: [
      { id: 'i3', name: 'Classic Cheeseburger', price: 15.50, description: 'Angus beef, cheddar', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120', active: true },
      { id: 'i4', name: 'Veggie Burger', price: 14.00, description: 'Quinoa patty, avocado', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=120', active: true },
    ] 
  },
  { 
    id: 'cat3', 
    name: 'Desserts', 
    count: 1, 
    status: 'Draft', 
    items: [
      { id: 'i5', name: 'Chocolate Lava Cake', price: 9.00, description: 'Warm dark chocolate', img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=120', active: true },
    ] 
  }
];

export const adminDashboardData = {
  // Stats organized by time period
  periodStats: {
    Today: {
      totalRevenue: "$5,210.50",
      revenueGrowth: "+2.1%",
      activeOrders: "24",
      activeOrdersGrowth: "+1.2%",
      newUsers: "5",
      newUsersGrowth: "+0.5%",
      trendsTotal: "$1,850.00",
      trendsGrowth: "+4%"
    },
    Week: {
      totalRevenue: "$42,850.20",
      revenueGrowth: "+12.5%",
      activeOrders: "142",
      activeOrdersGrowth: "+5.2%",
      newUsers: "38",
      newUsersGrowth: "+8.1%",
      trendsTotal: "$12,450.00",
      trendsGrowth: "+12%"
    },
    Month: {
      totalRevenue: "$182,400.00",
      revenueGrowth: "+18.2%",
      activeOrders: "612",
      activeOrdersGrowth: "+10.5%",
      newUsers: "145",
      newUsersGrowth: "+15.3%",
      trendsTotal: "$45,200.00",
      trendsGrowth: "+14%"
    },
    Year: {
      totalRevenue: "$2.1M",
      revenueGrowth: "+25.0%",
      activeOrders: "8,420",
      activeOrdersGrowth: "+22.1%",
      newUsers: "1,240",
      newUsersGrowth: "+30.5%",
      trendsTotal: "$450,000.00",
      trendsGrowth: "+20%"
    }
  },
  
  charts: {
    Today: [
      { name: '08:00', value: 10 }, { name: '10:00', value: 25 }, { name: '12:00', value: 45 },
      { name: '14:00', value: 30 }, { name: '16:00', value: 55 }, { name: '18:00', value: 20 },
    ],
    Week: [
      { name: 'MON', value: 30 }, { name: 'TUE', value: 55 }, { name: 'WED', value: 35 },
      { name: 'THU', value: 45 }, { name: 'FRI', value: 15 }, { name: 'SAT', value: 65 }, { name: 'SUN', value: 50 },
    ],
    Month: [
      { name: 'WK 1', value: 120 }, { name: 'WK 2', value: 210 }, { name: 'WK 3', value: 180 }, { name: 'WK 4', value: 250 },
    ],
    Year: [
      { name: 'JAN', value: 400 }, { name: 'MAR', value: 700 }, { name: 'JUN', value: 500 },
      { name: 'SEP', value: 900 }, { name: 'DEC', value: 1200 },
    ]
  },

  recentOrders: [
    // NEW QUEUE (PAID)
    { id: '#8492', name: 'Burger King • NYC', price: '$24.50', time: '2 mins ago', status: 'PAID', icon: '🍔' },
    { id: '#8491', name: "Joe's Pizza • Brooklyn", price: '$42.00', time: '15 mins ago', status: 'PAID', icon: '🍕' },
    { id: '#8494', name: 'Sakura Zen • Bole', price: '$68.00', time: '1 min ago', status: 'PAID', icon: '🍣' },
    { id: '#8495', name: 'Bella Napoli', price: '$35.20', time: '8 mins ago', status: 'PAID', icon: '🍕' },
    
    // PREP QUEUE (PENDING)
    { id: '#8490', name: 'Miso Ramen House', price: '$18.25', time: '45 mins ago', status: 'PENDING', icon: '🍜' },
    { id: '#8486', name: 'KFC • Bronx', price: '$31.20', time: '5 hours ago', status: 'PENDING', icon: '🍗' },
    { id: '#8496', name: 'Thai Terrace', price: '$22.00', time: '12 mins ago', status: 'PENDING', icon: '🍜' },
    { id: '#8497', name: 'Sweet Treats Co.', price: '$14.50', time: '20 mins ago', status: 'PENDING', icon: '🍩' },
    
    // OUT FOR DELIVERY (Simulated by adding more PAID items we can move)
    { id: '#8489', name: 'Taco Bell • Queens', price: '$12.00', time: '1 hour ago', status: 'PAID', icon: '🌮' },
    { id: '#8488', name: 'Sushi Zen', price: '$55.00', time: '2 hours ago', status: 'PAID', icon: '🍣' },
    
    // DONE / COMPLETED
    { id: '#8487', name: 'Starbucks • Jersey', price: '$8.50', time: '3 hours ago', status: 'PAID', icon: '☕' },
    { id: '#8485', name: 'Gelato Galaxy', price: '$19.00', time: '6 hours ago', status: 'PAID', icon: '🍦' },
    { id: '#8484', name: 'Vegan Stack', price: '$27.40', time: 'Yesterday', status: 'PAID', icon: '🥗' },
    { id: '#8483', name: 'Tokyo Drift', price: '$92.00', time: 'Yesterday', status: 'PAID', icon: '🍱' },
    { id: '#8482', name: 'The Burger Project', price: '$15.00', time: 'Yesterday', status: 'PAID', icon: '🍔' }
  ],

  notifications: [
    { id: 1, title: 'New Order', message: 'Order #8493 received from Burger King', time: 'Just now', type: 'order' },
    { id: 2, title: 'Revenue Milestone', message: 'You reached your daily goal!', time: '2h ago', type: 'goal' },
    { id: 3, title: 'System Update', message: 'Dashboard version 2.4 is now live', time: '5h ago', type: 'info' },
  ],

  adminProfile: {
    name: "Alex Rivera",
    role: "Senior Administrator",
    email: "alex.admin@restaurant.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    stats: {
      managed: 24,
      joined: "Jan 2024"
    }
  }

};
