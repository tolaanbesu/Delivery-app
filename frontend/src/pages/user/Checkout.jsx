import React, { useState, useMemo, useRef, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiChevronLeft, FiInfo, FiCreditCard, FiMail,
  FiCamera, FiMapPin, FiSearch
} from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { AppContext } from '../../store/AppStore';

// Leaflet marker fix
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, dispatch] = useContext(AppContext);


  const currentUser = state.currentUser;

  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  const cartData = useMemo(() => {
    const s = location.state || {};
    return {
      totalPrice: s.totalPrice || 0,
      cartItemsData: s.cartItemsData || [],
      cart: s.cart || {},
      restaurantName: s.restaurantName || "Restaurant"
    };
  }, [location.state]);

  const subtotal = cartData.totalPrice;
  const deliveryFee = 2.5;
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + deliveryFee + tax;
  const itemsCount = Object.values(cartData.cart || {}).reduce((a, b) => a + b, 0);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '', expiry: '', cvv: '',
    phone: '', screenshot: null, addressText: ''
  });

  const [position, setPosition] = useState({ lat: 9.03, lng: 38.74 });

  const searchAddress = async () => {
    if (!formData.addressText) return;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.addressText)}`
    );
    const data = await res.json();
    if (data?.length) {
      setPosition({ lat: +data[0].lat, lng: +data[0].lon });
    }
  };

  function LocationMarker() {
    const markerRef = useRef(null);
    useMapEvents({ click: e => setPosition(e.latlng) });

    return (
      <Marker
        draggable
        position={position}
        icon={DefaultIcon}
        ref={markerRef}
        eventHandlers={{
          dragend() {
            setPosition(markerRef.current.getLatLng());
          }
        }}
      />
    );
  }

  const handleInputChange = e =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileChange = e =>
    setFormData(p => ({ ...p, screenshot: e.target.files[0] }));

  const validateAndPlaceOrder = () => {
    if (!formData.addressText.trim()) return alert("Delivery address required");

    if (
      paymentMethod === 'card' &&
      (!formData.cardNumber || !formData.expiry || !formData.cvv)
    ) return alert("All card fields required");

    if (
      paymentMethod === 'telebirr' &&
      (!formData.phone || !formData.screenshot)
    ) return alert("Telebirr info required");

    const newOrder = {
      id: crypto.randomUUID(),
      restaurantName: cartData.restaurantName,
      ownerId: currentUser.id,
      user: { email: currentUser.email, name: currentUser.name },
      deliveryPosition: position,
      grandTotal,
      itemsCount,
      status: "PAID",
      createdAt: new Date().toISOString()
    };

    dispatch({ type: "PLACE_ORDER", payload: newOrder });

    localStorage.setItem('activeOrder', JSON.stringify(newOrder));
    window.dispatchEvent(new Event('active-order-updated'));

    navigate('/tracking', { state: { order: newOrder } });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#1C160E] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-t-2 border-[#F57C1F] rounded-full" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-[#1C160E] text-[#EDE8E2] font-sans overflow-hidden">
      
      <header className="px-6 pt-8 pb-4 flex justify-between items-center bg-[#1C160E] z-20">
        <button onClick={() => navigate(-1)} className="text-2xl active:scale-95"><FiChevronLeft /></button>
        <div className="text-center">
          <h1 className="text-lg font-bold">Checkout</h1>
          <p className="text-[10px] text-[#8B7E6F]">{cartData.restaurantName}</p>
        </div>
        <FiInfo className="text-xl text-[#8B7E6F]" />
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-6 pb-6">
        
        {/* Progress Bar */}
        <div className="flex justify-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#3D2C1E]" />
          <div className="w-10 h-2 rounded-full bg-[#F57C1F]" />
          <div className="w-2 h-2 rounded-full bg-[#3D2C1E]" />
        </div>

        {/* Map Section */}
        <section className="space-y-3">
          <div className="flex justify-between items-end">
            <h2 className="text-md font-bold">Delivery Location</h2>
            <span className="text-[10px] text-[#F57C1F] flex items-center gap-1 font-bold italic">
              <FiMapPin /> Change Address
            </span>
          </div>

          <div className="relative group">
            <input 
              name="addressText"
              value={formData.addressText}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && searchAddress()}
              placeholder="Search your location..."
              className="w-full bg-[#2A1E14] p-4 pr-12 rounded-2xl text-xs border border-white/5 outline-none focus:border-[#F57C1F]/50 transition-all"
            />
            <button onClick={searchAddress} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F57C1F] p-2">
              <FiSearch size={18} />
            </button>
          </div>

          <div className="bg-[#2A1E14] rounded-[2rem] overflow-hidden border border-white/5 h-44 w-full relative">
            <MapContainer center={[position.lat, position.lng]} zoom={14} zoomControl={false} style={{ height: '100%', width: '100%', filter: 'invert(100%) hue-rotate(180deg) brightness(95%)' }}>
              <ChangeView center={[position.lat, position.lng]} />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker />
            </MapContainer>
          </div>
        </section>

        {/* DYNAMIC CONTACT INFO SECTION */}
        <section>
          <h2 className="text-md font-bold mb-4">Contact Details</h2>
          <div className="bg-[#2A1E14] rounded-[2.5rem] p-6 space-y-4 border border-white/5 shadow-inner">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#F57C1F]/30">
                <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-black text-xs text-white uppercase tracking-tight">{currentUser.name}</p>
                <p className="text-[10px] text-[#8B7E6F] font-bold">{currentUser.phone}</p>
              </div>
            </div>
            <div className="h-[1px] bg-white/5 w-full" />
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <FiMail className="text-[#F57C1F]" />
              </div>
              <p className="font-bold text-[11px] text-[#8B7E6F]">{currentUser.email}</p>
            </div>
          </div>
        </section>

        {/* Payment and Totals... (rest of the UI remains the same) */}
        <section>
          <h2 className="text-md font-bold mb-4">Payment Method</h2>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setPaymentMethod('card')} className={`flex flex-col items-center p-5 rounded-[2rem] border-2 transition-all ${paymentMethod === 'card' ? 'border-[#F57C1F] bg-[#2A1E14]' : 'border-transparent bg-[#2A1E14]/50 opacity-40'}`}>
              <FiCreditCard className="text-xl mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Credit Card</span>
            </button>
            <button onClick={() => setPaymentMethod('telebirr')} className={`flex flex-col items-center p-5 rounded-[2rem] border-2 transition-all ${paymentMethod === 'telebirr' ? 'border-[#F57C1F] bg-[#2A1E14]' : 'border-transparent bg-[#2A1E14]/50 opacity-40'}`}>
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-[10px] font-black italic mb-2 text-white">tb</div>
              <span className="text-[10px] font-bold uppercase tracking-widest">telebirr</span>
            </button>
          </div>
        </section>

        {/* Conditional Payment Fields */}
        <div className="pb-4">
           {paymentMethod === 'card' ? (
             <div className="bg-[#2A1E14] rounded-[2rem] p-6 space-y-4 border border-white/5">
                <input required name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="Card Number" className="w-full bg-[#1C160E] p-4 rounded-xl text-xs outline-none border border-transparent focus:border-[#F57C1F] text-white"/>
                <div className="grid grid-cols-2 gap-4">
                   <input required name="expiry" value={formData.expiry} onChange={handleInputChange} placeholder="MM/YY" className="bg-[#1C160E] p-4 rounded-xl text-xs outline-none text-white"/>
                   <input required name="cvv" type="password" value={formData.cvv} onChange={handleInputChange} placeholder="CVV" className="bg-[#1C160E] p-4 rounded-xl text-xs outline-none text-white"/>
                </div>
             </div>
           ) : (
             <div className="bg-[#2A1E14] rounded-[2rem] p-6 space-y-4 border border-white/5">
                <input required name="phone" value={formData.phone} onChange={handleInputChange} placeholder="telebirr Number" className="w-full bg-[#1C160E] p-4 rounded-xl text-xs outline-none text-white"/>
                <label className="flex flex-col items-center justify-center bg-[#1C160E] p-5 rounded-xl border border-dashed border-[#3D2C1E] cursor-pointer">
                   <FiCamera className="text-[#F57C1F] mb-2" />
                   <span className="text-[10px] text-gray-500 uppercase">{formData.screenshot ? "File Ready" : "Upload Receipt"}</span>
                   <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
             </div>
           )}
        </div>

        <section className="bg-[#2A1E14] rounded-[2.5rem] p-6 space-y-3 border border-white/5 mb-4 shadow-sm">
          <div className="flex justify-between text-xs text-[#8B7E6F]">
            <span>Subtotal ({itemsCount} items)</span>
            <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-[#8B7E6F]">
            <span>Delivery Fee</span>
            <span className="text-white font-bold">${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-[#8B7E6F]">
            <span>Service Tax (5%)</span>
            <span className="text-white font-bold">${tax.toFixed(2)}</span>
          </div>
        </section>
      </div>

      <footer className="bg-[#1C160E] p-6 border-t border-white/5 z-20">
        <div className="flex justify-between items-center mb-6 px-1">
          <div>
            <p className="text-[9px] text-[#8B7E6F] font-black uppercase tracking-widest mb-1">Total Pay</p>
            <p className="font-black text-[#F57C1F] text-lg">${grandTotal.toFixed(2)}</p>
          </div>
          <button onClick={validateAndPlaceOrder} className="bg-[#F57C1F] px-8 py-4 rounded-[1.2rem] font-black text-white uppercase text-xs shadow-xl active:scale-95 transition-transform">
            Place Order →
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;




// import React, { useState, useMemo, useRef, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { FiChevronLeft, FiInfo, FiCreditCard, FiMail, FiUser, FiCamera, FiMapPin, FiSearch } from 'react-icons/fi';
// import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // --- DYNAMIC DATA IMPORT ---
// import { userData } from '../../utils/data'; 

// // Leaflet marker fix
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// const DefaultIcon = L.icon({
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41]
// });

// function ChangeView({ center }) {
//   const map = useMap();
//   useEffect(() => {
//     map.setView(center, map.getZoom());
//   }, [center, map]);
//   return null;
// }

// const Checkout = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // --- DYNAMIC USER SYNC ---
//   // We prioritize the global userData object to ensure it's always the "Real" logged-in person
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     const activeEmail = localStorage.getItem('loggedInUserEmail');
//     const user = userData.find(u => u.email === activeEmail);

//     if(!user){
//       navigate('/login')
//     }else{
//       setCurrentUser(user);
//     }
    
//   }, [navigate]);

  

//   const cartData = useMemo(() => {
//     const state = location.state || {};
//     return {
//       totalPrice: state.totalPrice || 0,
//       cartItemsData: state.cartItemsData || [],
//       cart: state.cart || {},
//       restaurantName: state.restaurantName || "Restaurant"
//     };
//   }, [location.state]);

  

//   const subtotal = cartData.totalPrice || 0;
//   const deliveryFee = 2.50;
//   const tax = subtotal * 0.05;
//   const grandTotal = subtotal + deliveryFee + tax;
//   const itemsCount = Object.values(cartData.cart || {}).reduce((a, b) => a + b, 0);

//   const [paymentMethod, setPaymentMethod] = useState('card');
//   const [formData, setFormData] = useState({
//     cardNumber: '', expiry: '', cvv: '', phone: '', screenshot: null, addressText: ''
//   });
  
//   const [position, setPosition] = useState({ lat: 9.03, lng: 38.74 });

//   const searchAddress = async () => {
//     if (!formData.addressText) return;
//     try {
//       const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.addressText)}`);
//       const data = await response.json();
//       if (data && data.length > 0) {
//         const { lat, lon } = data[0];
//         setPosition({ lat: parseFloat(lat), lng: parseFloat(lon) });
//       }
//     } catch (error) {
//       console.error("Search failed", error);
//     }
//   };

