import React from 'react';
import { FiSearch, FiMoreHorizontal } from 'react-icons/fi';

const OrderBoard = () => {
  return (
    <div className="max-w-md mx-auto bg-brand-dark min-h-screen text-[#EDE8E2]">
      <div className="p-6 border-b border-brand-border flex justify-between items-center">
        <div className="w-6 h-6 bg-brand-orange rounded-md"></div>
        <div className="text-center">
          <h1 className="text-lg font-bold">Live Orders</h1>
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase text-status-green">
            <span className="w-1.5 h-1.5 bg-status-green rounded-full animate-pulse"></span> System Online
          </div>
        </div>
        <FiSearch className="text-xl" />
      </div>

      <div className="flex border-b border-brand-border">
        {[{t:'New', c:8, a:true}, {t:'Prep', c:12}, {t:'Out', c:5}, {t:'Done', c:42}].map((s) => (
          <div key={s.t} className={`flex-1 text-center py-4 ${s.a ? 'border-b-2 border-brand-orange' : ''}`}>
            <p className={`font-black text-sm ${s.a ? 'text-white' : 'text-gray-600'}`}>{s.t}</p>
            <p className="text-[10px] uppercase font-bold text-gray-600 mt-1">{s.c} Orders</p>
          </div>
        ))}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">New Queue</h2>
          <button className="bg-brand-card border border-brand-border px-4 py-1.5 rounded-full text-xs font-bold text-gray-400">Sort: Newest</button>
        </div>

        {/* Order Card */}
        <div className="bg-brand-card rounded-[32px] p-6 border border-brand-border mb-6">
          <div className="flex justify-between items-start mb-1 text-sm">
            <span className="text-brand-orange font-black">#4829 • $24.50</span>
            <span className="text-gray-500 font-bold">12 mins ago <span className="text-red-500 ml-1">!</span></span>
          </div>
          <h3 className="text-xl font-black mb-6 tracking-tight">Burger King Combo</h3>
          <div className="space-y-2 mb-8 text-gray-300 font-medium">
            <p><span className="text-brand-orange font-bold mr-2">2x</span> Classic Beef Burger</p>
            <p><span className="text-brand-orange font-bold mr-2">1x</span> Large Coke (Zero)</p>
            <p><span className="text-brand-orange font-bold mr-2">1x</span> Medium Fries</p>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 bg-brand-orange text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2">
              Accept & Start <span className="text-xs">▶</span>
            </button>
            <button className="bg-brand-dark border border-brand-border p-4 rounded-2xl"><FiMoreHorizontal /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBoard;