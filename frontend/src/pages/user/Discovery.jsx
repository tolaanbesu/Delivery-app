import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFilter, FiHeart, FiStar, FiClock, FiSearch, FiChevronDown, FiMapPin, FiUser, FiMap, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { allRestaurants, categories } from '../../utils/data';

const Discovery = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [likedRestaurants, setLikedRestaurants] = useState({});
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const toggleLike = (e, id) => {
    e.stopPropagation();
    setLikedRestaurants(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleRestaurantClick = (restaurant) => {
    console.log("Navigating to:", restaurant.name);
  };

  // 1. Filtering Logic
  const filteredRestaurants = useMemo(() => {
    // Reset to page 1 whenever filter/search changes
    setCurrentPage(1); 
    return allRestaurants.filter(rest => {
      const matchesSearch = rest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            rest.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeCategory === 'All' || rest.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeCategory]);

  // 2. Pagination Calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRestaurants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

  const featuredStores = allRestaurants.filter(r => r.isFeatured);

  return (
    <div className="max-w-md mx-auto bg-[#1C160E] min-h-screen text-[#EDE8E2] font-sans overflow-x-hidden">
      
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F57C1F]/10 rounded-2xl flex items-center justify-center">
            <FiMapPin className="text-[#F57C1F] text-xl" />
          </div>
          <div>
            <p className="text-[10px] text-[#8B7E6F] font-bold uppercase tracking-widest leading-none mb-1">Delivery To</p>
            <div className="flex items-center gap-1 cursor-pointer active:opacity-60 transition-opacity">
              <span className="font-bold text-sm">Home, Maple Street</span>
              <FiChevronDown className="text-[#F57C1F]" />
            </div>
          </div>
        </div>
        {/* <div 
          onClick={() => navigate('/profile')}
          className="w-12 h-12 rounded-2xl bg-[#2A1E14] border border-white/5 p-1 cursor-pointer active:scale-90 transition-transform"
        >
          <img src="https://i.pravatar.cc/150?u=user" className="w-full h-full rounded-xl object-cover" alt="profile" />
        </div> */}
      </header>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="relative group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7E6F] group-focus-within:text-[#F57C1F] transition-colors" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for restaurants or dishes"
            className="w-full bg-[#2A1E14] border border-white/5 rounded-[1.5rem] py-4 pl-12 pr-4 text-sm outline-none focus:border-[#F57C1F]/30 transition-all placeholder:text-[#8B7E6F]" 
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-3 px-6 mb-8 overflow-x-auto no-scrollbar">
        <button className="bg-[#F57C1F] p-4 rounded-2xl text-white shadow-lg shadow-orange-900/20 active:scale-95 transition-transform">
          <FiFilter />
        </button>
        <button 
          onClick={() => setActiveCategory('All')}
          className={`px-6 py-2 rounded-2xl font-bold text-sm whitespace-nowrap transition-all border active:scale-95 ${activeCategory === 'All' ? 'bg-[#F57C1F] border-transparent' : 'bg-[#2A1E14] border-white/5'}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button 
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-6 py-2 rounded-2xl font-bold text-sm whitespace-nowrap transition-all border active:scale-95 ${activeCategory === cat.name ? 'bg-[#F57C1F] border-transparent' : 'bg-[#2A1E14] border-white/5'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Featured Stores Section */}
      <section className="mb-8">
        <h2 className="px-6 text-xl font-black mb-4">Featured Stores</h2>
        <div className="flex gap-4 overflow-x-auto px-6 no-scrollbar">
          {featuredStores.map(store => (
            <div 
              key={store.id} 
              onClick={() => handleRestaurantClick(store)}
              className="min-w-[280px] group cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="relative h-44 rounded-[2rem] overflow-hidden mb-3">
                <img src={store.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={store.name} />
                <div className="absolute top-4 left-4 bg-[#F57C1F] text-[10px] font-black px-3 py-1 rounded-lg shadow-lg">
                  {store.promo}
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-lg">{store.name}</h3>
                  <p className="text-xs text-[#8B7E6F] font-medium">{store.type} • {store.priceRange}</p>
                </div>
                <div className="flex items-center gap-1 text-[#F57C1F] font-black">
                  <FiStar className="fill-current" size={14} />
                  <span className="text-sm">{store.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Near You Section */}
      <section className="px-6 pb-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black">Near You</h2>
          <button className="text-[#F57C1F] text-xs font-black uppercase tracking-widest active:opacity-50 transition-opacity">See All</button>
        </div>

        <div className="space-y-8">
          {currentItems.map(rest => (
            <div 
              key={rest.id} 
              onClick={() => handleRestaurantClick(rest)}
              className="group cursor-pointer active:scale-[0.99] transition-transform"
            >
              <div className="relative h-56 rounded-[2.5rem] overflow-hidden mb-4 shadow-2xl">
                <img src={rest.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={rest.name} />
                <div 
                  onClick={(e) => toggleLike(e, rest.id)}
                  className={`absolute top-4 right-4 backdrop-blur-md p-3 rounded-2xl border border-white/10 transition-all ${likedRestaurants[rest.id] ? 'bg-[#F57C1F]' : 'bg-black/20 hover:bg-black/40'}`}
                >
                  <FiHeart className={`transition-colors ${likedRestaurants[rest.id] ? 'fill-white text-white' : 'text-white'}`} />
                </div>
                <div className="absolute bottom-4 left-4 bg-[#1C160E]/80 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10">
                  <FiClock className="text-[#F57C1F]" />
                  <span className="text-xs font-black">{rest.time}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black mb-1">{rest.name}</h3>
                  <p className="text-xs text-[#8B7E6F] font-bold uppercase tracking-wider">
                    {rest.type} • {rest.priceRange} <span className="mx-2 text-white/10">|</span> <span className="text-[#F57C1F]">{rest.deliveryFee}</span>
                  </p>
                </div>
                <div className="bg-green-500/10 px-3 py-1 rounded-xl flex items-center gap-1 border border-green-500/20">
                  <FiStar className="text-green-400 fill-green-400" size={12} />
                  <span className="text-green-400 font-black text-sm">{rest.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls - Only shows if more than 3 items exist */}
        {filteredRestaurants.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="w-10 h-10 rounded-xl bg-[#2A1E14] border border-white/5 flex items-center justify-center disabled:opacity-20 disabled:scale-100 active:scale-90 transition-all"
            >
              <FiChevronLeft />
            </button>
            
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${currentPage === i + 1 ? 'bg-[#F57C1F] text-white shadow-lg shadow-orange-900/20' : 'bg-[#2A1E14] text-[#8B7E6F] border border-white/5 hover:border-[#F57C1F]/50'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="w-10 h-10 rounded-xl bg-[#2A1E14] border border-white/5 flex items-center justify-center disabled:opacity-20 disabled:scale-100 active:scale-90 transition-all"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </section>

    </div>
  );
};

export default Discovery;