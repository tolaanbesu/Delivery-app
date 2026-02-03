import React from 'react';
import { FiFilter, FiHeart, FiStar, FiClock } from 'react-icons/fi';

const Discovery = () => (
  <div className="max-w-md mx-auto bg-food-dark min-h-screen p-5 pb-24 text-food-text">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <div className="bg-food-orange p-2 rounded-lg text-white"><FiFilter /></div>
        <p className="font-bold">Home, Maple Street</p>
      </div>
      <img src="https://i.pravatar.cc/100" className="w-10 h-10 rounded-full" alt="profile" />
    </div>

    {/* Search & Filters */}
    <div className="relative mb-6">
      <input className="w-full bg-food-card border border-food-border rounded-2xl py-4 px-6 text-sm" placeholder="Search for restaurants..." />
    </div>

    <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar">
      <button className="bg-food-orange px-6 py-2 rounded-xl font-bold flex items-center gap-2">Filters</button>
      {['Pizza', 'Sushi', 'Burgers'].map(cat => (
        <button key={cat} className="bg-food-card border border-food-border px-6 py-2 rounded-xl font-bold">{cat}</button>
      ))}
    </div>

    <h2 className="text-xl font-bold mb-4">Near You</h2>
    {/* Restaurant Card */}
    <div className="bg-food-card rounded-3xl overflow-hidden border border-food-border mb-6 group">
      <div className="relative h-48">
        <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591" className="w-full h-full object-cover" alt="pizza" />
        <div className="absolute top-4 right-4 bg-food-dark/50 p-2 rounded-full"><FiHeart className="text-white" /></div>
        <div className="absolute bottom-4 left-4 bg-food-dark/80 px-3 py-1 rounded-lg flex items-center gap-2 text-xs">
          <FiClock className="text-food-orange" /> 15-25 min
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-bold">Bella Napoli</h3>
          <span className="bg-green-900/30 text-green-400 px-2 py-0.5 rounded flex items-center gap-1 text-xs font-bold"><FiStar className="fill-current" /> 4.7</span>
        </div>
        <p className="text-xs text-gray-500">Italian • Pizza • $$ • $1.99 Delivery</p>
      </div>
    </div>
  </div>
);

export default Discovery;