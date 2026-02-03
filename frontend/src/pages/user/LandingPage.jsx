import React, { useState } from 'react';
import { FiMapPin, FiSearch, FiStar, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { allRestaurants, categories } from '../../utils/data';

const LandingPage = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Pizza');
  
  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 3 rows of 2 items each

  // --- Search & Filter Logic ---
  const filteredRestaurants = allRestaurants.filter(res => {
    const matchesCategory = activeCategory ? res.category === activeCategory : true;
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // --- Pagination Calculations ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRestaurants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 700, behavior: 'smooth' }); // Scroll back to grid start
  };

  return (
    <div className="bg-[#1C160E] min-h-screen text-white font-sans no-scrollbar pb-10">
      
      {/* 1. Header (Same as before) */}
      <header className="px-6 py-4 flex justify-between items-center bg-[#1C160E]/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="text-[#F57C1F] text-2xl font-black">🍴</div>
          <span className="text-xl font-black tracking-tight">FoodDash</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="text-sm font-bold text-gray-400 hover:text-white active:scale-90 transition-all px-2 py-1">Login</button>
          <button onClick={() => navigate('/signup')} className="bg-[#F57C1F] hover:bg-[#ff8c37] active:scale-95 transition-all px-5 py-2.5 rounded-xl text-xs font-black uppercase shadow-lg shadow-[#F57C1F]/20">Sign Up</button>
        </div>
      </header>

      {/* 2. Hero Section (Same as before) */}
      <div className="relative h-[400px] flex flex-col items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-[#1C160E] z-10" />
        <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80" className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
        <div className="relative z-20 w-full max-w-lg animate-in fade-in zoom-in duration-700">
          <h1 className="text-5xl font-black mb-4 tracking-tighter leading-none">Cravings, met.</h1>
          <p className="text-gray-300 text-sm mb-10 max-w-xs mx-auto font-medium">The best local restaurants, delivered to your doorstep in minutes.</p>
          <div className="group bg-black/40 backdrop-blur-2xl border border-white/10 focus-within:border-[#F57C1F]/50 p-2 rounded-2xl flex items-center gap-2 w-full transition-all shadow-2xl">
            <FiSearch className="ml-3 text-[#F57C1F] shrink-0" />
            <input 
              value={searchQuery} 
              onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1)}} 
              className="bg-transparent flex-1 text-sm outline-none placeholder:text-gray-500" 
              placeholder="Search for restaurants..." 
            />
            <button className="bg-[#F57C1F] active:scale-90 p-4 rounded-xl transition-all"><FiMapPin className="text-white" /></button>
          </div>
        </div>
      </div>

      {/* 3. Categories (Same as before) */}
      <div className="p-6">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-black">Popular Categories</h2>
          <button onClick={() => {setActiveCategory(null); setCurrentPage(1)}} className="text-[#F57C1F] text-xs font-black uppercase tracking-widest">View all</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat.name} 
              onClick={() => {setActiveCategory(cat.name); setCurrentPage(1)}}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all ${
                activeCategory === cat.name ? 'bg-[#F57C1F] text-white scale-105' : 'bg-[#2A1E14] text-gray-400'
              }`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Restaurant Grid */}
      <div className="px-6 pb-10">
        <h2 className="text-xl font-black mb-6">{activeCategory || 'All'} Favorites</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {currentItems.map((res) => (
            <div key={res.id} onClick={() => navigate(`/restaurant/${res.id}`)} className="group cursor-pointer animate-in fade-in duration-500">
              <div className="relative h-64 w-full rounded-[2.5rem] overflow-hidden mb-4 border border-white/5">
                <img src={res.img} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" alt={res.name} />
                <div className="absolute top-5 right-5 bg-white text-black px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-xl">
                  <FiStar className="fill-current text-[#F57C1F]" /> {res.rating}
                </div>
              </div>
              <div className="flex justify-between items-start px-2">
                <div>
                  <h4 className="text-2xl font-black group-hover:text-[#F57C1F] transition-colors">{res.name}</h4>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">{res.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-[#F57C1F]">{res.delivery}</p>
                  <p className="text-gray-600 text-[10px] font-bold uppercase">{res.promo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 5. Pagination Controls - Only shows if more than 3 rows (6 items) */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-4">
            <button 
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
              className="p-4 rounded-2xl bg-[#2A1E14] border border-[#3D2C1E] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3D2C1E] transition-all"
            >
              <FiChevronLeft className="text-[#F57C1F]" />
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`w-12 h-12 rounded-2xl font-black transition-all ${
                    currentPage === i + 1 
                    ? 'bg-[#F57C1F] text-white shadow-lg shadow-[#F57C1F]/20' 
                    : 'bg-[#2A1E14] border border-[#3D2C1E] text-gray-500 hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
              className="p-4 rounded-2xl bg-[#2A1E14] border border-[#3D2C1E] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3D2C1E] transition-all"
            >
              <FiChevronRight className="text-[#F57C1F]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
