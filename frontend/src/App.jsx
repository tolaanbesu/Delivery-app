import React, { useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layout & Shared Components
import Layout from './components/Layout';
import BottomNav from './components/BottomNav';

// Auth Pages
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import MenuEditor from './pages/admin/MenuEditor';
import OrderBoard from './pages/admin/OrderBoard';
import RestaurantMgmt from './pages/admin/RestaurantMgmt';

// User Pages
import LandingPage from './pages/user/LandingPage';
import Discovery from './pages/user/Discovery';
import RestaurantMenu from './pages/user/RestaurantMenu';
import Checkout from './pages/user/Checkout';
import LiveTracking from './pages/user/LiveTracking';
import Profile from './pages/user/Profile';

// --- 1. DEFINE PROTECTED ROUTE OUTSIDE ---
// This prevents the "created during render" error.
const ProtectedRoute = ({ token, children }) => {
  const backupToken  = localStorage.getItem('userToken');

  if (!token && !backupToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = () => {
  const location = useLocation();
  
  
  // Manage Auth state
  const [token, setToken] = useState(() => localStorage.getItem('userToken'));

  // Sync state with localStorage
  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     setToken(localStorage.getItem('userToken'));
  //   };
  //   window.addEventListener('storage', handleStorageChange);
  //   return () => window.removeEventListener('storage', handleStorageChange);
  // }, []);

  const hideNavbar = location.pathname.includes('/restaurant/') || 
                    location.pathname === '/checkout' || 
                    location.pathname === '/tracking' ||
                    location.pathname === '/login' || 
                    location.pathname === '/signup';

  return (
    <Layout>
      
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={<Login setToken={setToken} />} 
        />
        <Route path="/signup" element={<SignUp setToken={setToken}/>} />
        <Route path="/" element={<LandingPage token={token}/>} />
        <Route path="/discovery" element={<Discovery />} />

        {/* Protected Admin Routes - Passing 'token' as a prop */}
        <Route path="/admin/dashboard" element={<ProtectedRoute token={token}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/menu" element={<ProtectedRoute token={token}><MenuEditor /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute token={token}><OrderBoard /></ProtectedRoute>} />
        <Route path="/admin/partners" element={<ProtectedRoute token={token}><RestaurantMgmt /></ProtectedRoute>} />

        {/* Protected User Routes */}
        <Route path="/restaurant/:id" element={<ProtectedRoute token={token}><RestaurantMenu /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute token={token}><Checkout /></ProtectedRoute>} />
        <Route path="/tracking" element={<ProtectedRoute token={token}><LiveTracking /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute token={token}><Profile /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {!hideNavbar && <BottomNav />}
    </Layout>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
// // Layout & Shared Components
// import Layout from './components/Layout';
// import BottomNav from './components/BottomNav';

// // Auth Pages
// import Login from './pages/auth/Login';
// import SignUp from './pages/auth/SignUp';

// // Admin Pages
// import AdminDashboard from './pages/admin/Dashboard';
// import MenuEditor from './pages/admin/MenuEditor';
// import OrderBoard from './pages/admin/OrderBoard';
// import RestaurantMgmt from './pages/admin/RestaurantMgmt';

// // User Pages
// import LandingPage from './pages/user/LandingPage';
// import Discovery from './pages/user/Discovery';
// import RestaurantMenu from './pages/user/RestaurantMenu';
// import Checkout from './pages/user/Checkout';
// import LiveTracking from './pages/user/LiveTracking';

// const AppContent = () => {
//   const location = useLocation();
  
//   // Logic to hide the navbar on specific routes
//   const hideNavbar = location.pathname.includes('/restaurant/') || 
//                    location.pathname === '/checkout' || 
//                    location.pathname === '/tracking' ||
//                    location.pathname === '/login' || 
//                    location.pathname === '/signup';

//   return (
//     <Layout>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />

//         {/* Admin Routes */}
//         <Route path="/admin/dashboard" element={<AdminDashboard />} />
//         <Route path="/admin/menu" element={<MenuEditor />} />
//         <Route path="/admin/orders" element={<OrderBoard />} />
//         <Route path="/admin/partners" element={<RestaurantMgmt />} />

//         {/* User Routes */}
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/discovery" element={<Discovery />} />
//         <Route path="/restaurant/:id" element={<RestaurantMenu />} />
//         <Route path="/checkout" element={<Checkout />} />
//         <Route path="/tracking" element={<LiveTracking />} />

//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>

//       {/* Now hideNavbar will work because it's inside the Router context */}
//       {!hideNavbar && <BottomNav />}
//     </Layout>
//   );
// };

// const App = () => {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// };

// export default App;


