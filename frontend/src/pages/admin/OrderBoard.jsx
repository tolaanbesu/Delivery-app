import React, { useState, useMemo, useContext } from 'react';
import { 
  FiSearch, FiMoreHorizontal, FiGrid, FiBarChart2, 
  FiInbox, FiSettings, FiClock, FiAlertCircle, FiChevronDown, FiChevronUp, FiX 
} from 'react-icons/fi';

// IMPORTING FROM APPSTORE INSTEAD OF data.js
import { AppContext } from '../../store/AppStore';

const OrderBoard = () => {
  const [state, dispatch] = useContext(AppContext); // get state from context

  // --- FIXED: Drive UI from Global State directly ---
  const orders = useMemo(() => {
    // Combine state.orders (live) and state.recentOrders (static/mock) if needed
    const allOrders = [...(state.orders || []), ...(state.recentOrders || [])];
    
    return allOrders.map((order, index) => {
      const customer = (state.users || []).find(u => u.id === order.ownerId || u.id === order.userId) 
                       || (state.users?.[0]) 
                       || { name: 'Guest' };
      
      return {
        ...order,
        // Ensure every order has a boardStatus; default to 'New' if it's a live order just placed
        boardStatus: order.boardStatus || 'New',
        customer: customer,
        // Fallback for missing properties in live orders
        name: order.restaurantName || order.name || 'Order',
        price: order.grandTotal ? `$${order.grandTotal.toFixed(2)}` : (order.price || '$0.00'),
        time: order.time || new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: order.items || ['Standard Package']
      };
    });
  }, [state.orders, state.recentOrders, state.users]);

  const [activeTab, setActiveTab] = useState('New');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // --- Search & Filter Logic ---
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesTab = order.boardStatus === activeTab;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        (order.id || "").toLowerCase().includes(searchLower) ||
        (order.name || "").toLowerCase().includes(searchLower) ||
        (order.customer.name || "").toLowerCase().includes(searchLower);
      
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  const displayedOrders = showAll ? filteredOrders : filteredOrders.slice(0, 3);

  // --- FIXED: Dispatching to Global Store instead of local state ---
  const moveOrder = (orderId, nextStatus) => {
    dispatch({
      type: "UPDATE_ORDER_STATUS",
      payload: { 
        id: orderId, 
        boardStatus: nextStatus, 
        status: nextStatus === 'Done' ? 'PAID' : 'PENDING' 
      }
    });
  };

  const getCount = (status) => orders.filter(o => o.boardStatus === status).length;

  const renderActionButton = (order) => {
    switch (order.boardStatus) {
      case 'New':
        return (
          <button onClick={() => moveOrder(order.id, 'Prep')} className="flex-1 bg-[#F57C1F] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 transition-all">
            Accept & Start <span className="text-[10px]">▶</span>
          </button>
        );
      case 'Prep':
        return (
          <button onClick={() => moveOrder(order.id, 'Out')} className="flex-1 bg-[#4ADE80] text-[#130F0A] font-black py-4 rounded-2xl flex items-center justify-center gap-2">
            Mark as Ready <span className="text-[10px]">✔</span>
          </button>
        );
      case 'Out':
        return (
          <button onClick={() => moveOrder(order.id, 'Done')} className="flex-1 bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2">
            Confirm Delivery
          </button>
        );
      default:
        return (
          <div className="flex-1 py-4 text-center text-gray-500 font-bold uppercase tracking-widest text-[9px] border border-white/5 rounded-2xl italic">
            Completed Order
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#130F0A] min-h-screen text-[#EDE8E2] font-sans pb-24 relative overflow-hidden">
      
      {/* --- Dynamic Header --- */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#130F0A]/80 backdrop-blur-md sticky top-0 z-50">
        {!isSearchVisible ? (
          <>
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F57C1F]/10 border border-[#F57C1F]/20">
              <FiGrid className="text-[#F57C1F] text-xl" />
            </div>
            <div className="text-center">
              <h1 className="text-lg font-black tracking-tight">Live Orders</h1>
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase text-[#4ADE80]">
                <span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full animate-pulse shadow-[0_0_8px_#4ADE80]"></span> 
                System Online
              </div>
            </div>
            <div onClick={() => setIsSearchVisible(true)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 cursor-pointer">
              <FiSearch className="text-xl" />
            </div>
          </>
        ) : (
          <div className="flex items-center w-full gap-3 animate-in fade-in slide-in-from-right-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F57C1F]" />
              <input 
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order, store, or name..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-[#F57C1F]"
              />
            </div>
            <FiX onClick={() => {setIsSearchVisible(false); setSearchQuery('');}} className="text-gray-500 text-xl cursor-pointer" />
          </div>
        )}
      </div>

      {/* --- Tabs --- */}
      <div className="flex border-b border-white/5 bg-[#130F0A] sticky top-[89px] z-40">
        {['New', 'Prep', 'Out', 'Done'].map((tab) => (
          <button key={tab} onClick={() => {setActiveTab(tab); setShowAll(false);}} className={`flex-1 text-center py-4 transition-all relative ${activeTab === tab ? '' : 'opacity-30'}`}>
            <p className="font-black text-xs uppercase tracking-widest">{tab}</p>
            <p className="text-[10px] font-bold mt-1 text-gray-400">
              {tab === 'Done' ? `${getCount('Done')} today` : `${getCount(tab)} Orders`}
            </p>
            {activeTab === tab && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-[#F57C1F]" />}
          </button>
        ))}
      </div>

      {/* --- Content Area --- */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">{activeTab} Queue</h2>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Total: {filteredOrders.length}</span>
          </div>
        </div>

        <div className="space-y-6">
          {displayedOrders.length > 0 ? (
            <>
              {displayedOrders.map((order) => (
                <div key={order.id} className="bg-[#1C160E] rounded-[32px] p-6 border border-white/5 shadow-2xl relative overflow-hidden transition-all duration-300">
                  {order.status === 'PENDING' && <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />}
                  
                  <div className="flex justify-between items-start mb-1 text-sm">
                    <span className="text-[#F57C1F] font-black">{order.id?.slice(0,8)} • {order.price}</span>
                    <span className="text-gray-500 font-bold text-[10px] flex items-center gap-1">
                      <FiClock className="text-[12px]" /> {order.time}
                      {order.status === 'PENDING' && <FiAlertCircle className="text-yellow-500 ml-1" />}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-black mb-1 tracking-tight">{order.name}</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-6">Cust: {order.customer.name}</p>
                  
                  <div className="space-y-3 mb-8 bg-[#130F0A]/50 p-4 rounded-2xl">
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-[#D1CABD] font-semibold text-sm flex items-center gap-3">
                        <span className="text-[#F57C1F] font-black text-xs">1x</span> {item}
                      </p>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {renderActionButton(order)}
                    <button className="bg-[#130F0A] border border-white/5 p-4 rounded-2xl hover:bg-white/5">
                      <FiMoreHorizontal />
                    </button>
                  </div>
                </div>
              ))}

              {/* Show More/Less Button */}
              {filteredOrders.length > 3 && (
                <button 
                  onClick={() => setShowAll(!showAll)}
                  className="w-full py-4 flex items-center justify-center gap-2 text-[#F57C1F] font-black text-[10px] uppercase tracking-[0.2em] bg-white/5 rounded-2xl border border-white/5"
                >
                  {showAll ? (
                    <><FiChevronUp /> Show Less</>
                  ) : (
                    <><FiChevronDown /> Show More ({filteredOrders.length - 3} more)</>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiInbox size={32} className="opacity-20" />
              </div>
              <p className="font-black uppercase text-[10px] tracking-[0.3em] opacity-30">
                {searchQuery ? "No matching results" : `No active ${activeTab} orders`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderBoard;
// import React, { useState, useMemo } from 'react';
// import { 
//   FiSearch, FiMoreHorizontal, FiGrid, FiBarChart2, 
//   FiInbox, FiSettings, FiClock, FiAlertCircle, FiChevronDown, FiChevronUp, FiX 
// } from 'react-icons/fi';

// // IMPORTING YOUR DATA
// import { userData, adminDashboardData } from '../../utils/data';

// const OrderBoard = () => {
//   // --- Enhanced Data State ---
//   const [orders, setOrders] = useState(() => {
//     return adminDashboardData.recentOrders.map((order, index) => {
//       // Find the specific customer from userData based on order.userId
//       const customer = userData.find(u => u.id === order.userId) || userData[0];
      
//       return {
//         ...order,
//         // Map initial board status based on order index/data
//         boardStatus: index < 4 ? 'New' : index < 7 ? 'Prep' : index < 9 ? 'Out' : 'Done',
//         customer: customer,
//         items: ['1x Signature Dish', '1x Side Item', '1x Drink'] 
//       };
//     });
//   });

//   const [activeTab, setActiveTab] = useState('New');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showAll, setShowAll] = useState(false);
//   const [isSearchVisible, setIsSearchVisible] = useState(false);

//   // --- Search & Filter Logic ---
//   const filteredOrders = useMemo(() => {
//     return orders.filter(order => {
//       const matchesTab = order.boardStatus === activeTab;
//       const searchLower = searchQuery.toLowerCase();
//       const matchesSearch = 
//         order.id.toLowerCase().includes(searchLower) ||
//         order.name.toLowerCase().includes(searchLower) ||
//         order.customer.name.toLowerCase().includes(searchLower);
      
//       return matchesTab && matchesSearch;
//     });
//   }, [orders, activeTab, searchQuery]);

//   // Handle Show More pagination
//   const displayedOrders = showAll ? filteredOrders : filteredOrders.slice(0, 3);

//   // --- Handlers ---
//   const moveOrder = (orderId, nextStatus) => {
//     setOrders(prev => prev.map(order => 
//       order.id === orderId ? { ...order, boardStatus: nextStatus, status: nextStatus === 'Done' ? 'PAID' : 'PENDING' } : order
//     ));
//   };

//   const getCount = (status) => orders.filter(o => o.boardStatus === status).length;

//   const renderActionButton = (order) => {
//     switch (order.boardStatus) {
//       case 'New':
//         return (
//           <button onClick={() => moveOrder(order.id, 'Prep')} className="flex-1 bg-[#F57C1F] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 transition-all">
//             Accept & Start <span className="text-[10px]">▶</span>
//           </button>
//         );
//       case 'Prep':
//         return (
//           <button onClick={() => moveOrder(order.id, 'Out')} className="flex-1 bg-[#4ADE80] text-[#130F0A] font-black py-4 rounded-2xl flex items-center justify-center gap-2">
//             Mark as Ready <span className="text-[10px]">✔</span>
//           </button>
//         );
//       case 'Out':
//         return (
//           <button onClick={() => moveOrder(order.id, 'Done')} className="flex-1 bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2">
//             Confirm Delivery
//           </button>
//         );
//       default:
//         return (
//           <div className="flex-1 py-4 text-center text-gray-500 font-bold uppercase tracking-widest text-[9px] border border-white/5 rounded-2xl italic">
//             Completed Order
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-[#130F0A] min-h-screen text-[#EDE8E2] font-sans pb-24 relative overflow-hidden">
      
//       {/* --- Dynamic Header --- */}
//       <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#130F0A]/80 backdrop-blur-md sticky top-0 z-50">
//         {!isSearchVisible ? (
//           <>
//             <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F57C1F]/10 border border-[#F57C1F]/20">
//               <FiGrid className="text-[#F57C1F] text-xl" />
//             </div>
//             <div className="text-center">
//               <h1 className="text-lg font-black tracking-tight">Live Orders</h1>
//               <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase text-[#4ADE80]">
//                 <span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full animate-pulse shadow-[0_0_8px_#4ADE80]"></span> 
//                 System Online
//               </div>
//             </div>
//             <div onClick={() => setIsSearchVisible(true)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 cursor-pointer">
//               <FiSearch className="text-xl" />
//             </div>
//           </>
//         ) : (
//           <div className="flex items-center w-full gap-3 animate-in fade-in slide-in-from-right-4">
//             <div className="flex-1 relative">
//               <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F57C1F]" />
//               <input 
//                 autoFocus
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search order, store, or name..."
//                 className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-[#F57C1F]"
//               />
//             </div>
//             <FiX onClick={() => {setIsSearchVisible(false); setSearchQuery('');}} className="text-gray-500 text-xl cursor-pointer" />
//           </div>
//         )}
//       </div>

//       {/* --- Tabs --- */}
//       <div className="flex border-b border-white/5 bg-[#130F0A] sticky top-[89px] z-40">
//         {['New', 'Prep', 'Out', 'Done'].map((tab) => (
//           <button key={tab} onClick={() => {setActiveTab(tab); setShowAll(false);}} className={`flex-1 text-center py-4 transition-all relative ${activeTab === tab ? '' : 'opacity-30'}`}>
//             <p className="font-black text-xs uppercase tracking-widest">{tab}</p>
//             <p className="text-[10px] font-bold mt-1 text-gray-400">
//               {tab === 'Done' ? `${getCount('Done')} today` : `${getCount(tab)} Orders`}
//             </p>
//             {activeTab === tab && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-[#F57C1F]" />}
//           </button>
//         ))}
//       </div>

//       {/* --- Content Area --- */}
//       <div className="p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-black">{activeTab} Queue</h2>
//           <div className="flex items-center gap-2">
//             <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Total: {filteredOrders.length}</span>
//           </div>
//         </div>

//         <div className="space-y-6">
//           {displayedOrders.length > 0 ? (
//             <>
//               {displayedOrders.map((order) => (
//                 <div key={order.id} className="bg-[#1C160E] rounded-[32px] p-6 border border-white/5 shadow-2xl relative overflow-hidden transition-all duration-300">
//                   {order.status === 'PENDING' && <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />}
                  
//                   <div className="flex justify-between items-start mb-1 text-sm">
//                     <span className="text-[#F57C1F] font-black">{order.id} • {order.price}</span>
//                     <span className="text-gray-500 font-bold text-[10px] flex items-center gap-1">
//                       <FiClock className="text-[12px]" /> {order.time}
//                       {order.status === 'PENDING' && <FiAlertCircle className="text-yellow-500 ml-1" />}
//                     </span>
//                   </div>
                  
//                   <h3 className="text-xl font-black mb-1 tracking-tight">{order.name}</h3>
//                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-6">Cust: {order.customer.name}</p>
                  
//                   <div className="space-y-3 mb-8 bg-[#130F0A]/50 p-4 rounded-2xl">
//                     {order.items.map((item, idx) => (
//                       <p key={idx} className="text-[#D1CABD] font-semibold text-sm flex items-center gap-3">
//                         <span className="text-[#F57C1F] font-black text-xs">1x</span> {item}
//                       </p>
//                     ))}
//                   </div>

//                   <div className="flex gap-3">
//                     {renderActionButton(order)}
//                     <button className="bg-[#130F0A] border border-white/5 p-4 rounded-2xl hover:bg-white/5">
//                       <FiMoreHorizontal />
//                     </button>
//                   </div>
//                 </div>
//               ))}

//               {/* Show More/Less Button */}
//               {filteredOrders.length > 3 && (
//                 <button 
//                   onClick={() => setShowAll(!showAll)}
//                   className="w-full py-4 flex items-center justify-center gap-2 text-[#F57C1F] font-black text-[10px] uppercase tracking-[0.2em] bg-white/5 rounded-2xl border border-white/5"
//                 >
//                   {showAll ? (
//                     <><FiChevronUp /> Show Less</>
//                   ) : (
//                     <><FiChevronDown /> Show More ({filteredOrders.length - 3} more)</>
//                   )}
//                 </button>
//               )}
//             </>
//           ) : (
//             <div className="py-24 text-center">
//               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <FiInbox size={32} className="opacity-20" />
//               </div>
//               <p className="font-black uppercase text-[10px] tracking-[0.3em] opacity-30">
//                 {searchQuery ? "No matching results" : `No active ${activeTab} orders`}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

      
//     </div>
//   );
// };

// export default OrderBoard;