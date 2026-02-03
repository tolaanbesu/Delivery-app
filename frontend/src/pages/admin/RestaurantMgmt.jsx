import React from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const RestaurantMgmt = () => {
  return (
    <div className="bg-[#1C160E] text-[#EDE8E2] min-h-screen p-6">
      <h1 className="text-center font-bold text-lg mb-8">Manage Restaurants</h1>
      
      <button className="w-full bg-[#F57C1F] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 mb-6">
        <FiPlus /> Add New Restaurant
      </button>

      <div className="flex gap-3 mb-8">
        <button className="bg-[#F57C1F] text-white px-6 py-2 rounded-full font-bold">All (24)</button>
        <button className="bg-[#2A1E14] text-gray-400 px-6 py-2 rounded-full font-bold border border-[#3D2C1E]">Active</button>
        <button className="bg-[#2A1E14] text-gray-400 px-6 py-2 rounded-full font-bold border border-[#3D2C1E]">Inactive</button>
      </div>

      <h3 className="font-bold mb-4">Restaurant Partners</h3>

      <div className="bg-[#2A1E14] rounded-3xl p-5 mb-4 border border-[#3D2C1E]">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className="bg-[#3D2C1E] p-3 rounded-xl">🍔</div>
            <div>
              <p className="font-bold">The Burger Joint</p>
              <p className="text-xs text-gray-500">Upper West Side, NY</p>
            </div>
          </div>
          <span className="bg-[#1B2E21] text-[#4ADE80] text-[10px] px-2 py-1 rounded-md font-bold uppercase">Active</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-[#1C160E] py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm">
            <FiEdit2 className="text-[#F57C1F]" /> Edit
          </button>
          <button className="bg-[#2D1A1A] py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm text-[#F87171]">
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMgmt;