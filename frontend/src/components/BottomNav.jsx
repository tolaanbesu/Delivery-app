import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { 
  FiHome, FiSearch, FiShoppingBag, FiUser, 
  FiGrid, FiLayers, FiSettings, FiPlusSquare, FiMapPin
} from 'react-icons/fi';

const BottomNav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // --- UPDATED LOGIC TO CHECK ARRAY ---
  const [activeOrder, setActiveOrder] = useState(() => {
    const loggedInEmail = localStorage.getItem('loggedInUserEmail');
    const stored = JSON.parse(localStorage.getItem('activeOrders') || '[]');
    return stored.find(order => order.user?.email === loggedInEmail) || null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('loggedInUserEmail');
  });

  useEffect(() => {
    const syncOrder = () => {
      const loggedInEmail = localStorage.getItem('loggedInUserEmail');
      const stored = JSON.parse(localStorage.getItem('activeOrders') || '[]');
      setActiveOrder(stored.find(order => order.user?.email === loggedInEmail) || null);
    };

    const syncAuth = () => {
      setIsLoggedIn(!!localStorage.getItem('loggedInUserEmail'));
    };

    window.addEventListener('storage', syncOrder);
    window.addEventListener('storage', syncAuth);
    window.addEventListener('active-order-updated', syncOrder);

    return () => {
      window.removeEventListener('storage', syncOrder);
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('active-order-updated', syncOrder);
    };
  }, []);

  // Hide Nav on Auth screens
  const isAuthPage = ['/login', '/signup'].includes(pathname);
  if (isAuthPage) return null;

  // Determine if Admin
  const isAdmin = pathname.startsWith('/admin');

  // Admin tabs
  const adminTabs = [
    { id: 'dash', icon: <FiGrid />, path: '/admin/dashboard', label: 'Home' },
    { id: 'menu', icon: <FiLayers />, path: '/admin/menu', label: 'Menu' },
    { id: 'orders', icon: <FiShoppingBag />, path: '/admin/orders', label: 'Live' },
    { id: 'partners', icon: <FiPlusSquare />, path: '/admin/partners', label: 'Add' },
    { id: 'settings', icon: <FiSettings />, path: '/admin/dashboard', label: 'Set' },
  ];

  // 🔐 Logged-in user email
  const loggedInEmail = localStorage.getItem('loggedInUserEmail');

  // User tabs (🔥 Track added ONLY if order belongs to this user)
  const userTabs = [
    { id: 'home', icon: <FiHome />, path: '/', label: 'Home' },
    { id: 'search', icon: <FiSearch />, path: '/discovery', label: 'Search' },

    ...(activeOrder &&
      isLoggedIn &&
      activeOrder.user?.email === loggedInEmail
      ? [{
          id: 'track',
          icon: <FiMapPin />,
          path: '/tracking',
          label: 'Track',
          live: true
        }]
      : []),

    { id: 'cart', icon: <FiShoppingBag />, path: '/checkout', label: 'Cart' },
    { id: 'profile', icon: <FiUser />, path: '/profile', label: 'Profile' },
  ];

  const activeTabs = isAdmin ? adminTabs : userTabs;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#1C160E]/95 backdrop-blur-lg border-t border-[#2A1E14] px-6 py-4 flex justify-between items-center z-50">
      {activeTabs.map((tab) => {
        const isActive = pathname === tab.path;

        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className="relative flex flex-col items-center gap-1 group"
          >
            {/* Icon */}
            <div
              className={`relative text-2xl transition-all duration-300 ${
                isActive
                  ? 'text-[#F57C1F] scale-110 drop-shadow-[0_0_8px_rgba(245,124,31,0.5)]'
                  : 'text-gray-600'
              }`}
            >
              {tab.icon}

              {/* 🔴 Live pulse indicator */}
              {tab.live && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F57C1F] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F57C1F]"></span>
                </span>
              )}
            </div>

            {/* Label */}
            <span
              className={`text-[9px] font-black uppercase tracking-widest ${
                isActive ? 'text-[#F57C1F]' : 'text-gray-600'
              }`}
            >
              {tab.label}
            </span>

            {/* 🕒 ETA badge (optional) */}
            {tab.live && activeOrder?.eta && (
              <span className="absolute -top-3 text-[8px] px-2 py-[2px] rounded-full bg-[#F57C1F]/20 text-[#F57C1F] font-black">
                {activeOrder.eta}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
