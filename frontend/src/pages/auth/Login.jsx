import React, { useState } from 'react';
import { FiMail, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // State for interactivity
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Logic: Redirect based on toggle
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0B08] flex items-center justify-center p-4 md:p-10 font-sans">
      {/* Background Decorative Glows for Desktop */}
      <div className="hidden md:block absolute top-0 left-0 w-96 h-96 bg-[#F57C1F]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="hidden md:block absolute bottom-0 right-0 w-96 h-96 bg-[#F57C1F]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Container: Mobile stays full, Desktop becomes a centered card */}
      <div className="w-full max-w-md md:max-w-lg bg-[#1C160E] md:rounded-[3rem] md:border md:border-[#2A1E14] p-8 md:p-12 shadow-2xl relative z-10 transition-all duration-500">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-[#F57C1F] p-4 rounded-[24px] shadow-[0_0_30px_rgba(245,124,31,0.3)] mb-4 animate-bounce-slow">
             <div className="w-10 h-10 border-4 border-white rounded-full flex items-center justify-center">
                <span className="font-black text-xl text-white">U</span>
             </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter text-white">Unified Food</h1>
          <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mt-1">Smarter Delivery, Every Time</p>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black mb-2 text-white">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Enter your credentials to continue</p>
        </div>

        {/* Reactive Login Type Toggle */}
        <div className="bg-[#2A1E14] p-1.5 rounded-2xl flex mb-10 border border-[#3D2C1E] relative">
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#3D2C1E] rounded-xl transition-all duration-300 ease-out shadow-lg ${isAdmin ? 'left-[calc(50%+3px)]' : 'left-1.5'}`}
          />
          <button 
            onClick={() => setIsAdmin(false)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm z-10 transition-colors duration-300 ${!isAdmin ? 'text-white' : 'text-gray-500'}`}
          >
            User Login
          </button>
          <button 
            onClick={() => setIsAdmin(true)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm z-10 transition-colors duration-300 ${isAdmin ? 'text-white' : 'text-gray-500'}`}
          >
            Admin Login
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6 mb-8">
          <div className="group">
            <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#F57C1F]">
              Email Address
            </label>
            <div className="relative">
              <input 
                required
                type="email"
                className="w-full bg-[#2A1E14] border border-[#3D2C1E] focus:border-[#F57C1F] focus:ring-1 focus:ring-[#F57C1F]/20 rounded-2xl py-4 px-5 text-sm outline-none transition-all placeholder:text-gray-700 text-white" 
                placeholder="name@example.com" 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <FiMail className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div className="group">
            <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#F57C1F]">
              Password
            </label>
            <div className="relative">
              <input 
                required
                type={showPassword ? "text" : "password"}
                className="w-full bg-[#2A1E14] border border-[#3D2C1E] focus:border-[#F57C1F] focus:ring-1 focus:ring-[#F57C1F]/20 rounded-2xl py-4 px-5 text-sm outline-none transition-all placeholder:text-gray-700 text-white" 
                placeholder="Enter your password" 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Reactive Primary Button */}
          <button 
            type="submit"
            className="group w-full bg-[#F57C1F] hover:bg-[#ff8c37] active:scale-[0.98] py-5 rounded-2xl font-black text-lg text-white shadow-[0_15px_30px_rgba(245,124,31,0.3)] hover:shadow-[0_20px_40px_rgba(245,124,31,0.5)] transition-all duration-300 flex items-center justify-center gap-2"
          >
            Login to Account 
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 font-medium">
          Don't have an account? {' '}
          <button 
            onClick={() => navigate('/signup')}
            className="text-[#F57C1F] font-bold underline hover:text-[#ff8c37] transition-colors"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;