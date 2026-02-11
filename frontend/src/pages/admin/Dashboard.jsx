import React, { useState, useContext, useMemo } from 'react';
import {
  FiBell,
  FiTrendingUp,
  FiDollarSign,
  FiLogOut,
  FiSettings,
  FiUser,
  FiX
} from 'react-icons/fi';
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../store/AppStore';
import { generateAdminDashboardData } from '../../store/adminDashboardData'; // Ensure path is correct

const AdminDashboard = () => {
  const [activePeriod, setActivePeriod] = useState('Week');
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const navigate = useNavigate();

  /* 🔑 AppStore */
  const [state] = useContext(AppContext);
  const { users, orders } = state; // Pull raw data directly from state

  // 🔥 LIVE DATA GENERATION
  // Re-calculates everything whenever 'orders' or 'users' change in the Global Store
  const adminDashboardData = useMemo(() => {
    return generateAdminDashboardData(users, orders);
  }, [users, orders]);

  const currentUser = useMemo(() => {
    const savedEmail = localStorage.getItem('loggedInUserEmail');
    if (!savedEmail || !users) return null;
    return users.find(u => u.email === savedEmail);
  }, [users]);

  const stats = adminDashboardData.periodStats[activePeriod];
  const chartData = adminDashboardData.charts[activePeriod];
  const { notifications } = adminDashboardData;

  const displayedOrders = showAllTransactions
    ? adminDashboardData.recentOrders
    : adminDashboardData.recentOrders.slice(0, 3);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUserEmail');
    localStorage.removeItem('userToken');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#130F0A] text-white p-6 pb-28 relative">
      
      {/* --- POPUP: NOTIFICATIONS --- */}
      {showNotifPopup && (
        <div className="absolute top-20 right-6 w-80 bg-[#1C160E] border border-[#F57C1F]/20 rounded-3xl shadow-2xl z-[100] p-5 animate-in fade-in zoom-in duration-200 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-black uppercase text-xs tracking-widest text-[#F57C1F]">Notifications</h4>
            <button onClick={() => setShowNotifPopup(false)}><FiX /></button>
          </div>
          <div className="space-y-4">
            {notifications.map(n => (
              <div key={n.id} className="border-b border-white/5 pb-3 last:border-0">
                <p className="font-bold text-sm">{n.title}</p>
                <p className="text-gray-500 text-xs mt-1">{n.message}</p>
                <p className="text-[#F57C1F] text-[9px] font-bold mt-1 uppercase">{n.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- POPUP: PROFILE --- */}
      {showProfilePopup && (
        <div className="absolute top-20 right-6 w-72 bg-[#1C160E] border border-[#F57C1F]/20 rounded-3xl shadow-2xl z-[100] p-6 animate-in fade-in zoom-in duration-200 backdrop-blur-xl">
          <div className="flex justify-end mb-2">
            <button onClick={() => setShowProfilePopup(false)}><FiX /></button>
          </div>
          <div className="text-center">
            <img src={currentUser?.avatar} className="w-20 h-20 rounded-full mx-auto border-2 border-[#F57C1F] mb-3" alt="" />
            <h4 className="font-black text-lg">{currentUser?.name}</h4>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">{currentUser?.role}</p>
          </div>
          <div className="mt-6 space-y-2">
            <button className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors text-sm">
              <FiUser className="text-[#F57C1F]" /> Account Settings
            </button>
            <button className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors text-sm">
              <FiSettings className="text-[#F57C1F]" /> Security
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors text-sm font-bold mt-2">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-[#2A1E14] p-2.5 rounded-xl border border-white/5 shadow-inner">
            <div className="grid grid-cols-2 gap-1 w-5 h-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#F57C1F] rounded-[2px]" />
              ))}
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setShowNotifPopup(!showNotifPopup); setShowProfilePopup(false); }}
            className="relative p-2 bg-[#2A1E14] rounded-full border border-white/5"
          >
            <FiBell className="text-xl text-gray-400" />
            <span className="absolute top-2 right-2 bg-[#F57C1F] w-2.5 h-2.5 rounded-full border-2 border-[#130F0A]" />
          </button>
          <button onClick={() => { setShowProfilePopup(!showProfilePopup); setShowNotifPopup(false); }}>
            <img 
              src={currentUser?.avatar} 
              className="w-10 h-10 rounded-full border-2 border-[#F57C1F]/30 object-cover cursor-pointer hover:scale-105 transition-transform" 
              alt="Admin" 
            />
          </button>
        </div>
      </div>

      {/* Period Tabs */}
      <div className="flex gap-8 mb-8 text-sm font-bold text-gray-500 overflow-x-auto no-scrollbar">
        {['Today', 'Week', 'Month', 'Year'].map(t => (
          <button 
            key={t} 
            onClick={() => setActivePeriod(t)}
            className={`transition-all duration-300 relative pb-2 ${activePeriod === t ? 'text-[#F57C1F]' : 'hover:text-gray-300'}`}
          >
            {t}
            {activePeriod === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F57C1F] rounded-full" />}
          </button>
        ))}
      </div>

      {/* Total Revenue Card */}
      <div className="bg-[#1C160E] rounded-[2.5rem] p-7 mb-6 border border-white/5 shadow-xl">
        <div className="flex justify-between items-start mb-2">
          <p className="text-gray-400 text-sm font-medium">Total Revenue ({activePeriod})</p>
          <div className="p-2 bg-[#F57C1F]/10 rounded-lg text-[#F57C1F]"><FiDollarSign size={20} /></div>
        </div>
        <h2 className="text-4xl font-black mb-3 tracking-tight">{stats.totalRevenue}</h2>
        <p className="text-[#4ADE80] text-sm font-bold flex items-center gap-1">
          <FiTrendingUp /> {stats.revenueGrowth} <span className="text-gray-500 font-normal">vs previous</span>
        </p>
      </div>

      {/* Small Stats Grid */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        <div className="bg-[#1C160E] p-6 rounded-[2.5rem] border border-white/5 shadow-lg">
          <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.15em] mb-2">Active Orders</p>
          <p className="text-3xl font-black italic">{stats.activeOrders}</p>
          <p className="text-[#4ADE80] text-xs font-bold mt-1">{stats.activeOrdersGrowth}</p>
        </div>
        <div className="bg-[#1C160E] p-6 rounded-[2.5rem] border border-white/5 shadow-lg">
          <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.15em] mb-2">New Users</p>
          <p className="text-3xl font-black italic">{stats.newUsers}</p>
          <p className="text-[#4ADE80] text-xs font-bold mt-1">{stats.newUsersGrowth}</p>
        </div>
      </div>

      {/* Sales Trends Chart */}
      <div className="bg-[#1C160E] rounded-[2.5rem] p-7 border border-white/5 mb-10 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div><h3 className="font-bold text-lg">Sales Trends</h3><p className="text-gray-500 text-xs mt-0.5">Revenue Growth</p></div>
          <button className="text-[#F57C1F] text-xs font-black uppercase tracking-widest border border-[#F57C1F]/20 px-4 py-2 rounded-full">Full Report</button>
        </div>
        <div className="mb-6 flex items-baseline gap-2">
          <span className="text-3xl font-black">{stats.trendsTotal}</span>
          <span className="text-[#4ADE80] text-sm font-bold">{stats.trendsGrowth}</span>
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F57C1F" stopOpacity={0.3}/><stop offset="95%" stopColor="#F57C1F" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip contentStyle={{ backgroundColor: '#1C160E', border: '1px solid #2A1E14', borderRadius: '12px' }} itemStyle={{ color: '#F57C1F' }} />
              <Area type="monotone" dataKey="value" stroke="#F57C1F" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" animationDuration={1000} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 700 }} dy={15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="mb-8">
        <h3 className="text-xl font-black italic mb-6">Recent Orders</h3>
        <div className="space-y-4">
          {displayedOrders.map((order) => (
            <div key={order.id} className="bg-[#1C160E] p-5 rounded-[2rem] border border-white/5 flex items-center gap-4 hover:border-[#F57C1F]/30 transition-colors cursor-pointer group">
              <div className="w-14 h-14 bg-[#2A1E14] rounded-2xl flex items-center justify-center text-2xl border border-white/5 group-hover:scale-105 transition-transform">{order.icon || "🛍️"}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-gray-100 group-hover:text-[#F57C1F] transition-colors">{order.name || order.restaurantName}</h4>
                  <span className={`text-sm font-black ${order.status === 'PAID' ? 'text-[#4ADE80]' : 'text-[#F57C1F]'}`}>{order.price || `$${order.grandTotal}`}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Order {order.id.toString().slice(-5)} • {order.time}</p>
                  <span className="text-[9px] font-black text-gray-500 tracking-[0.2em]">{order.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={() => setShowAllTransactions(!showAllTransactions)}
        className="w-full bg-[#1C160E] border border-[#F57C1F]/20 text-[#F57C1F] py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-[#F57C1F] hover:text-white transition-all shadow-xl active:scale-[0.98]"
      >
        {showAllTransactions ? "Show Less" : "View All Transactions"}
      </button>
    </div>
  );
};

export default AdminDashboard;
// import React, { useState } from 'react';
// import { FiBell, FiTrendingUp, FiDollarSign, FiLogOut, FiSettings, FiUser, FiX } from 'react-icons/fi';
// import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
// import { adminDashboardData } from '../../utils/data';
// import {useNavigate} from 'react-router-dom';

// const AdminDashboard = () => {
//   const [activePeriod, setActivePeriod] = useState('Week');
//   const [showAllTransactions, setShowAllTransactions] = useState(false);
  
//   // NEW: Pop-up States
//   const [showNotifPopup, setShowNotifPopup] = useState(false);
//   const [showProfilePopup, setShowProfilePopup] = useState(false);

//   const stats = adminDashboardData.periodStats[activePeriod];
//   const chartData = adminDashboardData.charts[activePeriod];
//   const { notifications, adminProfile } = adminDashboardData;
  
//   const displayedOrders = showAllTransactions 
//     ? adminDashboardData.recentOrders 
//     : adminDashboardData.recentOrders.slice(0, 3);
  
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('loggedInUserEmail');
//     localStorage.removeItem('userToken');
//     navigate('/', { replace: true });
    
//   };

//   return (
//     <div className="min-h-screen bg-[#130F0A] text-white p-6 pb-28 relative">
      
//       {/* --- POPUP: NOTIFICATIONS --- */}
//       {showNotifPopup && (
//         <div className="absolute top-20 right-6 w-80 bg-[#1C160E] border border-[#F57C1F]/20 rounded-3xl shadow-2xl z-[100] p-5 animate-in fade-in zoom-in duration-200 backdrop-blur-xl">
//           <div className="flex justify-between items-center mb-4">
//             <h4 className="font-black uppercase text-xs tracking-widest text-[#F57C1F]">Notifications</h4>
//             <button onClick={() => setShowNotifPopup(false)}><FiX /></button>
//           </div>
//           <div className="space-y-4">
//             {notifications.map(n => (
//               <div key={n.id} className="border-b border-white/5 pb-3 last:border-0">
//                 <p className="font-bold text-sm">{n.title}</p>
//                 <p className="text-gray-500 text-xs mt-1">{n.message}</p>
//                 <p className="text-[#F57C1F] text-[9px] font-bold mt-1 uppercase">{n.time}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* --- POPUP: PROFILE --- */}
//       {showProfilePopup && (
//         <div className="absolute top-20 right-6 w-72 bg-[#1C160E] border border-[#F57C1F]/20 rounded-3xl shadow-2xl z-[100] p-6 animate-in fade-in zoom-in duration-200 backdrop-blur-xl">
//           <div className="flex justify-end mb-2">
//             <button onClick={() => setShowProfilePopup(false)}><FiX /></button>
//           </div>
//           <div className="text-center">
//             <img src={adminProfile.avatar} className="w-20 h-20 rounded-full mx-auto border-2 border-[#F57C1F] mb-3" alt="" />
//             <h4 className="font-black text-lg">{adminProfile.name}</h4>
//             <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">{adminProfile.role}</p>
//           </div>
//           <div className="mt-6 space-y-2">
//             <button className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors text-sm">
//               <FiUser className="text-[#F57C1F]" /> Account Settings
//             </button>
//             <button className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors text-sm">
//               <FiSettings className="text-[#F57C1F]" /> Security
//             </button>
//             <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors text-sm font-bold mt-2">
//               <FiLogOut /> Logout
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div className="flex items-center gap-3">
//           <div className="bg-[#2A1E14] p-2.5 rounded-xl border border-white/5 shadow-inner">
//             <div className="grid grid-cols-2 gap-1 w-5 h-5">
//               {[...Array(4)].map((_, i) => (
//                 <div key={i} className="bg-[#F57C1F] rounded-[2px]" />
//               ))}
//             </div>
//           </div>
//           <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
//         </div>
//         <div className="flex items-center gap-4">
//           <button 
//             onClick={() => { setShowNotifPopup(!showNotifPopup); setShowProfilePopup(false); }}
//             className="relative p-2 bg-[#2A1E14] rounded-full border border-white/5"
//           >
//             <FiBell className="text-xl text-gray-400" />
//             <span className="absolute top-2 right-2 bg-[#F57C1F] w-2.5 h-2.5 rounded-full border-2 border-[#130F0A]" />
//           </button>
//           <button onClick={() => { setShowProfilePopup(!showProfilePopup); setShowNotifPopup(false); }}>
//             <img 
//               src={adminProfile.avatar} 
//               className="w-10 h-10 rounded-full border-2 border-[#F57C1F]/30 object-cover cursor-pointer hover:scale-105 transition-transform" 
//               alt="Admin" 
//             />
//           </button>
//         </div>
//       </div>

//       {/* Period Tabs */}
//       <div className="flex gap-8 mb-8 text-sm font-bold text-gray-500 overflow-x-auto no-scrollbar">
//         {['Today', 'Week', 'Month', 'Year'].map(t => (
//           <button 
//             key={t} 
//             onClick={() => setActivePeriod(t)}
//             className={`transition-all duration-300 relative pb-2 ${activePeriod === t ? 'text-[#F57C1F]' : 'hover:text-gray-300'}`}
//           >
//             {t}
//             {activePeriod === t && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F57C1F] rounded-full" />}
//           </button>
//         ))}
//       </div>

//       {/* Total Revenue Card */}
//       <div className="bg-[#1C160E] rounded-[2.5rem] p-7 mb-6 border border-white/5 shadow-xl">
//         <div className="flex justify-between items-start mb-2">
//           <p className="text-gray-400 text-sm font-medium">Total Revenue ({activePeriod})</p>
//           <div className="p-2 bg-[#F57C1F]/10 rounded-lg text-[#F57C1F]"><FiDollarSign size={20} /></div>
//         </div>
//         <h2 className="text-4xl font-black mb-3 tracking-tight">{stats.totalRevenue}</h2>
//         <p className="text-[#4ADE80] text-sm font-bold flex items-center gap-1">
//           <FiTrendingUp /> {stats.revenueGrowth} <span className="text-gray-500 font-normal">vs previous</span>
//         </p>
//       </div>

//       {/* Small Stats Grid */}
//       <div className="grid grid-cols-2 gap-5 mb-8">
//         <div className="bg-[#1C160E] p-6 rounded-[2.5rem] border border-white/5 shadow-lg">
//           <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.15em] mb-2">Active Orders</p>
//           <p className="text-3xl font-black italic">{stats.activeOrders}</p>
//           <p className="text-[#4ADE80] text-xs font-bold mt-1">{stats.activeOrdersGrowth}</p>
//         </div>
//         <div className="bg-[#1C160E] p-6 rounded-[2.5rem] border border-white/5 shadow-lg">
//           <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.15em] mb-2">New Users</p>
//           <p className="text-3xl font-black italic">{stats.newUsers}</p>
//           <p className="text-[#4ADE80] text-xs font-bold mt-1">{stats.newUsersGrowth}</p>
//         </div>
//       </div>

//       {/* Sales Trends Chart */}
//       <div className="bg-[#1C160E] rounded-[2.5rem] p-7 border border-white/5 mb-10 shadow-xl">
//         <div className="flex justify-between items-center mb-6">
//           <div><h3 className="font-bold text-lg">Sales Trends</h3><p className="text-gray-500 text-xs mt-0.5">Revenue Growth</p></div>
//           <button className="text-[#F57C1F] text-xs font-black uppercase tracking-widest border border-[#F57C1F]/20 px-4 py-2 rounded-full">Full Report</button>
//         </div>
//         <div className="mb-6 flex items-baseline gap-2">
//           <span className="text-3xl font-black">{stats.trendsTotal}</span>
//           <span className="text-[#4ADE80] text-sm font-bold">{stats.trendsGrowth}</span>
//         </div>
//         <div className="h-40 w-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart data={chartData}>
//               <defs>
//                 <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#F57C1F" stopOpacity={0.3}/><stop offset="95%" stopColor="#F57C1F" stopOpacity={0}/>
//                 </linearGradient>
//               </defs>
//               <Tooltip contentStyle={{ backgroundColor: '#1C160E', border: '1px solid #2A1E14', borderRadius: '12px' }} itemStyle={{ color: '#F57C1F' }} />
//               <Area type="monotone" dataKey="value" stroke="#F57C1F" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" animationDuration={1000} />
//               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 700 }} dy={15} />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Recent Orders Section */}
//       <div className="mb-8">
//         <h3 className="text-xl font-black italic mb-6">Recent Orders</h3>
//         <div className="space-y-4">
//           {displayedOrders.map((order) => (
//             <div key={order.id} className="bg-[#1C160E] p-5 rounded-[2rem] border border-white/5 flex items-center gap-4 hover:border-[#F57C1F]/30 transition-colors cursor-pointer group">
//               <div className="w-14 h-14 bg-[#2A1E14] rounded-2xl flex items-center justify-center text-2xl border border-white/5 group-hover:scale-105 transition-transform">{order.icon}</div>
//               <div className="flex-1">
//                 <div className="flex justify-between items-start">
//                   <h4 className="font-bold text-sm text-gray-100 group-hover:text-[#F57C1F] transition-colors">{order.name}</h4>
//                   <span className={`text-sm font-black ${order.status === 'PAID' ? 'text-[#4ADE80]' : 'text-[#F57C1F]'}`}>{order.price}</span>
//                 </div>
//                 <div className="flex justify-between items-center mt-1">
//                   <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Order {order.id} • {order.time}</p>
//                   <span className="text-[9px] font-black text-gray-500 tracking-[0.2em]">{order.status}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <button 
//         onClick={() => setShowAllTransactions(!showAllTransactions)}
//         className="w-full bg-[#1C160E] border border-[#F57C1F]/20 text-[#F57C1F] py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-[#F57C1F] hover:text-white transition-all shadow-xl active:scale-[0.98]"
//       >
//         {showAllTransactions ? "Show Less" : "View All Transactions"}
//       </button>
//     </div>
//   );
// };

// export default AdminDashboard;