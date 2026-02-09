import React, { useState } from 'react';
import { FiChevronLeft, FiSearch, FiMenu, FiPlus, FiHelpCircle, FiInfo, FiChevronDown, FiUploadCloud } from 'react-icons/fi';
import { menuStructure } from '../../utils/data';

const MenuEditor = () => {
  const [activeTab, setActiveTab] = useState('Categories');
  const [expandedCategory, setExpandedCategory] = useState('Appetizers');

  return (
    <div className="max-w-md mx-auto bg-[#130F0A] min-h-screen text-[#EDE8E2] pb-40 relative font-sans">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <FiChevronLeft className="text-[#F57C1F] text-2xl cursor-pointer" />
          <div className="text-center">
            <h1 className="text-lg font-bold">Edit Menu</h1>
            <p className="text-[#F57C1F] text-[10px] font-black uppercase tracking-[0.2em]">The Burger Joint</p>
          </div>
          <button className="text-[#F57C1F] font-bold text-sm hover:opacity-80">Save</button>
        </div>

        {/* Tab Headers */}
        <div className="flex justify-between mb-8 border-b border-white/5 text-sm font-bold text-gray-500">
          {['Categories', 'Items', 'Availability', 'Settings'].map((t) => (
            <button 
              key={t} 
              onClick={() => setActiveTab(t)}
              className={`pb-3 transition-all ${activeTab === t ? 'text-white border-b-2 border-[#F57C1F]' : 'hover:text-gray-300'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
          <input 
            className="w-full bg-[#1C160E] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm placeholder-gray-600 outline-none focus:border-[#F57C1F]/50 transition-colors" 
            placeholder="Search menu items..." 
          />
        </div>

        {/* Menu Structure Label */}
        <div className="flex justify-between items-center mb-4 px-1">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em]">Menu Structure</span>
          <span className="text-[#F57C1F] text-[10px] font-bold flex items-center gap-1.5">
            <FiInfo className="text-xs" /> Drag icons to reorder
          </span>
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          {menuStructure.map((category) => (
            <div key={category.id} className="bg-[#1C160E] rounded-[2rem] border border-white/5 overflow-hidden">
              {/* Category Header */}
              <div 
                className="p-5 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}
              >
                <div className="flex items-center gap-4">
                  <FiMenu className="text-gray-600 text-lg" />
                  <div>
                    <h3 className="font-bold text-base">{category.name}</h3>
                    <p className="text-[11px] text-gray-500 font-medium">{category.count} items • {category.status}</p>
                  </div>
                </div>
                <FiChevronDown className={`text-gray-500 transition-transform duration-300 ${expandedCategory === category.name ? 'rotate-180' : ''}`} />
              </div>

              {/* Items List (Collapsible) */}
              {expandedCategory === category.name && (
                <div className="px-5 pb-5 space-y-4 animate-in slide-in-from-top-2 duration-300">
                  {category.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-[#130F0A]/40 p-3 rounded-2xl border border-white/5 group">
                      <img src={item.img} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm group-hover:text-[#F57C1F] transition-colors">{item.name}</h4>
                          <span className="text-[#F57C1F] font-black text-sm">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-[10px] italic text-gray-500 mt-1">{item.description}</p>
                      </div>
                      
                      {/* Toggle Switch */}
                      <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 cursor-pointer ${item.active ? 'bg-[#F57C1F]' : 'bg-[#2A1E14]'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${item.active ? 'right-1' : 'left-1'}`} />
                      </div>
                    </div>
                  ))}

                  {/* Add Item Button */}
                  <button className="w-full border-2 border-dashed border-white/5 rounded-2xl py-4 text-[11px] font-black text-gray-500 flex items-center justify-center gap-2 hover:border-[#F57C1F]/30 hover:text-gray-400 transition-all uppercase tracking-widest">
                    <FiPlus className="text-[#F57C1F] text-base" /> Add Item to {category.name}
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Create New Category */}
          <button className="w-full py-5 text-[#F57C1F] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3">
            <FiMenu className="text-sm" /> Create New Category
          </button>
        </div>
      </div>

      {/* Floating Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 pb-10 bg-gradient-to-t from-[#130F0A] via-[#130F0A]/90 to-transparent">
        <div className="flex flex-col items-center gap-6">
          {/* Help Button */}
          <button className="self-end bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
            <FiHelpCircle className="text-[#130F0A] text-2xl" />
          </button>

          {/* Status and Publish Button */}
          <div className="w-full flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Status</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#4ADE80] rounded-full shadow-[0_0_8px_#4ADE80]" />
                <span className="text-xs font-bold">Online & Live</span>
              </div>
            </div>
            
            <button className="flex-1 bg-[#F57C1F] text-white font-black py-4 rounded-full shadow-[0_10px_25px_rgba(245,124,31,0.4)] uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 active:scale-95 transition-all">
              <FiUploadCloud className="text-lg" /> Publish Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuEditor;