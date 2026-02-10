import React, { useState, useEffect, useContext } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { 
  FiChevronLeft, FiSettings, FiEdit3, FiPackage, FiMapPin, 
  FiCreditCard, FiLogOut, FiChevronRight, FiAward, FiCheckCircle, FiClock 
} from 'react-icons/fi';
import { AppContext } from '../../store/AppStore';

const Profile = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useContext(AppContext);

  const loggedInEmail = localStorage.getItem('loggedInUserEmail'); 
  const currentUser = state.users.find(user => user.email === loggedInEmail);

  // --- TAB STATE ---
  const [activeTab, setActiveTab] = useState('general'); // 'general' or 'completed'

  // --- COMPLETED ORDERS STATE ---
  const [completedOrders, setCompletedOrders] = useState([]);

  // --- EDIT MODE STATE ---
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    avatar: currentUser?.avatar || ''
  });

  useEffect(() => {
  // 1. Get the global history
  const allOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');

  // 2. Filter to only show orders belonging to the current user's email
  const myOrders = allOrders.filter(order => order.user?.email === currentUser.email);

  // 3. Update your state with ONLY those orders
  setCompletedOrders(myOrders);
}, [currentUser.email]);

  if (!currentUser) return null;

  const menuItems = [
    { 
      icon: <FiPackage />, 
      label: "Order History", 
      sub: `${completedOrders.length || currentUser.menuinfo.history} Orders`, 
      color: "text-blue-400",
      path: "/orders"
    },
    { 
      icon: <FiMapPin />, 
      label: "Saved Addresses", 
      sub: currentUser.menuinfo.addressSummary, 
      color: "text-green-400",
      path: "/addresses"
    },
    { 
      icon: <FiCreditCard />, 
      label: "Payment Methods", 
      sub: currentUser.menuinfo.paymentSummary, 
      color: "text-purple-400",
      path: "/payment"
    },
    { 
      icon: <FiAward />, 
      label: "Rewards & Points", 
      sub: currentUser.menuinfo.rewards, 
      color: "text-[#F57C1F]",
      path: "/rewards"
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('loggedInUserEmail');
    localStorage.removeItem('userToken');
    navigate('/', { replace: true });
    // window.location.reload();
  };

  const handleSave = () => {
    currentUser.name = editData.name;
    currentUser.email = editData.email;
    currentUser.avatar = editData.avatar;
    setIsEditing(false);
    localStorage.setItem('loggedInUserEmail', editData.email);
  };

  return (
    <div className="max-w-md mx-auto bg-[#1C160E] min-h-screen text-[#EDE8E2] pb-24 font-sans">
      {/* Header */}
      <div className="relative h-64 bg-gradient-to-b from-[#F57C1F]/20 to-[#1C160E] px-6 pt-12">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => activeTab === 'completed' ? setActiveTab('general') : navigate(-1)} 
            className="p-3 bg-[#1C160E] rounded-xl border border-white/5 shadow-xl active:scale-90 transition-transform"
          >
            <FiChevronLeft />
          </button>
          <button className="p-3 bg-[#1C160E] rounded-xl border border-white/5 shadow-xl active:scale-90 transition-transform">
            <FiSettings />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center">
          <div className="relative group cursor-pointer">
            {isEditing ? (
              <input 
                type="text"
                value={editData.avatar}
                onChange={(e) => setEditData({...editData, avatar: e.target.value})}
                className="w-24 h-24 rounded-[2rem] border-4 border-[#1C160E] text-center text-sm object-cover shadow-2xl bg-[#2A1E14]"
                placeholder="Avatar URL"
              />
            ) : (
              <img 
                src={currentUser.avatar} 
                className="w-24 h-24 rounded-[2rem] border-4 border-[#1C160E] object-cover shadow-2xl group-hover:opacity-80 transition-opacity" 
                alt="profile" 
              />
            )}
            <button 
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
              className="absolute -bottom-1 -right-1 p-2 bg-[#F57C1F] rounded-lg border-2 border-[#1C160E] shadow-lg"
            >
              <FiEdit3 size={14} className="text-white" />
            </button>
          </div>

          {isEditing ? (
            <>
              <input 
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                className="mt-4 text-2xl font-black text-center w-full bg-[#2A1E14] border border-[#3D2C1E] rounded-xl p-2"
              />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-black mt-4 tracking-tight">{currentUser.name}</h2>
              <p className="text-[#8B7E6F] text-[10px] font-bold uppercase tracking-[0.2em]">{currentUser.email}</p>
            </>
          )}
        </div>
      </div>

      {/* TAB SELECTOR */}
      <div className="flex px-6 mt-6 gap-2">
        <button 
          onClick={() => setActiveTab('general')}
          className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'general' ? 'bg-[#F57C1F] text-white shadow-lg shadow-orange-900/20' : 'bg-[#2A1E14] text-[#8B7E6F] border border-white/5'}`}
        >
          General
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'completed' ? 'bg-[#F57C1F] text-white shadow-lg shadow-orange-900/20' : 'bg-[#2A1E14] text-[#8B7E6F] border border-white/5'}`}
        >
          Completed ({completedOrders.length})
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="px-6 mt-8">
        {activeTab === 'general' ? (
          /* GENERAL TAB CONTENT */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Row */}
            <div className="flex justify-between gap-4 mb-10">
              {Object.entries(currentUser.stats).map(([key, value]) => (
                <div key={key} className="flex-1 bg-[#2A1E14] p-4 rounded-2xl border border-white/5 text-center shadow-inner">
                  <p className="text-lg font-black text-white">{value}</p>
                  <p className="text-[10px] text-[#8B7E6F] font-bold uppercase tracking-tighter">{key}</p>
                </div>
              ))}
            </div>

            {/* Main Menu */}
            <div className="space-y-4">
              {menuItems.map((item, idx) => (
                <div 
                  key={idx} 
                  // onClick={() => navigate(item.path)}
                  className="group flex items-center justify-between p-5 bg-[#2A1E14] rounded-[2rem] border border-white/5 active:scale-[0.97] transition-all cursor-pointer hover:bg-[#32261a]"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl ${item.color} shadow-sm`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-black text-sm text-white">{item.label}</p>
                      <p className="text-[10px] text-[#8B7E6F] font-bold">{item.sub}</p>
                    </div>
                  </div>
                  <FiChevronRight className="text-[#3D2C1E] group-hover:text-[#F57C1F] group-hover:translate-x-1 transition-all" />
                </div>
              ))}

              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 p-5 mt-8 bg-red-500/10 border border-red-500/20 rounded-[2rem] text-red-400 font-black text-xs tracking-widest active:scale-95 transition-all hover:bg-red-500/20"
              >
                <FiLogOut />
                LOGOUT ACCOUNT
              </button>
            </div>
          </div>
        ) : (
          /* COMPLETED ORDERS TAB CONTENT */
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {completedOrders.length > 0 ? (
              completedOrders.map((order, idx) => (
                <div key={idx} className="bg-[#2A1E14] p-5 rounded-[2.5rem] border border-white/5 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-500/10 rounded-[1.5rem] flex items-center justify-center">
                      <FiCheckCircle className="text-green-500 text-2xl" />
                    </div>
                    <div>
                      <p className="font-black text-base text-white">{order.restaurantName}</p>
                      <div className="flex items-center gap-2 text-[#8B7E6F] text-[10px] font-bold uppercase mt-1">
                        <FiClock size={10} />
                        {new Date(order.completedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className="pr-2">
                    <div className="bg-[#F57C1F]/10 text-[#F57C1F] px-3 py-1 rounded-full text-[9px] font-black uppercase">
                      Delivered
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-[#2A1E14] rounded-[3rem] border border-white/5 border-dashed">
                <FiPackage className="mx-auto text-[#3D2C1E] text-5xl mb-4" />
                <p className="text-[#8B7E6F] font-black text-xs uppercase tracking-widest">No completed orders found</p>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-[#3D2C1E] text-[10px] font-bold mt-10 uppercase tracking-[0.3em]">
        Member Since {currentUser.memberSince}
      </p>
    </div>
  );
};

export default Profile;

// import React, { useState, useEffect } from 'react'; 
// import { useNavigate } from 'react-router-dom';
// import { FiChevronLeft, FiSettings, FiEdit3, FiPackage, FiMapPin, FiCreditCard, FiLogOut, FiChevronRight, FiAward } from 'react-icons/fi';
// import { userData } from '../../utils/data';

// const Profile = () => {
//   const navigate = useNavigate();

//   const loggedInEmail = localStorage.getItem('loggedInUserEmail'); 
//   const currentUser = userData.find(user => user.email === loggedInEmail);

//   // --- EDIT MODE STATE ---
//   const [isEditing, setIsEditing] = useState(false);
//   const [editData, setEditData] = useState({
//     name: currentUser?.name || '',
//     email: currentUser?.email || '',
//     avatar: currentUser?.avatar || ''
//   });

//   useEffect(() => {
//     if (!currentUser) {
//       navigate('/login', { replace: true });
//     }
//   }, [currentUser, navigate]);

//   if (!currentUser) return null;

//   const menuItems = [
//     { 
//       icon: <FiPackage />, 
//       label: "Order History", 
//       sub: currentUser.menuinfo.history, 
//       color: "text-blue-400",
//       path: "/orders"
//     },
//     { 
//       icon: <FiMapPin />, 
//       label: "Saved Addresses", 
//       sub: currentUser.menuinfo.addressSummary, 
//       color: "text-green-400",
//       path: "/addresses"
//     },
//     { 
//       icon: <FiCreditCard />, 
//       label: "Payment Methods", 
//       sub: currentUser.menuinfo.paymentSummary, 
//       color: "text-purple-400",
//       path: "/payment"
//     },
//     { 
//       icon: <FiAward />, 
//       label: "Rewards & Points", 
//       sub: currentUser.menuinfo.rewards, 
//       color: "text-[#F57C1F]",
//       path: "/rewards"
//     },
//   ];

//   const handleLogout = () => {
//     localStorage.removeItem('loggedInUserEmail');
//     localStorage.removeItem('userToken');
//     navigate('/', { replace: true });
//     window.location.reload();
//   };

//   const handleSave = () => {
//     // Update currentUser in memory
//     currentUser.name = editData.name;
//     currentUser.email = editData.email;
//     currentUser.avatar = editData.avatar;

//     setIsEditing(false);
//     localStorage.setItem('loggedInUserEmail', editData.email);
//   };

//   return (
//     <div className="max-w-md mx-auto bg-[#1C160E] min-h-screen text-[#EDE8E2] pb-24 font-sans">
//       {/* Header */}
//       <div className="relative h-64 bg-gradient-to-b from-[#F57C1F]/20 to-[#1C160E] px-6 pt-12">
//         <div className="flex justify-between items-center mb-8">
//           <button 
//             onClick={() => navigate(-1)} 
//             className="p-3 bg-[#1C160E] rounded-xl border border-white/5 shadow-xl active:scale-90 transition-transform"
//           >
//             <FiChevronLeft />
//           </button>
//           <button className="p-3 bg-[#1C160E] rounded-xl border border-white/5 shadow-xl active:scale-90 transition-transform">
//             <FiSettings />
//           </button>
//         </div>

//         {/* Profile Info */}
//         <div className="flex flex-col items-center">
//           <div className="relative group cursor-pointer">
//             {isEditing ? (
//               <input 
//                 type="text"
//                 value={editData.avatar}
//                 onChange={(e) => setEditData({...editData, avatar: e.target.value})}
//                 className="w-24 h-24 rounded-[2rem] border-4 border-[#1C160E] text-center text-sm object-cover shadow-2xl"
//                 placeholder="Avatar URL"
//               />
//             ) : (
//               <img 
//                 src={currentUser.avatar} 
//                 className="w-24 h-24 rounded-[2rem] border-4 border-[#1C160E] object-cover shadow-2xl group-hover:opacity-80 transition-opacity" 
//                 alt="profile" 
//               />
//             )}
//             <button 
//               onClick={() => {
//                 if (isEditing) handleSave();
//                 else setIsEditing(true);
//               }}
//               className="absolute -bottom-1 -right-1 p-2 bg-[#F57C1F] rounded-lg border-2 border-[#1C160E] shadow-lg"
//             >
//               <FiEdit3 size={14} className="text-white" />
//             </button>
//           </div>

//           {isEditing ? (
//             <>
//               <input 
//                 type="text"
//                 value={editData.name}
//                 onChange={(e) => setEditData({...editData, name: e.target.value})}
//                 className="mt-4 text-2xl font-black text-center w-full bg-[#2A1E14] border border-[#3D2C1E] rounded-xl p-2"
//               />
//               <input 
//                 type="email"
//                 value={editData.email}
//                 onChange={(e) => setEditData({...editData, email: e.target.value})}
//                 className="mt-2 text-xs text-center w-full bg-[#2A1E14] border border-[#3D2C1E] rounded-xl p-1"
//               />
//             </>
//           ) : (
//             <>
//               <h2 className="text-2xl font-black mt-4 tracking-tight">{currentUser.name}</h2>
//               <p className="text-[#8B7E6F] text-[10px] font-bold uppercase tracking-[0.2em]">{currentUser.email}</p>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Stats Row */}
//       <div className="flex justify-between px-8 mt-4 gap-4">
//         {Object.entries(currentUser.stats).map(([key, value]) => (
//           <div key={key} className="flex-1 bg-[#2A1E14] p-4 rounded-2xl border border-white/5 text-center shadow-inner">
//             <p className="text-lg font-black text-white">{value}</p>
//             <p className="text-[10px] text-[#8B7E6F] font-bold uppercase tracking-tighter">{key}</p>
//           </div>
//         ))}
//       </div>

//       {/* Main Menu */}
//       <div className="px-6 mt-10 space-y-4">
//         {menuItems.map((item, idx) => (
//           <div 
//             key={idx} 
//             onClick={() => navigate(item.path)}
//             className="group flex items-center justify-between p-5 bg-[#2A1E14] rounded-[2rem] border border-white/5 active:scale-[0.97] transition-all cursor-pointer hover:bg-[#32261a]"
//           >
//             <div className="flex items-center gap-4">
//               <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl ${item.color} shadow-sm`}>
//                 {item.icon}
//               </div>
//               <div>
//                 <p className="font-black text-sm text-white">{item.label}</p>
//                 <p className="text-[10px] text-[#8B7E6F] font-bold">{item.sub}</p>
//               </div>
//             </div>
//             <FiChevronRight className="text-[#3D2C1E] group-hover:text-[#F57C1F] group-hover:translate-x-1 transition-all" />
//           </div>
//         ))}

//         {/* Logout Button */}
//         <button 
//           onClick={handleLogout}
//           className="w-full flex items-center justify-center gap-3 p-5 mt-8 bg-red-500/10 border border-red-500/20 rounded-[2rem] text-red-400 font-black text-xs tracking-widest active:scale-95 transition-all hover:bg-red-500/20"
//         >
//           <FiLogOut />
//           LOGOUT ACCOUNT
//         </button>
//       </div>

//       <p className="text-center text-[#3D2C1E] text-[10px] font-bold mt-10 uppercase tracking-[0.3em]">
//         Member Since {currentUser.memberSince}
//       </p>
//     </div>
//   );
// };

// export default Profile;