//   function LocationMarker() {
//     useMapEvents({
//       click(e) { setPosition(e.latlng); },
//     });
    
//     const markerRef = useRef(null);
//     const eventHandlers = useMemo(() => ({
//       dragend() {
//         const marker = markerRef.current;
//         if (marker != null) { setPosition(marker.getLatLng()); }
//       },
//     }), []);

//     return (
//       <Marker
//         draggable={true}
//         eventHandlers={eventHandlers}
//         position={position}
//         icon={DefaultIcon}
//         ref={markerRef}
//       />
//     );
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files[0]) {
//       setFormData(prev => ({ ...prev, screenshot: e.target.files[0] }));
//     }
//   };

//   const validateAndPlaceOrder = () => {
//     if (!formData.addressText.trim()) {
//       alert("Delivery address is required.");
//       return;
//     }

//     if (paymentMethod === 'card') {
//       if (!formData.cardNumber || !formData.expiry || !formData.cvv) {
//         alert("All card details are required.");
//         return;
//       }
//     } else {
//       if (!formData.phone || !formData.screenshot) {
//         alert("Telebirr phone and payment screenshot are required.");
//         return;
//       }
//     }

//       // 1. Increment Orders
//     currentUser.stats.orders += 1;
    
//     // 2. Add Points (e.g., 10 points for every dollar spent)
//     const earnedPoints = Math.round(grandTotal * 10);
//     // Remove commas to do math, then add them back
//     const currentPoints = Number(currentUser.stats.points) || 0;
//     const newPointsTotal = currentPoints + earnedPoints;
//     currentUser.stats.points = newPointsTotal.toLocaleString();

//     // 3. Update Credits (e.g., 1% cashback)
//     const currentCredits = Number(currentUser.stats.credits) || 0;
//     const newCredits = currentCredits + (grandTotal * 0.01);
//     currentUser.stats.credits = `$${newCredits.toFixed(2)}`;

//     // 4. Update menuinfo strings (so the Profile page looks updated)
//     currentUser.menuinfo.history = `${currentUser.stats.orders} completed orders`;
//     currentUser.menuinfo.rewards = `${currentUser.stats.points} points`;

//     console.log("User stats updated successfully:", currentUser.stats);

//     alert("Order Placed Successfully!");
    
//     const newOrder = {
//       id: crypto.randomUUID(),              // 🔑 REQUIRED
//       restaurantName: cartData.restaurantName,
//       owner: { id: currentUser.id, name: currentUser.name, email: currentUser.email },
//       user: currentUser,
//       deliveryPosition: position,
//       grandTotal,
//       itemsCount,
//       status: 'active',
//       createdAt: new Date().toISOString()
//     };

//     // Append to active orders (do not replace)
//     const existingActive = JSON.parse(localStorage.getItem('activeOrders') || '[]');
//     localStorage.setItem('activeOrders', JSON.stringify([newOrder, ...existingActive]));

//     // Append to global orders history
//     const existingAll = JSON.parse(localStorage.getItem('orders') || '[]');
//     localStorage.setItem('orders', JSON.stringify([newOrder, ...existingAll]));

//     // Keep last order for quick reference if needed
//     localStorage.setItem('activeOrder', JSON.stringify(newOrder));

//     navigate('/tracking', {
//       state: { order: newOrder }
//     });
//   };

//   if (!currentUser) {
//     return (
//       <div className="min-h-screen bg-[#1C160E] flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#F57C1F]"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="absolute inset-0 flex flex-col bg-[#1C160E] text-[#EDE8E2] font-sans overflow-hidden">
      
//       <header className="px-6 pt-8 pb-4 flex justify-between items-center bg-[#1C160E] z-20">
//         <button onClick={() => navigate(-1)} className="text-2xl active:scale-95"><FiChevronLeft /></button>
//         <div className="text-center">
//           <h1 className="text-lg font-bold">Checkout</h1>
//           <p className="text-[10px] text-[#8B7E6F]">{cartData.restaurantName}</p>
//         </div>
//         <FiInfo className="text-xl text-[#8B7E6F]" />
//       </header>

//       <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-6 pb-6">
        
//         {/* Progress Bar */}
//         <div className="flex justify-center gap-2 mb-2">
//           <div className="w-2 h-2 rounded-full bg-[#3D2C1E]" />
//           <div className="w-10 h-2 rounded-full bg-[#F57C1F]" />
//           <div className="w-2 h-2 rounded-full bg-[#3D2C1E]" />
//         </div>

//         {/* Map Section */}
//         <section className="space-y-3">
//           <div className="flex justify-between items-end">
//             <h2 className="text-md font-bold">Delivery Location</h2>
//             <span className="text-[10px] text-[#F57C1F] flex items-center gap-1 font-bold italic">
//               <FiMapPin /> Change Address
//             </span>
//           </div>

//           <div className="relative group">
//             <input 
//               name="addressText"
//               value={formData.addressText}
//               onChange={handleInputChange}
//               onKeyDown={(e) => e.key === 'Enter' && searchAddress()}
//               placeholder="Search your location..."
//               className="w-full bg-[#2A1E14] p-4 pr-12 rounded-2xl text-xs border border-white/5 outline-none focus:border-[#F57C1F]/50 transition-all"
//             />
//             <button onClick={searchAddress} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F57C1F] p-2">
//               <FiSearch size={18} />
//             </button>
//           </div>

//           <div className="bg-[#2A1E14] rounded-[2rem] overflow-hidden border border-white/5 h-44 w-full relative">
//             <MapContainer center={[position.lat, position.lng]} zoom={14} zoomControl={false} style={{ height: '100%', width: '100%', filter: 'invert(100%) hue-rotate(180deg) brightness(95%)' }}>
//               <ChangeView center={[position.lat, position.lng]} />
//               <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//               <LocationMarker />
//             </MapContainer>
//           </div>
//         </section>

//         {/* DYNAMIC CONTACT INFO SECTION */}
//         <section>
//           <h2 className="text-md font-bold mb-4">Contact Details</h2>
//           <div className="bg-[#2A1E14] rounded-[2.5rem] p-6 space-y-4 border border-white/5 shadow-inner">
//             <div className="flex items-center gap-4">
//               <div className="w-10 h-10 rounded-full overflow-hidden border border-[#F57C1F]/30">
//                 <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover" />
//               </div>
//               <div>
//                 <p className="font-black text-xs text-white uppercase tracking-tight">{currentUser.name}</p>
//                 <p className="text-[10px] text-[#8B7E6F] font-bold">{currentUser.phone}</p>
//               </div>
//             </div>
//             <div className="h-[1px] bg-white/5 w-full" />
//             <div className="flex items-center gap-4">
//               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
//                 <FiMail className="text-[#F57C1F]" />
//               </div>
//               <p className="font-bold text-[11px] text-[#8B7E6F]">{currentUser.email}</p>
//             </div>
//           </div>
//         </section>

//         {/* Payment and Totals... (rest of the UI remains the same) */}
//         <section>
//           <h2 className="text-md font-bold mb-4">Payment Method</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <button onClick={() => setPaymentMethod('card')} className={`flex flex-col items-center p-5 rounded-[2rem] border-2 transition-all ${paymentMethod === 'card' ? 'border-[#F57C1F] bg-[#2A1E14]' : 'border-transparent bg-[#2A1E14]/50 opacity-40'}`}>
//               <FiCreditCard className="text-xl mb-2" />
//               <span className="text-[10px] font-bold uppercase tracking-widest">Credit Card</span>
//             </button>
//             <button onClick={() => setPaymentMethod('telebirr')} className={`flex flex-col items-center p-5 rounded-[2rem] border-2 transition-all ${paymentMethod === 'telebirr' ? 'border-[#F57C1F] bg-[#2A1E14]' : 'border-transparent bg-[#2A1E14]/50 opacity-40'}`}>
//               <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-[10px] font-black italic mb-2 text-white">tb</div>
//               <span className="text-[10px] font-bold uppercase tracking-widest">telebirr</span>
//             </button>
//           </div>
//         </section>

//         {/* Conditional Payment Fields */}
//         <div className="pb-4">
//            {paymentMethod === 'card' ? (
//              <div className="bg-[#2A1E14] rounded-[2rem] p-6 space-y-4 border border-white/5">
//                 <input required name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="Card Number" className="w-full bg-[#1C160E] p-4 rounded-xl text-xs outline-none border border-transparent focus:border-[#F57C1F] text-white"/>
//                 <div className="grid grid-cols-2 gap-4">
//                    <input required name="expiry" value={formData.expiry} onChange={handleInputChange} placeholder="MM/YY" className="bg-[#1C160E] p-4 rounded-xl text-xs outline-none text-white"/>
//                    <input required name="cvv" type="password" value={formData.cvv} onChange={handleInputChange} placeholder="CVV" className="bg-[#1C160E] p-4 rounded-xl text-xs outline-none text-white"/>
//                 </div>
//              </div>
//            ) : (
//              <div className="bg-[#2A1E14] rounded-[2rem] p-6 space-y-4 border border-white/5">
//                 <input required name="phone" value={formData.phone} onChange={handleInputChange} placeholder="telebirr Number" className="w-full bg-[#1C160E] p-4 rounded-xl text-xs outline-none text-white"/>
//                 <label className="flex flex-col items-center justify-center bg-[#1C160E] p-5 rounded-xl border border-dashed border-[#3D2C1E] cursor-pointer">
//                    <FiCamera className="text-[#F57C1F] mb-2" />
//                    <span className="text-[10px] text-gray-500 uppercase">{formData.screenshot ? "File Ready" : "Upload Receipt"}</span>
//                    <input type="file" className="hidden" onChange={handleFileChange} />
//                 </label>
//              </div>
//            )}
//         </div>

//         <section className="bg-[#2A1E14] rounded-[2.5rem] p-6 space-y-3 border border-white/5 mb-4 shadow-sm">
//           <div className="flex justify-between text-xs text-[#8B7E6F]">
//             <span>Subtotal ({itemsCount} items)</span>
//             <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between text-xs text-[#8B7E6F]">
//             <span>Delivery Fee</span>
//             <span className="text-white font-bold">${deliveryFee.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between text-xs text-[#8B7E6F]">
//             <span>Service Tax (5%)</span>
//             <span className="text-white font-bold">${tax.toFixed(2)}</span>
//           </div>
//         </section>
//       </div>

//       <footer className="bg-[#1C160E] p-6 border-t border-white/5 z-20">
//         <div className="flex justify-between items-center mb-6 px-1">
//           <div>
//             <p className="text-[9px] text-[#8B7E6F] font-black uppercase tracking-widest mb-1">Total Pay</p>
//             <p className="font-black text-[#F57C1F] text-lg">${grandTotal.toFixed(2)}</p>
//           </div>
//           <button onClick={validateAndPlaceOrder} className="bg-[#F57C1F] px-8 py-4 rounded-[1.2rem] font-black text-white uppercase text-xs shadow-xl active:scale-95 transition-transform">
//             Place Order →
//           </button>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Checkout;
