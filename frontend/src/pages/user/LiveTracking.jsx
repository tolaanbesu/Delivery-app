import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { FiChevronLeft, FiMessageSquare, FiPhone, FiTruck, FiCheckCircle, FiCoffee, FiHome, FiHelpCircle, FiX, FiMapPin, FiCopy, FiCheck } from 'react-icons/fi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- IMPORT DYNAMIC DATA ---
import { driverData, officeData } from '../../utils/data';

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
  const navigate = useNavigate();
  const location = useLocation();
  const [showSupport, setShowSupport] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Use location state for order details, fallback to office/driver defaults
  const orderData = useMemo(() => {
    return location.state?.orderDetails || {
      restaurantName: "Express Eats",
      deliveryPosition: officeData.coordinates,
      user: { name: "Guest", phone: "0911000000" }
    };
  }, [location.state]);

  const [times] = useState(() => {
    const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const now = new Date();
    return {
      placed: formatTime(new Date(now.getTime() - 20 * 60000)),
      prep: formatTime(new Date(now.getTime() - 5 * 60000)),
      arrival: formatTime(new Date(now.getTime() + 15 * 60000)) 
    };
  });

  const [orderStatus] = useState(2); 

  const timelineSteps = [
    { id: 0, title: "Order Placed", time: times.placed, icon: <FiCheckCircle />, status: "ORDERED" },
    { id: 1, title: "Kitchen is preparing your meal", time: times.prep, icon: <FiCoffee />, status: "PREP" },
    { id: 2, title: "Out for delivery", time: `Driver is ${driverData.distance} away`, icon: <FiTruck />, status: "WAY" },
    { id: 3, title: "Estimated Arrival", time: times.arrival, icon: <FiHome />, status: "DONE" },
  ];

  const handleCallDriver = () => {
    window.location.href = `tel:${driverData.phone}`;
  };

  const handleMessageDriver = () => {
    window.location.href = `sms:${driverData.phone}?body=Hello ${driverData.name}, I'm checking on my order from ${orderData.restaurantName}.`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(officeData.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 bg-[#1C160E] flex flex-col font-sans overflow-hidden">
      
      {/* 1. Map Header Section */}
      <div className="relative h-[45%] w-full">
        <div className="w-full h-full z-0">
          <MapContainer 
            center={[orderData.deliveryPosition.lat, orderData.deliveryPosition.lng]} 
            zoom={15} 
            zoomControl={false} 
            style={{ height: '100%', width: '100%', filter: 'invert(100%) hue-rotate(180deg) brightness(80%)' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[orderData.deliveryPosition.lat, orderData.deliveryPosition.lng]} icon={DefaultIcon} />
          </MapContainer>
        </div>

        <div className="absolute top-8 left-6 right-6 z-[1000]">
          <button onClick={() => navigate(-1)} className="bg-[#1C160E] p-3 rounded-xl mb-4 shadow-xl active:scale-90 transition-transform">
            <FiChevronLeft className="text-white" />
          </button>
          
          <div className="bg-[#2A1E14]/90 backdrop-blur-md p-5 rounded-[2rem] border border-white/5 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="font-black text-sm uppercase tracking-tighter text-white">
                {orderStatus === 3 ? "Delivered" : "On the way"}
              </span>
              <span className="text-[#F57C1F] font-black text-sm">ETA: {times.arrival}</span>
            </div>
            
            <div className="space-y-2">
              <div className="h-1.5 bg-[#3D2C1E] rounded-full overflow-hidden">
                <div 
                    className="h-full bg-[#F57C1F] transition-all duration-1000" 
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
        
        {/* DYNAMIC DRIVER INFO */}
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
            <button onClick={handleMessageDriver} className="bg-[#2A1E14] p-4 rounded-2xl border border-white/5 active:scale-90 transition-transform">
                <FiMessageSquare className="text-[#F57C1F]" />
            </button>
            <button onClick={handleCallDriver} className="bg-[#F57C1F] p-4 rounded-2xl shadow-lg shadow-orange-900/40 active:scale-90 transition-transform">
                <FiPhone className="text-white" />
            </button>
          </div>
        </div>

        <div className="space-y-10 relative">
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

        <button 
          onClick={() => setShowSupport(true)}
          className="w-full mt-12 bg-[#2A1E14] py-5 rounded-2xl border border-white/5 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          <FiHelpCircle className="text-[#8B7E6F]" />
          <span className="text-[10px] font-black uppercase text-[#8B7E6F]">Order Help & Support</span>
        </button>
      </div>

      {/* Support Pop-up Modal - DYNAMIC OFFICE INFO */}
      {showSupport && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSupport(false)} />
          <div className="relative bg-[#2A1E14] w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
            <button onClick={() => setShowSupport(false)} className="absolute top-6 right-6 text-[#8B7E6F]"><FiX size={20}/></button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#F57C1F]/10 rounded-full flex items-center justify-center mb-6">
                <FiMapPin className="text-[#F57C1F]" size={28} />
              </div>
              <h2 className="text-xl font-black text-white mb-2">Office Headquarters</h2>
              <div className="flex items-center gap-2 group cursor-pointer" onClick={copyAddress}>
                <p className="text-[#8B7E6F] text-sm leading-relaxed">
                  {officeData.address.split(', ').slice(0, 2).join(', ')}<br/>
                  {officeData.address.split(', ').slice(2).join(', ')}
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