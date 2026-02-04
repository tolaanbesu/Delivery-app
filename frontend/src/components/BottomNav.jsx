import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiSearch, FiShoppingBag, FiUser, 
  FiGrid, FiBarChart2, FiLayers, FiSettings, FiPlusSquare 
} from 'react-icons/fi';

const BottomNav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Hide Nav on Auth screens (Login/Signup)
  const isAuthPage = ['/login', '/signup'].includes(pathname);
  if (isAuthPage) return null;

  // Determine if we are in Admin or User mode
  const isAdmin = pathname.startsWith('/admin');

  // Icons for Admin [based on admin dashboard images]
  const adminTabs = [
    { id: 'dash', icon: <FiGrid />, path: '/admin/dashboard', label: 'Home' },
    { id: 'menu', icon: <FiLayers />, path: '/admin/menu', label: 'Menu' },
    { id: 'orders', icon: <FiShoppingBag />, path: '/admin/orders', label: 'Live' },
    { id: 'partners', icon: <FiPlusSquare />, path: '/admin/partners', label: 'Add' },
    { id: 'settings', icon: <FiSettings />, path: '/admin/dashboard', label: 'Set' },
  ];

  // Icons for Users [based on checkout/landing images]
  const userTabs = [
    { id: 'home', icon: <FiHome />, path: '/', label: 'Home' },
    { id: 'search', icon: <FiSearch />, path: '/discovery', label: 'Search' },
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
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`text-2xl transition-all duration-300 ${
              isActive ? 'text-[#F57C1F] scale-110 drop-shadow-[0_0_8px_rgba(245,124,31,0.5)]' : 'text-gray-600'
            }`}>
              {tab.icon}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${
              isActive ? 'text-[#F57C1F]' : 'text-gray-600'
            }`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;