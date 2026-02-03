import React from 'react';
import { FiChevronLeft, FiSearch, FiMoreVertical, FiMenu, FiPlus, FiHelpCircle } from 'react-icons/fi';

const MenuEditor = () => {
  return (
    <div className="max-w-md mx-auto bg-brand-dark min-h-screen text-[#EDE8E2] relative">
      <div className="p-5">
        <div className="flex items-center justify-between mb-8">
          <FiChevronLeft className="text-brand-orange text-2xl" />
          <div className="text-center">
            <h1 className="text-lg font-bold">Edit Menu</h1>
            <p className="text-brand-orange text-[10px] font-black uppercase tracking-widest">The Burger Joint</p>
          </div>
          <button className="text-brand-orange font-bold text-sm">Save</button>
        </div>

        {/* Tab Headers */}
        <div className="flex justify-between mb-8 border-b border-brand-border text-sm font-bold text-gray-500">
          {['Categories', 'Items', 'Availability', 'Settings'].map((t) => (
            <button key={t} className={`pb-3 ${t === 'Categories' ? 'text-white border-b-2 border-brand-orange' : ''}`}>{t}</button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <FiSearch className="absolute left-4 top-3.5 text-gray-500" />
          <input className="w-full bg-brand-card border border-brand-border rounded-2xl py-3.5 pl-12 pr-4 text-sm placeholder-gray-600 outline-none" placeholder="Search menu items..." />
        </div>

        {/* Categories Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span>Menu Structure</span>
            <span className="text-brand-orange flex items-center gap-1"><FiInfo className="text-xs" /> Drag icons to reorder</span>
          </div>

          <div className="bg-brand-card rounded-3xl border border-brand-border p-5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <FiMenu className="text-gray-500" />
                <div><h3 className="font-bold">Appetizers</h3><p className="text-xs text-gray-500">4 items • Active</p></div>
              </div>
              <FiChevronLeft className="-rotate-90 text-gray-500" />
            </div>

            {/* Menu Item */}
            <div className="flex items-center gap-4 bg-brand-dark/50 p-4 rounded-2xl border border-brand-border/50 mb-4">
               <img src="https://images.unsplash.com/photo-1573082801974-af29627374f0?w=120" className="w-16 h-16 rounded-xl object-cover" />
               <div className="flex-1">
                 <div className="flex justify-between"><h4 className="font-bold">Truffle Fries</h4><span className="text-brand-orange font-bold text-sm">$8.50</span></div>
                 <p className="text-[10px] italic text-gray-500 mt-1">Vegan, Gluten-Free</p>
               </div>
               <div className="w-10 h-5 bg-brand-orange rounded-full relative p-1"><div className="absolute right-1 w-3 h-3 bg-white rounded-full"></div></div>
            </div>

            <button className="w-full border-2 border-dashed border-brand-border rounded-2xl py-4 text-xs font-bold text-gray-500 flex items-center justify-center gap-2">
              <FiPlus className="text-brand-orange" /> Add Item to Appetizers
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-8 left-0 right-0 max-w-md mx-auto px-5 flex flex-col items-center gap-4">
         <div className="bg-white rounded-full p-3 shadow-2xl self-end mr-2"><FiHelpCircle className="text-brand-dark text-xl" /></div>
         <button className="w-full bg-brand-orange text-white font-black py-5 rounded-full shadow-[0_10px_30px_rgba(245,124,31,0.5)] uppercase tracking-widest text-sm flex items-center justify-center gap-2">
           <FiTrendingUp className="rotate-90" /> Publish Changes
         </button>
      </div>
    </div>
  );
};

export default MenuEditor;