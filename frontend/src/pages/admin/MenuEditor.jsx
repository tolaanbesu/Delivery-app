import React, { useState, useContext } from 'react';
import { 
  FiChevronLeft, FiSearch, FiMenu, FiPlus, FiHelpCircle, FiInfo, 
  FiChevronDown, FiUploadCloud, FiTrash2, FiEdit2, FiClock, FiSettings, FiLayers, FiX 
} from 'react-icons/fi';

// IMPORTING FROM APPSTORE INSTEAD OF DATA.JS
import { AppContext } from '../../store/AppStore';

const MenuEditor = () => {
  const { 0: storeState } = useContext(AppContext); // get state from context

  const [activeTab, setActiveTab] = useState('Categories');
  const [expandedCategory, setExpandedCategory] = useState('Appetizers');
  const [menuData, setMenuData] = useState(storeState.menu);
  const [searchQuery, setSearchQuery] = useState('');

  // --- RESTAURANT SELECTION SYSTEM ---
  const [selectedRes, setSelectedRes] = useState(storeState.restaurants[0]);
  const [isResPickerOpen, setIsResPickerOpen] = useState(false);

  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: 'item', action: 'add', catId: null, itemId: null });
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });
  const [currency, setCurrency] = useState('USD ($)');
  const [autoPublish, setAutoPublish] = useState(true);
  const [availData, setAvailData] = useState([
    { day: 'Mon-Fri', hours: '08:00 AM - 11:00 PM' },
    { day: 'Sat', hours: '08:00 AM - 11:00 PM' },
    { day: 'Sun', hours: '08:00 AM - 11:00 PM' }
  ]);

  /* ============================
      FUNCTIONAL LOGIC
  ============================ */

  const openModal = (type, action, catId = null, item = null) => {
    setModalConfig({ type, action, catId, itemId: item?.id });
    setFormData({
      name: item?.name || '',
      price: item?.price || '',
      description: item?.description || ''
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const { type, action, catId, itemId } = modalConfig;

    if (type === 'help') {
      setIsModalOpen(false);
      return;
    }

    if (type === 'category') {
      const newCat = { id: `cat${Date.now()}`, name: formData.name, count: 0, status: 'Active', items: [] };
      setMenuData([...menuData, newCat]);
    } else {
      if (action === 'add') {
        const newItem = {
          id: `i${Date.now()}`,
          name: formData.name,
          price: parseFloat(formData.price) || 0,
          description: formData.description || "No description provided",
          img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120',
          active: true
        };
        setMenuData(prev => prev.map(cat => cat.id === catId ? { ...cat, items: [...cat.items, newItem] } : cat));
      } else {
        setMenuData(prev => prev.map(cat => ({
          ...cat,
          items: cat.items.map(item => item.id === itemId ? { ...item, name: formData.name, price: parseFloat(formData.price), description: formData.description } : item)
        })));
      }
    }
    setIsModalOpen(false);
  };

  const filteredMenu = menuData.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0 || searchQuery === '');

  const handleDeleteItem = (catId, itemId) => {
    if (window.confirm("Delete item?")) {
      setMenuData(prev => prev.map(cat => cat.id === catId ? { ...cat, items: cat.items.filter(i => i.id !== itemId) } : cat));
    }
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Delete category?")) {
      setMenuData(menuData.filter(c => c.id !== id));
    }
  };

  /* ============================
      TAB RENDERING
  ============================ */

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Items':
        return (
          <div className="space-y-4">
            {menuData.flatMap(c => c.items.map(i => ({ ...i, catId: c.id }))).map(item => (
              <div key={item.id} className="bg-[#1C160E] p-4 rounded-2xl flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-4">
                  <img src={item.img} className="w-10 h-10 rounded-lg object-cover" alt="" />
                  <div>
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="text-[10px] text-[#F57C1F] font-black">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <FiEdit2 onClick={() => openModal('item', 'edit', item.catId, item)} className="text-gray-500" />
                  <FiTrash2 onClick={() => handleDeleteItem(item.catId, item.id)} className="text-gray-500" />
                </div>
              </div>
            ))}
          </div>
        );
      case 'Availability':
        return (
          <div className="bg-[#1C160E] p-6 rounded-3xl border border-white/5 space-y-4">
             <h3 className="font-bold mb-2 flex items-center gap-2 text-sm"><FiClock className="text-[#F57C1F]" /> Operating Hours</h3>
             {availData.map((item, idx) => (
               <div key={item.day} className="flex justify-between items-center text-xs">
                 <span className="text-gray-500">{item.day}</span>
                 <input className="bg-transparent text-right font-bold text-[#F57C1F] outline-none border-b border-transparent focus:border-white/10" value={item.hours} onChange={(e) => {
                   const n = [...availData]; n[idx].hours = e.target.value; setAvailData(n);
                 }} />
               </div>
             ))}
          </div>
        );
      case 'Settings':
        return (
          <div className="space-y-3">
            <div className="bg-[#1C160E] p-5 rounded-2xl border border-white/5 flex justify-between items-center">
              <span className="text-sm font-bold">Currency</span>
              <input className="bg-transparent text-right text-[#F57C1F] font-black uppercase text-xs outline-none" value={currency} onChange={e => setCurrency(e.target.value)} />
            </div>
            <div className="bg-[#1C160E] p-5 rounded-2xl border border-white/5 flex justify-between items-center">
              <span className="text-sm font-bold">Auto-Publish</span>
              <div onClick={() => setAutoPublish(!autoPublish)} className={`w-10 h-5 rounded-full relative transition-colors ${autoPublish ? 'bg-[#F57C1F]' : 'bg-gray-700'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${autoPublish ? 'right-1' : 'left-1'}`} />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div className="relative mb-6">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-[#1C160E] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-[#F57C1F]/40" placeholder="Search menu..." />
            </div>
            {filteredMenu.map(category => (
              <div key={category.id} className="bg-[#1C160E] rounded-[2rem] border border-white/5 overflow-hidden">
                <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}>
                  <div className="flex items-center gap-4">
                    <FiMenu className="text-gray-600" />
                    <h3 className="font-bold text-sm">{category.name}</h3>
                  </div>
                  <FiChevronDown className={expandedCategory === category.name ? 'rotate-180' : ''} />
                </div>
                {expandedCategory === category.name && (
                  <div className="px-5 pb-5 space-y-4">
                    {category.items.map(item => (
                      <div key={item.id} className="flex items-center gap-4 bg-[#130F0A]/40 p-3 rounded-2xl border border-white/5">
                        <img src={item.img} className="w-12 h-12 rounded-xl object-cover" alt="" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-bold text-xs">{item.name}</h4>
                            <div className="flex gap-2">
                               <FiEdit2 onClick={(e) => { e.stopPropagation(); openModal('item', 'edit', category.id, item); }} className="text-gray-600 cursor-pointer" size={12} />
                               <FiTrash2 onClick={(e) => { e.stopPropagation(); handleDeleteItem(category.id, item.id); }} className="text-gray-600 cursor-pointer" size={12} />
                            </div>
                          </div>
                          <p className="text-[#F57C1F] font-black text-[10px]">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => openModal('item', 'add', category.id)} className="w-full border-2 border-dashed border-white/5 rounded-2xl py-3 text-[10px] font-black text-gray-500 flex items-center justify-center gap-2 uppercase tracking-widest hover:border-[#F57C1F]/40 hover:text-white transition-all"><FiPlus /> Add Item</button>
                  </div>
                )}
              </div>
            ))}
            <button onClick={() => openModal('category', 'add')} className="w-full py-4 text-[#F57C1F] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2"><FiPlus /> New Category</button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#130F0A] h-screen overflow-y-auto text-[#EDE8E2] pb-10 font-sans scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      
      {/* --- RESTAURANT PICKER MODAL --- */}
      {isResPickerOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-6">
          <div className="bg-[#1C160E] w-full max-w-[320px] rounded-[2.5rem] border border-white/10 p-8 shadow-2xl">
            <h2 className="text-[#F57C1F] text-[10px] font-black uppercase mb-6 text-center tracking-widest">Select Partner</h2>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-hide">
              {storeState.restaurants.map(res => (
                <button 
                  key={res.id} 
                  onClick={() => { setSelectedRes(res); setIsResPickerOpen(false); }}
                  className={`w-full p-4 rounded-2xl text-left transition-all border ${selectedRes.id === res.id ? 'bg-[#F57C1F] border-transparent' : 'bg-white/5 border-white/5'}`}
                >
                  <p className="font-bold text-xs">{res.name}</p>
                  <p className="text-[9px] opacity-60 mt-1 uppercase tracking-tighter">{res.Address}</p>
                </button>
              ))}
            </div>
            <button onClick={() => setIsResPickerOpen(false)} className="w-full mt-6 text-gray-500 font-bold text-[10px] uppercase">Cancel</button>
          </div>
        </div>
      )}

      {/* --- POPUP MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div className="bg-[#1C160E] w-full max-w-[500px] rounded-[2.5rem] border border-white/10 p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-base text-[#F57C1F] uppercase tracking-wider">
                {modalConfig.type === 'help' ? 'Help Center' : (modalConfig.action === 'add' ? 'New ' : 'Edit ') + modalConfig.type}
              </h2>
              <FiX onClick={() => setIsModalOpen(false)} className="cursor-pointer text-gray-500 hover:text-white transition-colors" />
            </div>

            {modalConfig.type === 'help' ? (
              <div className="space-y-4 text-xs leading-relaxed text-gray-400">
                <p>• <b className="text-white">Categories:</b> Use this tab to group your food items.</p>
                <p>• <b className="text-white">Items:</b> Manage your full inventory and prices here.</p>
                <p>• <b className="text-white">Auto-Publish:</b> When active, saves go live immediately.</p>
                <button onClick={() => setIsModalOpen(false)} className="w-full bg-white/5 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest mt-4">Close</button>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <input required placeholder="Name" autoFocus className="w-full bg-[#130F0A] border border-white/5 rounded-xl p-4 text-xs outline-none focus:border-[#F57C1F]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                {modalConfig.type === 'item' && (
                  <>
                    <input required type="number" step="0.01" placeholder="Price" className="w-full bg-[#130F0A] border border-white/5 rounded-xl p-4 text-xs outline-none focus:border-[#F57C1F]" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    <textarea placeholder="Description" className="w-full bg-[#130F0A] border border-white/5 rounded-xl p-4 text-xs h-20 outline-none focus:border-[#F57C1F]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </>
                )}
                <button type="submit" className="w-full bg-[#F57C1F] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-900/20">Confirm Changes</button>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <FiChevronLeft className="text-[#F57C1F] text-2xl cursor-pointer" />
          <div className="text-center cursor-pointer group" onClick={() => setIsResPickerOpen(true)}>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-lg font-bold group-hover:text-[#F57C1F] transition-colors">{selectedRes.name}</h1>
              <FiChevronDown className="text-[#F57C1F]" />
            </div>
            <p className="text-[#F57C1F] text-[10px] font-black uppercase tracking-[0.2em]">{selectedRes.Address}</p>
          </div>
          <button onClick={() => alert("Draft Saved")} className="text-[#F57C1F] font-bold text-sm">Save</button>
        </div>

        <div className="flex justify-between mb-8 border-b border-white/5 text-[11px] font-black uppercase tracking-widest text-gray-500">
          {['Categories', 'Items', 'Availability', 'Settings'].map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} className={`pb-3 transition-all ${activeTab === t ? 'text-white border-b-2 border-[#F57C1F]' : ''}`}>{t}</button>
          ))}
        </div>
        {renderTabContent()}
      </div>

      <div className="px-6 mt-8 flex flex-col gap-6">
        <button onClick={() => openModal('help')} className="self-end bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
          <FiHelpCircle className="text-[#130F0A] text-2xl" />
        </button>
        <div className="flex items-center justify-between gap-4 pb-10">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Status</span>
            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full" /><span className="text-[10px] font-bold">Live</span></div>
          </div>
          <button onClick={() => alert("Published")} className="flex-1 bg-[#F57C1F] text-white font-black py-4 rounded-full text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-orange-900/20"><FiUploadCloud /> Publish</button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; }` }} />
    </div>
  );
};

export default MenuEditor;
// import React, { useState } from 'react';
// import { 
//   FiChevronLeft, FiSearch, FiMenu, FiPlus, FiHelpCircle, FiInfo, 
//   FiChevronDown, FiUploadCloud, FiTrash2, FiEdit2, FiClock, FiSettings, FiLayers, FiX 
// } from 'react-icons/fi';
// // IMPORTING DATA FROM DATA.JS
// import { menuStructure as initialMenu, allRestaurants } from '../../utils/data';

// const MenuEditor = () => {
//   const [activeTab, setActiveTab] = useState('Categories');
//   const [expandedCategory, setExpandedCategory] = useState('Appetizers');
//   const [menuData, setMenuData] = useState(initialMenu);
//   const [searchQuery, setSearchQuery] = useState('');

//   // --- RESTAURANT SELECTION SYSTEM ---
//   const [selectedRes, setSelectedRes] = useState(allRestaurants[0]);
//   const [isResPickerOpen, setIsResPickerOpen] = useState(false);

//   // UI States
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalConfig, setModalConfig] = useState({ type: 'item', action: 'add', catId: null, itemId: null });
//   const [formData, setFormData] = useState({ name: '', price: '', description: '' });
//   const [currency, setCurrency] = useState('USD ($)');
//   const [autoPublish, setAutoPublish] = useState(true);
//   const [availData, setAvailData] = useState([
//     { day: 'Mon-Fri', hours: '08:00 AM - 11:00 PM' },
//     { day: 'Sat', hours: '08:00 AM - 11:00 PM' },
//     { day: 'Sun', hours: '08:00 AM - 11:00 PM' }
//   ]);

//   /* ============================
//       FUNCTIONAL LOGIC
//   ============================ */

//   const openModal = (type, action, catId = null, item = null) => {
//     setModalConfig({ type, action, catId, itemId: item?.id });
//     setFormData({
//       name: item?.name || '',
//       price: item?.price || '',
//       description: item?.description || ''
//     });
//     setIsModalOpen(true);
//   };

//   const handleModalSubmit = (e) => {
//     e.preventDefault();
//     const { type, action, catId, itemId } = modalConfig;

//     if (type === 'help') {
//       setIsModalOpen(false);
//       return;
//     }

//     if (type === 'category') {
//       const newCat = { id: `cat${Date.now()}`, name: formData.name, count: 0, status: 'Active', items: [] };
//       setMenuData([...menuData, newCat]);
//     } else {
//       if (action === 'add') {
//         const newItem = {
//           id: `i${Date.now()}`,
//           name: formData.name,
//           price: parseFloat(formData.price) || 0,
//           description: formData.description || "No description provided",
//           img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120',
//           active: true
//         };
//         setMenuData(prev => prev.map(cat => cat.id === catId ? { ...cat, items: [...cat.items, newItem] } : cat));
//       } else {
//         setMenuData(prev => prev.map(cat => ({
//           ...cat,
//           items: cat.items.map(item => item.id === itemId ? { ...item, name: formData.name, price: parseFloat(formData.price), description: formData.description } : item)
//         })));
//       }
//     }
//     setIsModalOpen(false);
//   };

//   const filteredMenu = menuData.map(category => ({
//     ...category,
//     items: category.items.filter(item => 
//       item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.description.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   })).filter(category => category.items.length > 0 || searchQuery === '');

//   const handleDeleteItem = (catId, itemId) => {
//     if (window.confirm("Delete item?")) {
//       setMenuData(prev => prev.map(cat => cat.id === catId ? { ...cat, items: cat.items.filter(i => i.id !== itemId) } : cat));
//     }
//   };

//   const handleDeleteCategory = (id) => {
//     if (window.confirm("Delete category?")) {
//       setMenuData(menuData.filter(c => c.id !== id));
//     }
//   };

//   /* ============================
//       TAB RENDERING
//   ============================ */

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'Items':
//         return (
//           <div className="space-y-4">
//             {menuData.flatMap(c => c.items.map(i => ({ ...i, catId: c.id }))).map(item => (
//               <div key={item.id} className="bg-[#1C160E] p-4 rounded-2xl flex items-center justify-between border border-white/5">
//                 <div className="flex items-center gap-4">
//                   <img src={item.img} className="w-10 h-10 rounded-lg object-cover" alt="" />
//                   <div>
//                     <p className="text-sm font-bold">{item.name}</p>
//                     <p className="text-[10px] text-[#F57C1F] font-black">${item.price.toFixed(2)}</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-3">
//                   <FiEdit2 onClick={() => openModal('item', 'edit', item.catId, item)} className="text-gray-500" />
//                   <FiTrash2 onClick={() => handleDeleteItem(item.catId, item.id)} className="text-gray-500" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         );
//       case 'Availability':
//         return (
//           <div className="bg-[#1C160E] p-6 rounded-3xl border border-white/5 space-y-4">
//              <h3 className="font-bold mb-2 flex items-center gap-2 text-sm"><FiClock className="text-[#F57C1F]" /> Operating Hours</h3>
//              {availData.map((item, idx) => (
//                <div key={item.day} className="flex justify-between items-center text-xs">
//                  <span className="text-gray-500">{item.day}</span>
//                  <input className="bg-transparent text-right font-bold text-[#F57C1F] outline-none border-b border-transparent focus:border-white/10" value={item.hours} onChange={(e) => {
//                    const n = [...availData]; n[idx].hours = e.target.value; setAvailData(n);
//                  }} />
//                </div>
//              ))}
//           </div>
//         );
//       case 'Settings':
//         return (
//           <div className="space-y-3">
//             <div className="bg-[#1C160E] p-5 rounded-2xl border border-white/5 flex justify-between items-center">
//               <span className="text-sm font-bold">Currency</span>
//               <input className="bg-transparent text-right text-[#F57C1F] font-black uppercase text-xs outline-none" value={currency} onChange={e => setCurrency(e.target.value)} />
//             </div>
//             <div className="bg-[#1C160E] p-5 rounded-2xl border border-white/5 flex justify-between items-center">
//               <span className="text-sm font-bold">Auto-Publish</span>
//               <div onClick={() => setAutoPublish(!autoPublish)} className={`w-10 h-5 rounded-full relative transition-colors ${autoPublish ? 'bg-[#F57C1F]' : 'bg-gray-700'}`}>
//                 <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${autoPublish ? 'right-1' : 'left-1'}`} />
//               </div>
//             </div>
//           </div>
//         );
//       default:
//         return (
//           <div className="space-y-4">
//             <div className="relative mb-6">
//               <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
//               <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-[#1C160E] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-[#F57C1F]/40" placeholder="Search menu..." />
//             </div>
//             {filteredMenu.map(category => (
//               <div key={category.id} className="bg-[#1C160E] rounded-[2rem] border border-white/5 overflow-hidden">
//                 <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}>
//                   <div className="flex items-center gap-4">
//                     <FiMenu className="text-gray-600" />
//                     <h3 className="font-bold text-sm">{category.name}</h3>
//                   </div>
//                   <FiChevronDown className={expandedCategory === category.name ? 'rotate-180' : ''} />
//                 </div>
//                 {expandedCategory === category.name && (
//                   <div className="px-5 pb-5 space-y-4">
//                     {category.items.map(item => (
//                       <div key={item.id} className="flex items-center gap-4 bg-[#130F0A]/40 p-3 rounded-2xl border border-white/5">
//                         <img src={item.img} className="w-12 h-12 rounded-xl object-cover" alt="" />
//                         <div className="flex-1">
//                           <div className="flex justify-between">
//                             <h4 className="font-bold text-xs">{item.name}</h4>
//                             <div className="flex gap-2">
//                                <FiEdit2 onClick={(e) => { e.stopPropagation(); openModal('item', 'edit', category.id, item); }} className="text-gray-600 cursor-pointer" size={12} />
//                                <FiTrash2 onClick={(e) => { e.stopPropagation(); handleDeleteItem(category.id, item.id); }} className="text-gray-600 cursor-pointer" size={12} />
//                             </div>
//                           </div>
//                           <p className="text-[#F57C1F] font-black text-[10px]">${item.price.toFixed(2)}</p>
//                         </div>
//                       </div>
//                     ))}
//                     <button onClick={() => openModal('item', 'add', category.id)} className="w-full border-2 border-dashed border-white/5 rounded-2xl py-3 text-[10px] font-black text-gray-500 flex items-center justify-center gap-2 uppercase tracking-widest hover:border-[#F57C1F]/40 hover:text-white transition-all"><FiPlus /> Add Item</button>
//                   </div>
//                 )}
//               </div>
//             ))}
//             <button onClick={() => openModal('category', 'add')} className="w-full py-4 text-[#F57C1F] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2"><FiPlus /> New Category</button>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-[#130F0A] h-screen overflow-y-auto text-[#EDE8E2] pb-10 font-sans scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      
//       {/* --- RESTAURANT PICKER MODAL --- */}
//       {isResPickerOpen && (
//         <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-6">
//           <div className="bg-[#1C160E] w-full max-w-[320px] rounded-[2.5rem] border border-white/10 p-8 shadow-2xl">
//             <h2 className="text-[#F57C1F] text-[10px] font-black uppercase mb-6 text-center tracking-widest">Select Partner</h2>
//             <div className="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-hide">
//               {allRestaurants.map(res => (
//                 <button 
//                   key={res.id} 
//                   onClick={() => { setSelectedRes(res); setIsResPickerOpen(false); }}
//                   className={`w-full p-4 rounded-2xl text-left transition-all border ${selectedRes.id === res.id ? 'bg-[#F57C1F] border-transparent' : 'bg-white/5 border-white/5'}`}
//                 >
//                   <p className="font-bold text-xs">{res.name}</p>
//                   <p className="text-[9px] opacity-60 mt-1 uppercase tracking-tighter">{res.Address}</p>
//                 </button>
//               ))}
//             </div>
//             <button onClick={() => setIsResPickerOpen(false)} className="w-full mt-6 text-gray-500 font-bold text-[10px] uppercase">Cancel</button>
//           </div>
//         </div>
//       )}

//       {/* --- POPUP MODAL --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
//           <div className="bg-[#1C160E] w-full max-w-[500px] rounded-[2.5rem] border border-white/10 p-8 shadow-2xl animate-in zoom-in duration-200">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="font-bold text-base text-[#F57C1F] uppercase tracking-wider">
//                 {modalConfig.type === 'help' ? 'Help Center' : (modalConfig.action === 'add' ? 'New ' : 'Edit ') + modalConfig.type}
//               </h2>
//               <FiX onClick={() => setIsModalOpen(false)} className="cursor-pointer text-gray-500 hover:text-white transition-colors" />
//             </div>

//             {modalConfig.type === 'help' ? (
//               <div className="space-y-4 text-xs leading-relaxed text-gray-400">
//                 <p>• <b className="text-white">Categories:</b> Use this tab to group your food items.</p>
//                 <p>• <b className="text-white">Items:</b> Manage your full inventory and prices here.</p>
//                 <p>• <b className="text-white">Auto-Publish:</b> When active, saves go live immediately.</p>
//                 <button onClick={() => setIsModalOpen(false)} className="w-full bg-white/5 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest mt-4">Close</button>
//               </div>
//             ) : (
//               <form onSubmit={handleModalSubmit} className="space-y-4">
//                 <input required placeholder="Name" autoFocus className="w-full bg-[#130F0A] border border-white/5 rounded-xl p-4 text-xs outline-none focus:border-[#F57C1F]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
//                 {modalConfig.type === 'item' && (
//                   <>
//                     <input required type="number" step="0.01" placeholder="Price" className="w-full bg-[#130F0A] border border-white/5 rounded-xl p-4 text-xs outline-none focus:border-[#F57C1F]" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
//                     <textarea placeholder="Description" className="w-full bg-[#130F0A] border border-white/5 rounded-xl p-4 text-xs h-20 outline-none focus:border-[#F57C1F]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
//                   </>
//                 )}
//                 <button type="submit" className="w-full bg-[#F57C1F] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-900/20">Confirm Changes</button>
//               </form>
//             )}
//           </div>
//         </div>
//       )}

//       <div className="p-6">
//         <div className="flex items-center justify-between mb-8">
//           <FiChevronLeft className="text-[#F57C1F] text-2xl cursor-pointer" />
//           <div className="text-center cursor-pointer group" onClick={() => setIsResPickerOpen(true)}>
//             <div className="flex items-center justify-center gap-2">
//               <h1 className="text-lg font-bold group-hover:text-[#F57C1F] transition-colors">{selectedRes.name}</h1>
//               <FiChevronDown className="text-[#F57C1F]" />
//             </div>
//             <p className="text-[#F57C1F] text-[10px] font-black uppercase tracking-[0.2em]">{selectedRes.Address}</p>
//           </div>
//           <button onClick={() => alert("Draft Saved")} className="text-[#F57C1F] font-bold text-sm">Save</button>
//         </div>

//         <div className="flex justify-between mb-8 border-b border-white/5 text-[11px] font-black uppercase tracking-widest text-gray-500">
//           {['Categories', 'Items', 'Availability', 'Settings'].map((t) => (
//             <button key={t} onClick={() => setActiveTab(t)} className={`pb-3 transition-all ${activeTab === t ? 'text-white border-b-2 border-[#F57C1F]' : ''}`}>{t}</button>
//           ))}
//         </div>
//         {renderTabContent()}
//       </div>

//       <div className="px-6 mt-8 flex flex-col gap-6">
//         <button onClick={() => openModal('help')} className="self-end bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
//           <FiHelpCircle className="text-[#130F0A] text-2xl" />
//         </button>
//         <div className="flex items-center justify-between gap-4 pb-10">
//           <div className="flex flex-col">
//             <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Status</span>
//             <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full" /><span className="text-[10px] font-bold">Live</span></div>
//           </div>
//           <button onClick={() => alert("Published")} className="flex-1 bg-[#F57C1F] text-white font-black py-4 rounded-full text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-orange-900/20"><FiUploadCloud /> Publish</button>
//         </div>
//       </div>

//       <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; }` }} />
//     </div>
//   );
// };

// export default MenuEditor;