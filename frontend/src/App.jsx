import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
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

const AppContent = () => {
  const location = useLocation();
  
  // Logic to hide the navbar on specific routes
  const hideNavbar = location.pathname.includes('/restaurant/') || 
                     location.pathname === '/login' || 
                     location.pathname === '/signup';

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/menu" element={<MenuEditor />} />
        <Route path="/admin/orders" element={<OrderBoard />} />
        <Route path="/admin/partners" element={<RestaurantMgmt />} />

        {/* User Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/discovery" element={<Discovery />} />
        <Route path="/restaurant/:id" element={<RestaurantMenu />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/tracking" element={<LiveTracking />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* Now hideNavbar will work because it's inside the Router context */}
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

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
