import React from 'react';
import { FiChevronLeft, FiInfo, FiCreditCard } from 'react-icons/fi';

const Checkout = () => {
  return (
    <div className="bg-[#1C160E] text-[#EDE8E2] min-h-screen p-6 pb-40">
      <div className="flex justify-between items-center mb-8">
        <FiChevronLeft className="text-xl" />
        <h1 className="text-xl font-bold">Checkout</h1>
        <FiInfo className="text-xl" />
      </div>

      {/* Address */}
      <section className="mb-8">
        <h2 className="font-bold mb-4">Delivery Address</h2>
        <div className="bg-[#2A1E14] rounded-3xl p-5 flex gap-4">
          <div className="flex-1">
            <p className="font-bold mb-1">Home</p>
            <p className="text-xs text-gray-500 leading-relaxed">123 UI Designer St, San Francisco, CA 94107</p>
            <button className="mt-4 bg-[#3D2C1E] px-4 py-1.5 rounded-lg text-xs font-bold border border-[#4A3728]">Change</button>
          </div>
          <div className="w-24 h-24 rounded-2xl bg-blue-900 overflow-hidden">
             <img src="https://maps.googleapis.com/maps/api/staticmap?center=San+Francisco&zoom=13&size=200x200" className="w-full h-full object-cover" alt="map" />
          </div>
        </div>
      </section>

      {/* Payment Selector */}
      <section className="mb-8">
         <h2 className="font-bold mb-4">Payment Method</h2>
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#2A1E14] border-2 border-[#F57C1F] rounded-2xl p-4 flex flex-col items-center">
                <FiCreditCard className="text-[#F57C1F] text-2xl mb-2" />
                <span className="text-sm font-bold">Credit Card</span>
            </div>
            <div className="bg-[#2A1E14] border border-[#3D2C1E] rounded-2xl p-4 flex flex-col items-center opacity-50">
                <span className="text-sm font-bold">PayPal</span>
            </div>
         </div>
      </section>

      {/* Order Summary */}
      <section className="bg-[#2A1E14] rounded-3xl p-6 space-y-3">
         <div className="flex justify-between text-sm"><span className="text-gray-400">Subtotal (3 items)</span><span>$34.50</span></div>
         <div className="flex justify-between text-sm"><span className="text-gray-400">Delivery Fee</span><span className="text-green-500 font-bold uppercase text-[10px]">Free</span></div>
         <div className="flex justify-between text-sm"><span className="text-gray-400">Service Tax (5%)</span><span>$1.72</span></div>
      </section>

      {/* Floating Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1C160E] p-6 border-t border-[#2A1E14]">
         <div className="flex justify-between text-xs mb-4">
            <div>
                <p className="text-gray-500">Estimated Arrival</p>
                <p className="font-bold">25 - 35 mins</p>
            </div>
            <div className="text-right">
                <p className="text-gray-500">Pay with</p>
                <p className="font-bold">VISA • 4242</p>
            </div>
         </div>
         <button className="w-full bg-[#F57C1F] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-lg">
           Place Order • $36.22 <span className="text-xl">→</span>
         </button>
      </div>
    </div>
  );
};

export default Checkout;