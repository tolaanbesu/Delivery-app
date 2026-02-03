import React, { useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiSearch, FiPlus, FiMinus, FiShoppingBag, FiX } from 'react-icons/fi';
import { allRestaurants } from '../../utils/data';
import CartOverlay from '../../components/CartOverLay';

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = allRestaurants.find(r => r.id === parseInt(id)) || allRestaurants[0];

  const [activeTab, setActiveTab] = useState('Mains');
  const [cart, setCart] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const menuItems = [
    { id: 101, category: 'Appetizers', name: "Truffle Fries", price: 12.00, desc: "Hand-cut fries tossed in white truffle oil, rosemary, and aged parmesan.", img: "https://images.unsplash.com/photo-1573082801974-af29627374f0?auto=format&fit=crop&w=400&q=80" },
    { id: 102, category: 'Appetizers', name: "Spicy Calamari", price: 15.00, desc: "Flash-fried squid with cherry peppers and a zesty lemon garlic aioli.", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400&q=80" },
    { id: 201, category: 'Mains', name: "Signature Wagyu Burger", price: 24.00, desc: "8oz Wagyu beef, truffle brie, caramelized onions, and brioche bun.", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80" },
    { id: 202, category: 'Mains', name: "Honey Glazed Salmon", price: 28.00, desc: "Atlantic salmon, honey soy glaze, roasted asparagus, and wild rice.", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80" },
    { id: 301, category: 'Drinks', name: "Classic Mojito", price: 14.00, desc: "Fresh mint, lime juice, white rum, and soda water.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80" },
  ];

  const updateQuantity = (itemId, delta) => {
    setCart(prev => {
      const currentQty = prev[itemId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      if (newQty === 0) {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newQty };
    });
  };

  const cartItemsData = menuItems.filter(item => cart[item.id]);
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = cartItemsData.reduce((acc, item) => acc + (item.price * cart[item.id]), 0);

  const categories = ['Appetizers', 'Mains', 'Drinks', 'Desserts'];

  return (
    <div className="bg-[#1A120B] min-h-screen text-[#E5E5E5] font-sans no-scrollbar relative overflow-x-hidden">
      
      {/* 1. Header */}
      <header className="px-6 py-6 flex justify-between items-center sticky top-0 bg-[#1A120B] z-40">
        {!showSearch ? (
          <>
            <button onClick={() => navigate(-1)} className="text-2xl hover:text-white transition-all"><FiChevronLeft /></button>
            <div className="text-center">
              <h1 className="font-bold text-lg text-white">{restaurant.name}</h1>
              <p className="text-[11px] text-[#A1917B]">{restaurant.time} • {restaurant.rating} ★</p>
            </div>
            <button onClick={() => setShowSearch(true)} className="text-2xl"><FiSearch /></button>
          </>
        ) : (
          <div className="flex items-center w-full gap-4 bg-[#2D241C] p-2 rounded-xl">
            <FiSearch className="text-[#8B7E6F] ml-2" />
            <input 
              autoFocus
              className="bg-transparent flex-1 outline-none text-sm" 
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => {setShowSearch(false); setSearchTerm('')}}><FiX className="text-xl" /></button>
          </div>
        )}
      </header>

      {/* 2. Tabs */}
      <nav className="flex gap-2 px-6 pb-2 overflow-x-auto no-scrollbar border-b border-[#2D241C]">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setActiveTab(cat)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeTab === cat ? 'bg-[#F57C1F] text-white' : 'text-[#8B7E6F]'
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* 3. Menu Content */}
      <main className="p-6 space-y-10  max-w-2xl mx-auto">
        {categories.filter(cat => activeTab === cat || searchTerm !== '').map((catSection) => {
          const itemsInSection = menuItems.filter(item => 
            item.category === catSection && 
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (itemsInSection.length === 0) return null;

          return (
            <div key={catSection}>
              <h2 className="text-2xl font-bold mb-8 text-white">{catSection}</h2>
              <div className="space-y-12">
                {itemsInSection.map((item) => (
                  <div key={item.id} className="flex gap-6 items-start">
                    <img src={item.img} className="w-24 h-24 rounded-2xl object-cover shadow-lg" alt={item.name} />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-white leading-tight">{item.name}</h4>
                      <p className="text-[#F57C1F] font-bold mb-1 text-lg">${item.price.toFixed(2)}</p>
                      <p className="text-[12px] text-[#8B7E6F] leading-snug mb-4">{item.desc}</p>
                      <div className="flex justify-end">
                        {cart[item.id] ? (
                          <div className="flex items-center gap-6 bg-[#F57C1F] rounded-xl px-4 py-2 shadow-lg">
                            <button onClick={() => updateQuantity(item.id, -1)} className="text-white"><FiMinus /></button>
                            <span className="font-bold text-sm text-white">{cart[item.id]}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="text-white"><FiPlus /></button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="bg-[#2D241C] text-[#E5E5E5] px-8 py-2 rounded-xl text-sm font-bold active:scale-95 transition-all shadow-md"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* 4. IN-PAGE VIEW CART BUTTON (At the bottom of main content) */}
        {totalItems > 0 && (
          <div className="pt-10 border-t border-white/5 animate-in fade-in duration-500">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-[#F57C1F] h-14 px-6 rounded-2xl flex justify-between items-center shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="bg-white/20 text-white min-w-[24px] px-1 h-6 flex items-center justify-center rounded-lg text-xs font-black">
                  {totalItems}
                </span>
                <span className="font-black text-white text-sm uppercase tracking-widest">
                  View Cart
                </span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="font-black text-lg">
                  ${totalPrice.toFixed(2)}
                </span>
                <FiShoppingBag className="text-xl" />
              </div>
            </button>
          </div>
        )}
      </main>

      {/* 5. Cart Overlay */}
      {isCartOpen && (
        <CartOverlay 
          cartItemsData={cartItemsData}
          restaurant={restaurant}
          cart={cart}
          updateQuantity={updateQuantity}
          setIsCartOpen={setIsCartOpen}
          totalPrice={totalPrice}
          navigate={navigate}
        />
      )}
    </div>
  );
};

export default RestaurantMenu;