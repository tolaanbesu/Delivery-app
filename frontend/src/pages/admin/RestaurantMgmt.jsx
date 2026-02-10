import React, { useState, useContext } from 'react';
import { 
  FiPlus, FiSearch, FiMapPin, FiEdit2, FiTrash2, FiMenu, 
  FiUser, FiGrid, FiFileText, FiShoppingBag, FiSettings, FiX, FiChevronDown, FiChevronUp 
} from 'react-icons/fi';

// IMPORTING FROM APPSTORE INSTEAD OF data.js
import { AppContext } from '../../store/AppStore';

const RestaurantMgmt = () => {
  const [state, dispatch] = useContext(AppContext); // get state from context

  // --- State Logic ---
  const [restaurants, setRestaurants] = useState(state.restaurants);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', location: '', status: 'Active' });
  const [showAll, setShowAll] = useState(false);

  // --- Handlers ---
  const filteredData = (restaurants || []).filter(res => {
    // 1. Handle Status
    const status = res.status || 'Active'; 
    const matchesFilter = filter === 'All' || status === filter;
    
    // 2. Safely get Name
    const resName = String(res.name || "").toLowerCase();

    // 3. FIX: Check 'address' (lowercase) and avoid searching the 'location' object
    // In your data, 'address' is the string, 'location' is the {lat, lng} object.
    const resAddress = typeof res.address === 'string' ? res.address.toLowerCase() : "";
    
    const search = searchQuery.toLowerCase();

    // 4. Perform Search
    const matchesSearch = resName.includes(search) || resAddress.includes(search);
    
    return matchesFilter && matchesSearch;
  });

  const displayedData = showAll ? filteredData : filteredData.slice(0, 3);

  const handleOpenModal = (res = null) => {
    if (res) {
      setFormData({
        id: res.id,
        name: res.name,
        location: res.Address || res.location,
        status: res.status || 'Active'
      });
    } else {
      setFormData({ id: null, name: '', location: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (formData.id) {
      setRestaurants(restaurants.map(r => r.id === formData.id ? { ...r, name: formData.name, Address: formData.location, status: formData.status } : r));
    } else {
      setRestaurants([...restaurants, { ...formData, id: Date.now(), img: "https://via.placeholder.com/150", Address: formData.location }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this restaurant partner?")) {
      setRestaurants(restaurants.filter(r => r.id !== id));
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#130F0A] h-screen flex flex-col text-[#EDE8E2] font-sans overflow-hidden">
      
      {/* --- POPUP MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div className="bg-[#1C160E] w-full max-w-[320px] rounded-[2.5rem] border border-white/10 p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-[#F57C1F] text-xs uppercase tracking-widest">
                {formData.id ? 'Edit Partner' : 'New Partner'}
              </h2>
              <FiX onClick={() => setIsModalOpen(false)} className="cursor-pointer text-gray-500" />
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input required placeholder="Restaurant Name" className="w-full bg-[#130F0A] border border-white/5 rounded-xl p-4 text-xs outline-none focus:border-[#F57C1F]" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required placeholder="Location (e.g. Brooklyn, NY)" className="w-full bg-[#130F0A] border border-white/5 rounded-xl p-4 text-xs outline-none focus:border-[#F57C1F]" 
                value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              <select className="w-full bg-[#130F0A] border border-white/5 rounded-xl p-4 text-xs outline-none focus:border-[#F57C1F] text-gray-400"
                value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button type="submit" className="w-full bg-[#F57C1F] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest">Confirm Partner</button>
            </form>
          </div>
        </div>
      )}

      {/* --- Header --- */}
      <div className="px-6 pt-6 pb-4 flex justify-between items-center">
        <FiMenu className="text-[#F57C1F] text-2xl" />
        <h1 className="font-bold text-lg">Manage Restaurants</h1>
        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
          <FiUser className="text-white text-lg" />
        </div>
      </div>

      {/* --- Scrollable Content Area --- */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        
        {/* Add Button */}
        <button onClick={() => handleOpenModal()} className="w-full bg-[#F57C1F] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 mb-6 mt-2 shadow-lg shadow-orange-950/20">
          <FiPlus className="text-xl" /> Add New Restaurant
        </button>

        {/* Search Bar */}
        <div className="relative mb-6">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#2A1E14] border-none rounded-2xl py-4 pl-12 pr-4 text-sm placeholder-gray-500 outline-none" 
            placeholder="Search by name or city..." 
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8">
          {['All', 'Active', 'Inactive'].map((t) => (
            <button 
              key={t}
              onClick={() => {setFilter(t); setShowAll(false);}} // Reset show more when filter changes
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${filter === t ? 'bg-[#F57C1F] text-white' : 'bg-[#2A1E14] text-gray-400'}`}
            >
              {t}{t === 'All' ? ` (${restaurants.length})` : ''}
            </button>
          ))}
        </div>

        <h3 className="font-bold text-lg mb-4">Restaurant Partners</h3>

        {/* Restaurant Cards */}
        <div className="space-y-4">
          {displayedData.map((res) => (
            <div key={res.id} className="bg-[#1C160E] rounded-[2rem] p-6 border border-white/5">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="bg-[#3D2C1E] w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner overflow-hidden">
                    {res.img ? <img src={res.img} className="w-full h-full object-cover" /> : <span className="opacity-80">{res.icon}</span>}
                  </div>
                  <div>
                    <p className="font-bold text-base leading-tight">{res.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
  <FiMapPin className="text-[10px]" /> {res.address || res.locationName || "No address provided"}
</p>
                  </div>
                </div>
                <span className={`text-[9px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest ${
                  (res.status || 'Active') === 'Active' ? 'bg-[#1B2E21] text-[#4ADE80]' : 'bg-[#2D1A1A] text-[#F87171]'
                }`}>
                  {res.status || 'Active'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleOpenModal(res)} className="bg-[#2A1E14] py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs hover:bg-[#3D2C1E] transition-colors">
                  <FiEdit2 className="text-[#F57C1F] text-sm" /> Edit
                </button>
                <button onClick={() => handleDelete(res.id)} className="bg-[#2D1A1A] py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs text-[#F87171] hover:bg-red-950/30 transition-colors">
                  <FiTrash2 className="text-sm" /> Delete
                </button>
              </div>
            </div>
          ))}

          {/* SHOW MORE / SHOW LESS BUTTON */}
          {filteredData.length > 3 && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="w-full py-4 flex items-center justify-center gap-2 text-[#F57C1F] font-black text-[10px] uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
              {showAll ? (
                <><FiChevronUp className="text-sm" /> Show Less</>
              ) : (
                <><FiChevronDown className="text-sm" /> Show More ({filteredData.length - 3} more)</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <div className="bg-[#130F0A] border-t border-white/5 px-8 py-4 flex justify-between items-center fixed bottom-0 w-full max-w-md">
        <div className="flex flex-col items-center gap-1 opacity-40">
          <FiGrid size={20} />
          <span className="text-[9px] font-bold">Dashboard</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-40">
          <FiFileText size={20} />
          <span className="text-[9px] font-bold">Orders</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-[#F57C1F]">
          <FiShoppingBag size={20} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Partners</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-40">
          <FiSettings size={20} />
          <span className="text-[9px] font-bold">Settings</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMgmt;
// import React, { useState } from 'react';
// import { 
//   FiPlus, FiSearch, FiMapPin, FiEdit2, FiTrash2, FiMenu, 
//   FiUser, FiGrid, FiFileText, FiShoppingBag, FiSettings, FiX, FiChevronDown, FiChevronUp 
// } from 'react-icons/fi';
// // IMPORTING THE SHARED DATA
// import { allRestaurants } from '../../utils/data';

// const RestaurantMgmt = () => {
//   // --- State Logic ---
//   const [restaurants, setRestaurants] = useState(allRestaurants);
//   const [filter, setFilter] = useState('All');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({ id: null, name: '', location: '', status: 'Active' });
  
//   // New State for "Show More" functionality
//   const [showAll, setShowAll] = useState(false);

//   // --- Handlers ---
//   const filteredData = restaurants.filter(res => {
//     const status = res.status || 'Active'; 
//     const matchesFilter = filter === 'All' || status === filter;
//     const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
//                           (res.Address || "").toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesFilter && matchesSearch;
//   });

//   // Logic to determine which items to display
//   const displayedData = showAll ? filteredData : filteredData.slice(0, 3);

//   const handleOpenModal = (res = null) => {
//     if (res) {
//       setFormData({
//         id: res.id,
//         name: res.name,
//         location: res.Address || res.location,
//         status: res.status || 'Active'
//       });
//     } else {
//       setFormData({ id: null, name: '', location: '', status: 'Active' });
//     }
//     setIsModalOpen(true);
//   };

//   const handleSave = (e) => {
//     e.preventDefault();
//     if (formData.id) {
//       setRestaurants(restaurants.map(r => r.id === formData.id ? { ...r, name: formData.name, Address: formData.location, status: formData.status } : r));
//     } else {
//       setRestaurants([...restaurants, { ...formData, id: Date.now(), img: "https://via.placeholder.com/150", Address: formData.location }]);
//     }
//     setIsModalOpen(false);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Delete this restaurant partner?")) {
//       setRestaurants(restaurants.filter(r => r.id !== id));
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-[#130F0A] h-screen flex flex-col text-[#EDE8E2] font-sans overflow-hidden">
      
//       {/* --- POPUP MODAL --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
//           <div className="bg-[#1C160E] w-full max-w-[320px] rounded-[2.5rem] border border-white/10 p-8 shadow-2xl">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="font-bold text-[#F57C1F] text-xs uppercase tracking-widest">
//                 {formData.id ? 'Edit Partner' : 'New Partner'}
//               </h2>
//               <FiX onClick={() => setIsModalOpen(false)} className="cursor-pointer text-gray-500" />
//             </div>
//             <form onSubmit={handleSave} className="space-y-4">
//               <input required placeholder="Restaurant Name" className="w-full bg-[#130F0A] border border-white/5 rounded-xl p-4 text-xs outline-none focus:border-[#F57C1F]" 
//                 value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
//               <input required placeholder="Location (e.g. Brooklyn, NY)" className="w-full bg-[#130F0A] border border-white/5 rounded-xl p-4 text-xs outline-none focus:border-[#F57C1F]" 
//                 value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
//               <select className="w-full bg-[#130F0A] border border-white/5 rounded-xl p-4 text-xs outline-none focus:border-[#F57C1F] text-gray-400"
//                 value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//               <button type="submit" className="w-full bg-[#F57C1F] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest">Confirm Partner</button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* --- Header --- */}
//       <div className="px-6 pt-6 pb-4 flex justify-between items-center">
//         <FiMenu className="text-[#F57C1F] text-2xl" />
//         <h1 className="font-bold text-lg">Manage Restaurants</h1>
//         <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
//           <FiUser className="text-white text-lg" />
//         </div>
//       </div>

//       {/* --- Scrollable Content Area --- */}
//       <div className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        
//         {/* Add Button */}
//         <button onClick={() => handleOpenModal()} className="w-full bg-[#F57C1F] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 mb-6 mt-2 shadow-lg shadow-orange-950/20">
//           <FiPlus className="text-xl" /> Add New Restaurant
//         </button>

//         {/* Search Bar */}
//         <div className="relative mb-6">
//           <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
//           <input 
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full bg-[#2A1E14] border-none rounded-2xl py-4 pl-12 pr-4 text-sm placeholder-gray-500 outline-none" 
//             placeholder="Search by name or city..." 
//           />
//         </div>

//         {/* Filters */}
//         <div className="flex gap-3 mb-8">
//           {['All', 'Active', 'Inactive'].map((t) => (
//             <button 
//               key={t}
//               onClick={() => {setFilter(t); setShowAll(false);}} // Reset show more when filter changes
//               className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${filter === t ? 'bg-[#F57C1F] text-white' : 'bg-[#2A1E14] text-gray-400'}`}
//             >
//               {t}{t === 'All' ? ` (${restaurants.length})` : ''}
//             </button>
//           ))}
//         </div>

//         <h3 className="font-bold text-lg mb-4">Restaurant Partners</h3>

//         {/* Restaurant Cards */}
//         <div className="space-y-4">
//           {displayedData.map((res) => (
//             <div key={res.id} className="bg-[#1C160E] rounded-[2rem] p-6 border border-white/5">
//               <div className="flex justify-between items-start mb-6">
//                 <div className="flex gap-4">
//                   <div className="bg-[#3D2C1E] w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner overflow-hidden">
//                     {res.img ? <img src={res.img} className="w-full h-full object-cover" /> : <span className="opacity-80">{res.icon}</span>}
//                   </div>
//                   <div>
//                     <p className="font-bold text-base leading-tight">{res.name}</p>
//                     <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
//                       <FiMapPin className="text-[10px]" /> {res.Address || res.location}
//                     </p>
//                   </div>
//                 </div>
//                 <span className={`text-[9px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest ${
//                   (res.status || 'Active') === 'Active' ? 'bg-[#1B2E21] text-[#4ADE80]' : 'bg-[#2D1A1A] text-[#F87171]'
//                 }`}>
//                   {res.status || 'Active'}
//                 </span>
//               </div>
              
//               <div className="grid grid-cols-2 gap-3">
//                 <button onClick={() => handleOpenModal(res)} className="bg-[#2A1E14] py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs hover:bg-[#3D2C1E] transition-colors">
//                   <FiEdit2 className="text-[#F57C1F] text-sm" /> Edit
//                 </button>
//                 <button onClick={() => handleDelete(res.id)} className="bg-[#2D1A1A] py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs text-[#F87171] hover:bg-red-950/30 transition-colors">
//                   <FiTrash2 className="text-sm" /> Delete
//                 </button>
//               </div>
//             </div>
//           ))}

//           {/* SHOW MORE / SHOW LESS BUTTON */}
//           {filteredData.length > 3 && (
//             <button 
//               onClick={() => setShowAll(!showAll)}
//               className="w-full py-4 flex items-center justify-center gap-2 text-[#F57C1F] font-black text-[10px] uppercase tracking-widest hover:opacity-80 transition-opacity"
//             >
//               {showAll ? (
//                 <><FiChevronUp className="text-sm" /> Show Less</>
//               ) : (
//                 <><FiChevronDown className="text-sm" /> Show More ({filteredData.length - 3} more)</>
//               )}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* --- Bottom Navigation --- */}
//       <div className="bg-[#130F0A] border-t border-white/5 px-8 py-4 flex justify-between items-center fixed bottom-0 w-full max-w-md">
//         <div className="flex flex-col items-center gap-1 opacity-40">
//           <FiGrid size={20} />
//           <span className="text-[9px] font-bold">Dashboard</span>
//         </div>
//         <div className="flex flex-col items-center gap-1 opacity-40">
//           <FiFileText size={20} />
//           <span className="text-[9px] font-bold">Orders</span>
//         </div>
//         <div className="flex flex-col items-center gap-1 text-[#F57C1F]">
//           <FiShoppingBag size={20} />
//           <span className="text-[9px] font-bold uppercase tracking-widest">Partners</span>
//         </div>
//         <div className="flex flex-col items-center gap-1 opacity-40">
//           <FiSettings size={20} />
//           <span className="text-[9px] font-bold">Settings</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RestaurantMgmt;