import React from 'react';
import { FiMinus, FiPlus, FiTrash2, FiChevronLeft } from 'react-icons/fi';

const CartOverlay = ({ cartItemsData, restaurant, cart, updateQuantity, setIsCartOpen, totalPrice, navigate }) => {
  const deliveryFee = 2.50;

  return (
    /* Use absolute to stay within the Layout frame */
    <div className="absolute inset-0 z-50 bg-[#1A120B] flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* 1. Header (Standard Style) */}
      <header className="px-6 py-6 flex justify-between items-center bg-[#1A120B] border-b border-[#2D241C]">
        <button onClick={() => setIsCartOpen(false)} className="text-2xl"><FiChevronLeft /></button>
        <div className="text-center">
          <h1 className="font-bold text-sm uppercase tracking-widest">Your Cart</h1>
          <p className="text-[10px] text-[#A1917B]">{restaurant.name}</p>
        </div>
        <div className="w-8" />
      </header>

      {/* 2. List (Scrollable) */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {cartItemsData.map(item => (
          <div key={item.id} className="flex gap-4 items-center">
            <img src={item.img} className="w-16 h-16 rounded-xl object-cover" alt="" />
            <div className="flex-1">
              <div className="flex justify-between">
                <h5 className="font-bold text-sm">{item.name}</h5>
                <span className="text-[#F57C1F] font-bold text-sm">${(item.price * cart[item.id]).toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-4 bg-[#2D241C] w-fit px-3 py-1 rounded-lg mt-2">
                <button onClick={() => updateQuantity(item.id, -1)} className="text-[#8B7E6F]">
                  {cart[item.id] === 1 ? <FiTrash2 size={12} /> : <FiMinus size={12} />}
                </button>
                <span className="font-bold text-xs">{cart[item.id]}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="text-[#F57C1F]"><FiPlus size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Bottom Summary (Standard Style) */}
      <div className="p-6 bg-[#2D241C] border-t border-white/5">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs text-[#8B7E6F] font-bold uppercase">
            <span>Subtotal</span>
            <span className="text-white">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-[#8B7E6F] font-bold uppercase">
            <span>Delivery</span>
            <span className="text-white">$2.50</span>
          </div>
          <div className="pt-3 border-t border-white/10 flex justify-between items-center">
            <span className="font-black text-white uppercase text-xs">Total</span>
            <span className="text-xl font-black text-[#F57C1F]">${(totalPrice + 2.5).toFixed(2)}</span>
          </div>
        </div>
        <button 
          onClick={() => navigate('/checkout')}
          className="w-full bg-[#F57C1F] py-4 rounded-xl font-black text-white uppercase text-[10px] tracking-widest shadow-lg"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartOverlay;
// import React from 'react';
// import { FiX, FiMinus, FiPlus, FiTrash2, FiChevronLeft, FiShoppingBag } from 'react-icons/fi';

// const CartOverlay = ({ cartItemsData, restaurant, cart, updateQuantity, setIsCartOpen, totalPrice, navigate }) => {
//   const deliveryFee = 2.50;

//   return (
//     // Full-screen wrapper to ensure it covers the Menu page
//     <div className="fixed inset-0 z-[60] bg-[#1A120B] flex flex-col animate-in slide-in-from-right duration-300">
      
//       {/* 1. Header - Matching RestaurantMenu style exactly */}
//       <header className="px-6 py-6 flex justify-between items-center bg-[#1A120B] border-b border-[#2D241C]">
//         <button 
//           onClick={() => setIsCartOpen(false)} 
//           className="text-2xl hover:text-white transition-all"
//         >
//           <FiChevronLeft />
//         </button>
//         <div className="text-center">
//           <h1 className="font-bold text-lg text-white tracking-tight">Your Cart</h1>
//           <p className="text-[11px] text-[#A1917B] font-medium">{restaurant.name}</p>
//         </div>
//         <div className="w-8 h-8 flex items-center justify-center">
//            <FiShoppingBag className="text-[#8B7E6F] text-xl" />
//         </div>
//       </header>

//       {/* 2. Scrollable Content - Matching the Menu mapping style */}
//       <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-bold text-white">Order Summary</h2>
//           <span className="text-[11px] bg-[#2D241C] text-[#A1917B] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
//             {cartItemsData.length} Items
//           </span>
//         </div>

//         <div className="space-y-6">
//           {cartItemsData.map((item) => (
//             <div key={item.id} className="flex gap-4 items-center animate-in fade-in duration-500">
//               {/* Image styled like the menu items */}
//               <img 
//                 src={item.img} 
//                 className="w-20 h-20 rounded-2xl object-cover border border-[#2D241C] shadow-md" 
//                 alt={item.name} 
//               />
              
//               <div className="flex-1">
//                 <div className="flex justify-between items-start mb-1">
//                   <h4 className="font-bold text-white leading-tight">{item.name}</h4>
//                   <p className="text-[#F57C1F] font-black text-sm pl-2">
//                     ${(item.price * cart[item.id]).toFixed(2)}
//                   </p>
//                 </div>
                
//                 <div className="flex items-center justify-between mt-3">
//                   {/* Quantity controls matching the 'Add' buttons style */}
//                   <div className="flex items-center gap-5 bg-[#2D241C] px-3 py-2 rounded-xl">
//                     <button 
//                       onClick={() => updateQuantity(item.id, -1)} 
//                       className="text-[#8B7E6F] hover:text-white transition-colors"
//                     >
//                       {cart[item.id] === 1 ? <FiTrash2 size={14} /> : <FiMinus size={14} />}
//                     </button>
//                     <span className="font-bold text-sm text-white w-4 text-center">{cart[item.id]}</span>
//                     <button 
//                       onClick={() => updateQuantity(item.id, 1)} 
//                       className="text-[#F57C1F] hover:scale-110 transition-transform"
//                     >
//                       <FiPlus size={14} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>

//       {/* 3. Fixed Footer - Matching the "View Cart" button placement */}
//       <footer className="p-6 bg-[#1A120B] border-t border-[#2D241C] space-y-4">
//         <div className="space-y-3">
//           <div className="flex justify-between text-sm">
//             <span className="text-[#8B7E6F] font-medium">Subtotal</span>
//             <span className="text-white font-bold">${totalPrice.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-[#8B7E6F] font-medium">Delivery Fee</span>
//             <span className="text-white font-bold">${deliveryFee.toFixed(2)}</span>
//           </div>
//           <div className="pt-3 border-t border-white/5 flex justify-between items-center">
//             <span className="text-lg font-bold text-white">Total</span>
//             <span className="text-2xl font-black text-[#F57C1F]">
//               ${(totalPrice + deliveryFee).toFixed(2)}
//             </span>
//           </div>
//         </div>

//         <button 
//           onClick={() => navigate('/checkout')}
//           className="w-full bg-[#F57C1F] h-14 rounded-2xl font-black text-white uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all flex justify-center items-center"
//         >
//           Confirm and Pay
//         </button>
//       </footer>
//     </div>
//   );
// };

// export default CartOverlay;