import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { userData } from '../../utils/data';
import defaultAvatar from '../../assets/avatar.jpg';

const SignUp = ({setToken}) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    agreed: false
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setAvatarPreview(URL.createObjectURL(file)); // This creates a local URL for the image
  }
};

useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. Create the new user object
    const newUser = {
      id: userData.length + 1,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      avatar: avatarPreview || defaultAvatar,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      stats: { orders: 0, credits: "$0.00", points: "0" }, // Matched your data format
      menuinfo: {
        history: "0 completed orders",
        addressSummary: "Not set",
        paymentSummary: "Not set",
        rewards: "0 points"
      }
    };

    // 2. Add to the local array
    userData.push(newUser);

    // 3. --- AUTHENTICATION LOGIC ---
    const mockToken = 'user-token-123';
    
    // Save to localStorage so App.js and Checkout.jsx can see it
    localStorage.setItem('userToken', mockToken);
    localStorage.setItem('loggedInUserEmail', newUser.email);

    // Update the global state in App.js
    if (setToken) {
      setToken(mockToken);
    }

    // 4. Navigate to home
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0D0B08] flex items-center justify-center p-4 md:p-10 font-sans relative overflow-hidden">
      {/* Background Decorative Glows for Desktop */}
      <div className="hidden md:block absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#F57C1F]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="hidden md:block absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#F57C1F]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md md:max-w-xl bg-[#1C160E] md:rounded-[3rem] md:border md:border-[#2A1E14] p-6 md:p-12 shadow-2xl relative z-10 transition-all duration-500 overflow-y-auto no-scrollbar max-h-[95vh]">
        
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#F57C1F] p-4 rounded-[24px] shadow-[0_0_30px_rgba(245,124,31,0.3)] mb-4 hover:scale-105 transition-transform duration-300">
            <div className="w-10 h-10 border-4 border-white rounded-full flex items-center justify-center">
              <span className="font-black text-xl text-white">U</span>
            </div>
          </div>
          <h1 className="text-2xl font-black italic text-white tracking-tight">Unified Food</h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Join the Community</p>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black mb-2 text-white">Create Account</h2>
          <p className="text-gray-500 text-sm px-4">Start ordering your favorite meals in seconds</p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#F57C1F]">Full Name</label>
              <div className="relative">
                <input 
                  required
                  className="w-full bg-[#2A1E14] border border-[#3D2C1E] focus:border-[#F57C1F] rounded-2xl py-4 px-5 text-sm outline-none transition-all text-white placeholder:text-gray-700" 
                  placeholder="John Doe" 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <FiUser className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#F57C1F] transition-colors" />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#F57C1F]">Phone Number</label>
              <div className="relative">
                <input 
                  required
                  className="w-full bg-[#2A1E14] border border-[#3D2C1E] focus:border-[#F57C1F] rounded-2xl py-4 px-5 text-sm outline-none transition-all text-white placeholder:text-gray-700" 
                  placeholder="+1 (555) 000-0000" 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                <FiPhone className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#F57C1F] transition-colors" />
              </div>
            </div>
          </div>

          <div className="group">
            <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#F57C1F]">Email Address</label>
            <div className="relative">
              <input 
                required
                type="email"
                className="w-full bg-[#2A1E14] border border-[#3D2C1E] focus:border-[#F57C1F] rounded-2xl py-4 px-5 text-sm outline-none transition-all text-white placeholder:text-gray-700" 
                placeholder="john@example.com" 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <FiMail className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#F57C1F] transition-colors" />
            </div>
          </div>

          <div className="group">
            <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#F57C1F]">Password</label>
            <div className="relative">
              <input 
                required
                type={showPassword ? "text" : "password"}
                className="w-full bg-[#2A1E14] border border-[#3D2C1E] focus:border-[#F57C1F] rounded-2xl py-4 px-5 text-sm outline-none transition-all text-white placeholder:text-gray-700" 
                placeholder="••••••••" 
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

          <div className="flex flex-col items-center mb-4">
            <label className="cursor-pointer relative group">
              <div className="w-20 h-20 rounded-full bg-[#2A1E14] border-2 border-dashed border-[#3D2C1E] flex items-center justify-center overflow-hidden">
                {avatarPreview ? <img src={avatarPreview} className="w-full h-full object-cover" /> : <FiUser className="text-gray-500" size={30} />}
              </div>
              <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              <span className="text-[10px] text-[#F57C1F] font-bold mt-2">Upload Photo</span>
            </label>
          </div>

          {/* Reactive Checkbox */}
          <div className="flex items-center gap-3 py-2 ml-1 group cursor-pointer">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                required
                className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-[#3D2C1E] bg-[#2A1E14] checked:bg-[#F57C1F] checked:border-[#F57C1F] transition-all" 
                id="terms" 
                onChange={(e) => setFormData({...formData, agreed: e.target.checked})}
              />
              <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <label htmlFor="terms" className="text-xs text-gray-400 leading-tight font-medium cursor-pointer group-hover:text-gray-300 transition-colors">
              I agree to the <span className="text-[#F57C1F] hover:underline font-bold">Terms of Service</span> and <span className="text-[#F57C1F] hover:underline font-bold">Privacy Policy</span>
            </label>
          </div>

          {/* Action Button */}
          <button 
            type="submit"
            className="group w-full bg-[#F57C1F] py-5 rounded-2xl font-black text-lg text-white shadow-[0_15px_30px_rgba(245,124,31,0.3)] hover:shadow-[0_20px_40px_rgba(245,124,31,0.5)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 mb-6"
          >
            Create Account <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 font-medium">
          Already have an account? {' '}
          <button 
            onClick={() => navigate('/login')}
            className="text-[#F57C1F] font-bold cursor-pointer hover:underline hover:text-[#ff8c37] transition-colors"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;