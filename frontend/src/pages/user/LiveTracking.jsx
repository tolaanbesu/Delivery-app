import React from 'react';
import { FiChevronLeft, FiMessageSquare, FiPhone, FiTruck, FiCheckCircle } from 'react-icons/fi';

const LiveTracking = () => {
  return (
    <div className="max-w-md mx-auto bg-[#1C160E] min-h-screen text-white font-sans">
      {/* Map Header */}
      <div className="relative h-96">
        <img src="/map-static.jpg" className="w-full h-full object-cover" />
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
          <div className="bg-[#1C160E] p-3 rounded-xl"><FiChevronLeft /></div>
          <div className="bg-[#2A1E14] p-5 rounded-3xl border border-[#3D2C1E] shadow-2xl flex-1 mx-4">
            <div className="flex justify-between mb-2">
              <span className="font-black text-sm uppercase">On the way</span>
              <span className="text-[#F57C1F] font-black">12-15 mins</span>
            </div>
            <div className="h-2 bg-[#3D2C1E] rounded-full overflow-hidden">
              <div className="w-[70%] h-full bg-[#F57C1F]" />
            </div>
          </div>
        </div>
      </div>

      {/* Driver & Timeline Container */}
      <div className="bg-[#1C160E] -mt-10 rounded-t-[40px] p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src="/driver.jpg" className="w-16 h-16 rounded-3xl object-cover" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#1C160E] rounded-full" />
            </div>
            <div>
              <h3 className="text-lg font-black">Alex Johnson</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Toyota Prius • 7KRM392</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="bg-[#2A1E14] p-4 rounded-2xl border border-[#3D2C1E]"><FiMessageSquare /></div>
            <div className="bg-[#F57C1F] p-4 rounded-2xl shadow-lg shadow-orange-900/40"><FiPhone /></div>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="space-y-8 ml-2">
          <div className="flex gap-6 relative">
            <div className="absolute top-8 bottom-[-32px] left-3 w-1 bg-[#F57C1F]" />
            <FiCheckCircle className="text-[#F57C1F] text-2xl z-10" />
            <div><p className="font-black">Order Placed</p><p className="text-xs text-gray-500">12:30 PM</p></div>
          </div>
          {/* Repeat for other steps using conditional logic for inactive gray states */}
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;