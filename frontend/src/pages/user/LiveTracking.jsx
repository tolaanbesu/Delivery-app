import React, { useState, useMemo, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { 
  FiChevronLeft, FiMessageSquare, FiPhone, FiTruck, 
  FiCheckCircle, FiCoffee, FiHome, FiHelpCircle, 
  FiX, FiMapPin, FiCopy, FiCheck, FiPackage, FiPlus
} from 'react-icons/fi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- IMPORT DYNAMIC DATA ---
import { AppContext } from "../../store/AppStore"; 

// Leaflet marker fix
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({
  iconUrl: markerIcon, 
  shadowUrl: markerShadow, 
  iconSize: [25, 41], 
  iconAnchor: [12, 41]
});

const LiveTracking = () => {
  const [state, dispatch] = useContext(AppContext);
  const driverData = state.driver;
  const officeData = state.office;
  const allRestaurants = state.restaurants;
  
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInEmail = localStorage.getItem('loggedInUserEmail');

  // --- REFINED: Filter Active Orders by current User Email ---
  const [activeOrders, setActiveOrders] = useState(() => {
    const allActive = JSON.parse(localStorage.getItem('activeOrders') || '[]');
    // Only return orders belonging to this user
    return allActive.filter(order => order.user?.email === loggedInEmail);
  });

  // Determine which specific order ID to display
  const [selectedOrderId, setSelectedOrderId] = useState(
    location.state?.orderId || activeOrders[0]?.id
  );

  const [showSupport, setShowSupport] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // --- REFINED: Current Order Selection ---
  const currentOrder = useMemo(() => {
    return activeOrders.find(o => o.id === selectedOrderId) || activeOrders[0];
  }, [selectedOrderId, activeOrders]);

  // --- 1. MAINTAIN STABLE TIME PER ORDER ---
  const mountTimesRef = useRef({});
  
  if (currentOrder && !mountTimesRef.current[currentOrder.id]) {
    mountTimesRef.current[currentOrder.id] = new Date(currentOrder.createdAt);
  }

  // 2. Helper Function: Calculate distance in km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // 3. Memoized Order and Time Logic
  const { deliveryTimes, distInKm, duration } = useMemo(() => {
    if (!currentOrder) return { deliveryTimes: {}, distInKm: 0, duration: 0 };

    const restaurant = allRestaurants.find(r => r.name === currentOrder.restaurantName);
    const rLat = restaurant?.location?.lat || 9.02;
    const rLng = restaurant?.location?.lng || 38.75;
    
    const dist = calculateDistance(
      rLat, 
      rLng, 
      currentOrder.deliveryPosition.lat, 
      currentOrder.deliveryPosition.lng
    );

    const travelTimeMinutes = Math.round(dist * 5) + 10;
    const startTime = mountTimesRef.current[currentOrder.id] || new Date();
    const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return {
      distInKm: dist.toFixed(1),
      duration: travelTimeMinutes,
      deliveryTimes: {
        placed: formatTime(startTime),
        prep: formatTime(new Date(startTime.getTime() + 5 * 60000)),
        arrival: formatTime(new Date(startTime.getTime() + travelTimeMinutes * 60000))
      }
    };
  }, [currentOrder, allRestaurants]);

  // --- 4. DYNAMIC STATUS LOGIC ---
  const [orderStatus, setOrderStatus] = useState(0);

  useEffect(() => {
    if (!currentOrder) return;
    
    const updateStatus = () => {
      const elapsedMs = new Date() - mountTimesRef.current[currentOrder.id];
      const totalMs = duration * 60000;
      const stage = Math.floor((elapsedMs / totalMs) * 4); 
      setOrderStatus(Math.min(Math.max(stage, 0), 3));
    };

    updateStatus();
    const timer = setInterval(updateStatus, 5000);
    return () => clearInterval(timer);
  }, [currentOrder, duration]);

  const isCompleted = orderStatus === 3;

  const handleConfirmDelivery = () => {
    setIsConfirmed(true);

    const completedOrder = {
      ...currentOrder,
      status: 'completed',
      boardStatus: 'Done', // Ensures Admin Board moves it to the 'Done' tab
      completedAt: new Date().toISOString()
    };

    // --- FIX: Update Global Context State ---
    // This ensures the Admin Dashboard/OrderBoard sees the change immediately
    dispatch({
      type: "UPDATE_ORDER_STATUS",
      payload: { 
        id: currentOrder.id, 
        status: 'completed', 
        boardStatus: 'Done' 
      }
    });

    // 1. Add to Global History
    const existingHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    localStorage.setItem('orderHistory', JSON.stringify([completedOrder, ...existingHistory]));

    // 2. Remove from Global Active List
    const allActive = JSON.parse(localStorage.getItem('activeOrders') || '[]');
    const updatedGlobalActive = allActive.filter(o => o.id !== currentOrder.id);
    localStorage.setItem('activeOrders', JSON.stringify(updatedGlobalActive));
    
    // 3. Update Local State (filtered for user)
    const updatedUserActive = activeOrders.filter(o => o.id !== currentOrder.id);
    
    localStorage.removeItem('activeOrder');
    window.dispatchEvent(new Event('active-order-updated'));

    setTimeout(() => {
      if (updatedUserActive.length > 0) {
        setActiveOrders(updatedUserActive);
        setSelectedOrderId(updatedUserActive[0].id);
        setIsConfirmed(false);
      } else {
        navigate('/profile'); 
      }
    }, 2000);
  };

  const timelineSteps = [
    { id: 0, title: "Order Placed", time: deliveryTimes.placed, icon: <FiCheckCircle /> },
    { id: 1, title: "Kitchen is preparing your meal", time: orderStatus >= 1 ? "Started" : "Waiting...", icon: <FiCoffee /> },
    { id: 2, title: "Out for delivery", time: orderStatus >= 2 ? `Driver is ${distInKm} km away` : "Driver arriving at restaurant", icon: <FiTruck /> },
    { id: 3, title: "Estimated Arrival", time: orderStatus === 3 ? "Arrived!" : deliveryTimes.arrival, icon: <FiHome /> },
  ];

  const copyAddress = () => {
    navigator.clipboard.writeText(officeData.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!currentOrder) return (
    <div className="min-h-screen bg-[#1C160E] flex items-center justify-center text-white font-black">
      NO ACTIVE ORDERS
    </div>
  );

  return (
    <div className="absolute inset-0 bg-[#1C160E] flex flex-col font-sans overflow-hidden">
      
      {/* 1. Map Header Section */}
      <div className="relative h-[45%] w-full">
        <div className="w-full h-full z-0">
          <MapContainer 
            key={currentOrder.id}
            center={[currentOrder.deliveryPosition.lat, currentOrder.deliveryPosition.lng]} 
            zoom={15} 
            zoomControl={false} 
            style={{ height: '100%', width: '100%', filter: 'invert(100%) hue-rotate(180deg) brightness(80%)' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[currentOrder.deliveryPosition.lat, currentOrder.deliveryPosition.lng]} icon={DefaultIcon} />
          </MapContainer>
        </div>

        <div className="absolute top-8 left-6 right-6 z-[1000]">
          
          {/* MULTI-ORDER TABS */}
          {activeOrders.length > 1 && (
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
              {activeOrders.map((order, idx) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`px-5 py-2 rounded-full font-black text-[10px] whitespace-nowrap transition-all border ${
                    selectedOrderId === order.id 
                    ? 'bg-[#F57C1F] text-white border-transparent shadow-lg shadow-orange-900/40' 
                    : 'bg-[#1C160E]/80 backdrop-blur-md text-[#8B7E6F] border-white/10'
                  }`}
                >
                  ORDER #{idx + 1}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <button onClick={() => navigate(-1)} className="bg-[#1C160E] p-3 rounded-xl shadow-xl active:scale-90 transition-transform border border-white/5">
              <FiChevronLeft className="text-white" />
            </button>
            
            <div className="flex gap-2">
                <button onClick={() => navigate('/')} className="bg-[#1C160E] p-3 rounded-xl shadow-xl active:scale-90 transition-transform flex items-center gap-2 border border-white/5">
                <FiPlus className="text-[#F57C1F]" />
                <span className="text-white text-[10px] font-black uppercase tracking-widest">Order New</span>
                </button>
            </div>
          </div>
          
          <div className="bg-[#2A1E14]/90 backdrop-blur-md p-5 rounded-[2rem] border border-white/5 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="font-black text-sm text-white uppercase tracking-tighter">
                {isConfirmed ? "Package Received" : isCompleted ? "Order Arrived" : "On the way"}
              </span>
              <span className="text-[#F57C1F] font-black text-sm">ETA: {duration} mins</span>
            </div>
            
            <div className="space-y-2">
              <div className="h-1.5 bg-[#3D2C1E] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#F57C1F] transition-all duration-1000 ease-linear" 
                  style={{ width: `${((orderStatus + 1) / 4) * 100}%` }} 
                />
              </div>
              <div className="flex justify-between px-1">
                {['ORDERED', 'PREP', 'WAY', 'DONE'].map((s, i) => (
                  <span key={s} className={`text-[8px] font-black ${i <= orderStatus ? 'text-[#F57C1F]' : 'text-[#8B7E6F]'}`}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bottom Content Container */}
      <div className="flex-1 bg-[#1C160E] -mt-12 rounded-t-[3rem] p-8 shadow-[0_-20px_60px_rgba(0,0,0,0.8)] z-[1001] overflow-y-auto no-scrollbar border-t border-white/5">
        
        {/* DRIVER INFO */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={driverData.avatar} className="w-16 h-16 rounded-[1.5rem] object-cover border-2 border-[#2A1E14]" alt="Driver" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#1C160E] rounded-full" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{driverData.name}</h3>
              <p className="text-[10px] text-[#8B7E6F] font-bold uppercase tracking-widest">{driverData.vehicle} • {driverData.plate}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => window.location.href = `sms:${driverData.phone}`} className="bg-[#2A1E14] p-4 rounded-2xl border border-white/5 active:scale-90 transition-transform">
              <FiMessageSquare className="text-[#F57C1F]" />
            </button>
            <button onClick={() => window.location.href = `tel:${driverData.phone}`} className="bg-[#F57C1F] p-4 rounded-2xl shadow-lg shadow-orange-900/40 active:scale-90 transition-transform">
              <FiPhone className="text-white" />
            </button>
          </div>
        </div>

        <div className="space-y-10 relative mb-10">
          {timelineSteps.map((step, index) => (
            <div key={step.id} className="flex gap-6 relative">
              {index < 3 && (
                <div className={`absolute top-8 left-3.5 w-[2px] h-10 ${orderStatus > index ? 'bg-[#F57C1F]' : 'bg-[#2A1E14]'}`} />
              )}
              <div className={`w-7 h-7 flex items-center justify-center z-10 ${orderStatus >= index ? 'text-[#F57C1F]' : 'text-[#3D2C1E]'}`}>
                {step.icon}
              </div>
              <div>
                <p className={`font-black text-sm ${orderStatus >= index ? 'text-white' : 'text-[#3D2C1E]'}`}>{step.title}</p>
                <p className={`text-[11px] font-bold ${orderStatus === index ? 'text-[#F57C1F]' : 'text-[#8B7E6F]'}`}>{step.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 3. DYNAMIC BUTTON */}
        {isCompleted && !isConfirmed ? (
          <button 
            onClick={handleConfirmDelivery}
            className="w-full bg-[#F57C1F] text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-lg shadow-orange-900/40 flex items-center justify-center gap-3 active:scale-95 transition-all animate-pulse"
          >
            <FiPackage size={20}/> Confirm Item Received
          </button>
        ) : isConfirmed ? (
          <div className="w-full bg-green-500/10 border border-green-500/20 text-green-500 py-5 rounded-3xl font-black uppercase text-center flex items-center justify-center gap-3">
            <FiCheckCircle size={20}/> Delivery Accepted
          </div>
        ) : (
          <button 
            onClick={() => setShowSupport(true)}
            className="w-full bg-[#2A1E14] py-5 rounded-2xl border border-white/5 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            <FiHelpCircle className="text-[#8B7E6F]" />
            <span className="text-[10px] font-black uppercase text-[#8B7E6F]">Order Help & Support</span>
          </button>
        )}
      </div>

      {/* Support Pop-up Modal */}
      {showSupport && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSupport(false)} />
          <div className="relative bg-[#2A1E14] w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
            <button onClick={() => setShowSupport(false)} className="absolute top-6 right-6 text-[#8B7E6F]"><FiX size={20}/></button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#F57C1F]/10 rounded-full flex items-center justify-center mb-6">
                <FiMapPin className="text-[#F57C1F]" size={28} />
              </div>
              <h2 className="text-xl font-black text-white mb-2">{officeData.name}</h2>
              
              <button 
                onClick={() => navigate('/')}
                className="mb-6 w-full bg-[#F57C1F]/20 text-[#F57C1F] py-3 rounded-2xl font-black uppercase text-[10px] border border-[#F57C1F]/30 active:scale-95 transition-transform"
              >
                + Make Another Order
              </button>

              <div className="flex items-center gap-2 group cursor-pointer" onClick={copyAddress}>
                <p className="text-[#8B7E6F] text-sm leading-relaxed">
                  {officeData.address}
                </p>
                <button className="text-[#F57C1F] opacity-50 group-hover:opacity-100 transition-opacity">
                  {copied ? <FiCheck /> : <FiCopy />}
                </button>
              </div>
              <div className="w-full h-[1px] bg-white/5 my-6" />
              <div className="space-y-4 w-full">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8B7E6F] font-bold uppercase">Customer Line</span>
                  <span className="text-white font-black">{officeData.phone}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#8B7E6F] font-bold uppercase">Email Support</span>
                  <span className="text-white font-black">{officeData.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTracking;
// import React, { useState, useMemo, useEffect, useRef } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { MapContainer, TileLayer, Marker } from 'react-leaflet';
// import { 
//   FiChevronLeft, FiMessageSquare, FiPhone, FiTruck, 
//   FiCheckCircle, FiCoffee, FiHome, FiHelpCircle, 
//   FiX, FiMapPin, FiCopy, FiCheck, FiPackage, FiPlus
// } from 'react-icons/fi';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // --- IMPORT DYNAMIC DATA ---
// import { driverData, officeData, allRestaurants } from '../../utils/data';

// // Leaflet marker fix
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// const DefaultIcon = L.icon({
//   iconUrl: markerIcon, 
//   shadowUrl: markerShadow, 
//   iconSize: [25, 41], 
//   iconAnchor: [12, 41]
// });

// const LiveTracking = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [showSupport, setShowSupport] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [isConfirmed, setIsConfirmed] = useState(false);

//   // --- 1. MAINTAIN STABLE TIME ---
//   const mountTimeRef = useRef(null);
  
//   if (!mountTimeRef.current) {
//     const storedOrder = JSON.parse(localStorage.getItem('activeOrder'));
//     const existingTime = location.state?.orderDetails?.createdAt || storedOrder?.createdAt;

//     if (existingTime) {
//       mountTimeRef.current = new Date(existingTime);
//     } else {
//       const now = new Date();
//       mountTimeRef.current = now;
//       if (storedOrder) {
//         localStorage.setItem('activeOrder', JSON.stringify({
//           ...storedOrder,
//           createdAt: now.toISOString()
//         }));
//       }
//     }
//   }

//   // 2. Helper Function: Calculate distance in km
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; 
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     return R * c;
//   };

//   // 3. Memoized Order and Time Logic
//   const { orderData, deliveryTimes, calculatedDistance, duration } = useMemo(() => {
//     const orderDetails = location.state?.orderDetails || JSON.parse(localStorage.getItem('activeOrder')) || {
//       restaurantName: "Express Eats",
//       deliveryPosition: officeData.coordinates,
//       user: { name: "Guest", phone: "0911000000" }
//     };

//     const restaurant = allRestaurants.find(r => r.name === orderDetails.restaurantName) || { lat: 9.02, lng: 38.75 };
    
//     const dist = calculateDistance(
//       restaurant.lat, 
//       restaurant.lng, 
//       orderDetails.deliveryPosition.lat, 
//       orderDetails.deliveryPosition.lng
//     );

//     const travelTimeMinutes = Math.round(dist * 5) + 10;
//     const startTime = mountTimeRef.current;
//     const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//     return {
//       orderData: orderDetails,
//       calculatedDistance: dist.toFixed(1),
//       duration: travelTimeMinutes,
//       deliveryTimes: {
//         placed: formatTime(startTime),
//         prep: formatTime(new Date(startTime.getTime() + 5 * 60000)),
//         arrival: formatTime(new Date(startTime.getTime() + travelTimeMinutes * 60000))
//       }
//     };
//   }, [location.state]);

//   // --- 4. DYNAMIC STATUS LOGIC ---
//   const [orderStatus, setOrderStatus] = useState(() => {
//     const elapsedMs = new Date() - mountTimeRef.current;
//     const totalMs = duration * 60000;
//     const stage = Math.floor((elapsedMs / totalMs) * 4); 
//     return Math.min(Math.max(stage, 0), 3);
//   });

//   const isCompleted = orderStatus === 3;

//   useEffect(() => {
//     const totalMs = duration * 60000;
//     const timer = setInterval(() => {
//       const elapsedMs = new Date() - mountTimeRef.current;
//       const currentStage = Math.floor((elapsedMs / totalMs) * 4);
//       if (currentStage >= 3) {
//         setOrderStatus(3);
//         clearInterval(timer);
//       } else {
//         setOrderStatus(currentStage);
//       }
//     }, 2000);
//     return () => clearInterval(timer);
//   }, [duration]);

//   // 5. Manual Confirmation Logic
//   const handleConfirmDelivery = () => {
//     setIsConfirmed(true);
//     const completedOrder = {
//       ...orderData,
//       status: 'completed',
//       completedAt: new Date().toISOString()
//     };
//     const existingHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
//     localStorage.setItem('orderHistory', JSON.stringify([completedOrder, ...existingHistory]));
//     localStorage.removeItem('activeOrder');
//     window.dispatchEvent(new Event('active-order-updated'));
//     setTimeout(() => navigate('/'), 2000);
//   };

//   const timelineSteps = [
//     { id: 0, title: "Order Placed", time: deliveryTimes.placed, icon: <FiCheckCircle /> },
//     { id: 1, title: "Kitchen is preparing your meal", time: orderStatus >= 1 ? "Started" : "Waiting...", icon: <FiCoffee /> },
//     { id: 2, title: "Out for delivery", time: orderStatus >= 2 ? `Driver is ${calculatedDistance} km away` : "Driver arriving at restaurant", icon: <FiTruck /> },
//     { id: 3, title: "Estimated Arrival", time: orderStatus === 3 ? "Arrived!" : deliveryTimes.arrival, icon: <FiHome /> },
//   ];

//   const copyAddress = () => {
//     navigator.clipboard.writeText(officeData.address);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="absolute inset-0 bg-[#1C160E] flex flex-col font-sans overflow-hidden">
      
//       {/* 1. Map Header Section */}
//       <div className="relative h-[45%] w-full">
//         <div className="w-full h-full z-0">
//           <MapContainer 
//             key={orderData.restaurantName}
//             center={[orderData.deliveryPosition.lat, orderData.deliveryPosition.lng]} 
//             zoom={15} 
//             zoomControl={false} 
//             style={{ height: '100%', width: '100%', filter: 'invert(100%) hue-rotate(180deg) brightness(80%)' }}
//           >
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//             <Marker position={[orderData.deliveryPosition.lat, orderData.deliveryPosition.lng]} icon={DefaultIcon} />
//           </MapContainer>
//         </div>

//         <div className="absolute top-8 left-6 right-6 z-[1000]">
//           <div className="flex justify-between items-center mb-4">
//             <button onClick={() => navigate(-1)} className="bg-[#1C160E] p-3 rounded-xl shadow-xl active:scale-90 transition-transform border border-white/5">
//               <FiChevronLeft className="text-white" />
//             </button>
            
//             {/* NEW: Navigation Shortcut to Order More */}
//             <div className="flex gap-2">
//                 <button onClick={() => navigate('/')} className="bg-[#1C160E] p-3 rounded-xl shadow-xl active:scale-90 transition-transform flex items-center gap-2 border border-white/5">
//                 <FiPlus className="text-[#F57C1F]" />
//                 <span className="text-white text-[10px] font-black uppercase tracking-widest">Order New</span>
//                 </button>
//                 <button onClick={() => navigate('/')} className="bg-[#1C160E] p-3 rounded-xl shadow-xl active:scale-90 transition-transform flex items-center gap-2 border border-white/5">
//                 <FiHome className="text-[#F57C1F]" />
//                 <span className="text-white text-[10px] font-black uppercase tracking-widest">Home</span>
//                 </button>
//             </div>
//           </div>
          
//           <div className="bg-[#2A1E14]/90 backdrop-blur-md p-5 rounded-[2rem] border border-white/5 shadow-2xl">
//             <div className="flex justify-between items-center mb-4">
//               <span className="font-black text-sm text-white uppercase tracking-tighter">
//                 {isConfirmed ? "Package Received" : isCompleted ? "Order Arrived" : "On the way"}
//               </span>
//               <span className="text-[#F57C1F] font-black text-sm">ETA: {duration} mins</span>
//             </div>
            
//             <div className="space-y-2">
//               <div className="h-1.5 bg-[#3D2C1E] rounded-full overflow-hidden">
//                 <div 
//                   className="h-full bg-[#F57C1F] transition-all duration-1000 ease-linear" 
//                   style={{ width: `${((orderStatus + 1) / 4) * 100}%` }} 
//                 />
//               </div>
//               <div className="flex justify-between px-1">
//                 {['ORDERED', 'PREP', 'WAY', 'DONE'].map((s, i) => (
//                   <span key={s} className={`text-[8px] font-black ${i <= orderStatus ? 'text-[#F57C1F]' : 'text-[#8B7E6F]'}`}>{s}</span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 2. Bottom Content Container */}
//       <div className="flex-1 bg-[#1C160E] -mt-12 rounded-t-[3rem] p-8 shadow-[0_-20px_60px_rgba(0,0,0,0.8)] z-[1001] overflow-y-auto no-scrollbar border-t border-white/5">
        
//         {/* DRIVER INFO */}
//         <div className="flex items-center justify-between mb-10">
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <img src={driverData.avatar} className="w-16 h-16 rounded-[1.5rem] object-cover border-2 border-[#2A1E14]" alt="Driver" />
//               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#1C160E] rounded-full" />
//             </div>
//             <div>
//               <h3 className="text-lg font-black text-white">{driverData.name}</h3>
//               <p className="text-[10px] text-[#8B7E6F] font-bold uppercase tracking-widest">{driverData.vehicle} • {driverData.plate}</p>
//             </div>
//           </div>
//           <div className="flex gap-3">
//             <button onClick={() => window.location.href = `sms:${driverData.phone}`} className="bg-[#2A1E14] p-4 rounded-2xl border border-white/5 active:scale-90 transition-transform">
//               <FiMessageSquare className="text-[#F57C1F]" />
//             </button>
//             <button onClick={() => window.location.href = `tel:${driverData.phone}`} className="bg-[#F57C1F] p-4 rounded-2xl shadow-lg shadow-orange-900/40 active:scale-90 transition-transform">
//               <FiPhone className="text-white" />
//             </button>
//           </div>
//         </div>

//         <div className="space-y-10 relative mb-10">
//           {timelineSteps.map((step, index) => (
//             <div key={step.id} className="flex gap-6 relative">
//               {index < 3 && (
//                 <div className={`absolute top-8 left-3.5 w-[2px] h-10 ${orderStatus > index ? 'bg-[#F57C1F]' : 'bg-[#2A1E14]'}`} />
//               )}
//               <div className={`w-7 h-7 flex items-center justify-center z-10 ${orderStatus >= index ? 'text-[#F57C1F]' : 'text-[#3D2C1E]'}`}>
//                 {step.icon}
//               </div>
//               <div>
//                 <p className={`font-black text-sm ${orderStatus >= index ? 'text-white' : 'text-[#3D2C1E]'}`}>{step.title}</p>
//                 <p className={`text-[11px] font-bold ${orderStatus === index ? 'text-[#F57C1F]' : 'text-[#8B7E6F]'}`}>{step.time}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* 3. DYNAMIC BUTTON (Help OR Confirmation) */}
//         {isCompleted && !isConfirmed ? (
//           <button 
//             onClick={handleConfirmDelivery}
//             className="w-full bg-[#F57C1F] text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-lg shadow-orange-900/40 flex items-center justify-center gap-3 active:scale-95 transition-all animate-pulse"
//           >
//             <FiPackage size={20}/> Confirm Item Received
//           </button>
//         ) : isConfirmed ? (
//           <div className="w-full bg-green-500/10 border border-green-500/20 text-green-500 py-5 rounded-3xl font-black uppercase text-center flex items-center justify-center gap-3">
//             <FiCheckCircle size={20}/> Delivery Accepted
//           </div>
//         ) : (
//           <button 
//             onClick={() => setShowSupport(true)}
//             className="w-full bg-[#2A1E14] py-5 rounded-2xl border border-white/5 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
//           >
//             <FiHelpCircle className="text-[#8B7E6F]" />
//             <span className="text-[10px] font-black uppercase text-[#8B7E6F]">Order Help & Support</span>
//           </button>
//         )}
//       </div>

//       {/* Support Pop-up Modal */}
//       {showSupport && (
//         <div className="fixed inset-0 z-[2000] flex items-center justify-center px-6">
//           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSupport(false)} />
//           <div className="relative bg-[#2A1E14] w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
//             <button onClick={() => setShowSupport(false)} className="absolute top-6 right-6 text-[#8B7E6F]"><FiX size={20}/></button>
//             <div className="flex flex-col items-center text-center">
//               <div className="w-16 h-16 bg-[#F57C1F]/10 rounded-full flex items-center justify-center mb-6">
//                 <FiMapPin className="text-[#F57C1F]" size={28} />
//               </div>
//               <h2 className="text-xl font-black text-white mb-2">Office Headquarters</h2>
              
//               {/* NEW: BUTTON TO PLACE ANOTHER ORDER IN MODAL */}
//               <button 
//                 onClick={() => navigate('/')}
//                 className="mb-6 w-full bg-[#F57C1F]/20 text-[#F57C1F] py-3 rounded-2xl font-black uppercase text-[10px] border border-[#F57C1F]/30 active:scale-95 transition-transform"
//               >
//                 + Make Another Order
//               </button>

//               <div className="flex items-center gap-2 group cursor-pointer" onClick={copyAddress}>
//                 <p className="text-[#8B7E6F] text-sm leading-relaxed">
//                   {officeData.address.split(', ').slice(0, 2).join(', ')}<br/>
//                   {officeData.address.split(', ').slice(2).join(', ')}
//                 </p>
//                 <button className="text-[#F57C1F] opacity-50 group-hover:opacity-100 transition-opacity">
//                   {copied ? <FiCheck /> : <FiCopy />}
//                 </button>
//               </div>
//               <div className="w-full h-[1px] bg-white/5 my-6" />
//               <div className="space-y-4 w-full">
//                 <div className="flex justify-between text-xs">
//                   <span className="text-[#8B7E6F] font-bold uppercase">Customer Line</span>
//                   <span className="text-white font-black">{officeData.phone}</span>
//                 </div>
//                 <div className="flex justify-between text-xs">
//                   <span className="text-[#8B7E6F] font-bold uppercase">Email Support</span>
//                   <span className="text-white font-black">{officeData.email}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LiveTracking;