import React from 'react';
import { FiTrendingUp, FiDollarSign, FiBell } from 'react-icons/fi';

const AdminDashboard = () => {
  return (
    <div className="max-w-md mx-auto bg-brand-dark min-h-screen text-[#EDE8E2] p-5 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-brand-card p-2 rounded-xl border border-brand-border">
          <div className="grid grid-cols-2 gap-1 w-5 h-5">
            <div className="bg-brand-orange rounded-sm"></div>
            <div className="bg-brand-orange opacity-50 rounded-sm"></div>
            <div className="bg-brand-orange opacity-50 rounded-sm"></div>
            <div className="bg-brand-orange rounded-sm"></div>
          </div>
        </div>
        <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex gap-3">
          <div className="relative"><FiBell className="text-2xl" /><span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-orange rounded-full border-2 border-brand-dark"></span></div>
          <img src="https://i.pravatar.cc/100" className="w-8 h-8 rounded-full border border-brand-border" alt="profile" />
        </div>
      </div>

      {/* Time Filters */}
      <div className="flex justify-between mb-8 px-2 text-sm font-medium text-gray-500">
        {['Today', 'Week', 'Month', 'Year'].map((t) => (
          <button key={t} className={t === 'Week' ? "text-brand-orange border-b-2 border-brand-orange pb-1" : ""}>{t}</button>
        ))}
      </div>

      {/* Main Revenue Card */}
      <div className="bg-brand-card rounded-3xl p-6 border border-brand-border mb-4">
        <div className="flex justify-between items-start text-gray-400 mb-2">
          <span className="text-sm">Total Revenue</span>
          <div className="bg-brand-orange/10 p-2 rounded-lg"><FiDollarSign className="text-brand-orange" /></div>
        </div>
        <h2 className="text-4xl font-bold mb-2">$42,850.20</h2>
        <div className="flex items-center text-status-green text-sm font-medium">
          <FiTrendingUp className="mr-1" /> +12.5% <span className="text-gray-500 ml-2 font-normal">vs last week</span>
        </div>
      </div>

      {/* Split Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-brand-card p-5 rounded-3xl border border-brand-border">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Active Orders</p>
          <p className="text-3xl font-bold">142</p>
          <p className="text-status-green text-xs mt-1 font-bold">+5.2%</p>
        </div>
        <div className="bg-brand-card p-5 rounded-3xl border border-brand-border">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">New Users</p>
          <p className="text-3xl font-bold">38</p>
          <p className="text-status-green text-xs mt-1 font-bold">+8.1%</p>
        </div>
      </div>

      {/* Graph Section */}
      <div className="bg-brand-card rounded-3xl p-6 border border-brand-border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold">Sales Trends</h3>
          <button className="text-brand-orange text-xs font-bold uppercase">Full Report</button>
        </div>
        <p className="text-gray-500 text-xs">Revenue Growth</p>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-2xl font-bold">$12,450.00</span>
          <span className="text-status-green text-sm">+12%</span>
        </div>
        {/* Mock Wave Path */}
        <div className="h-24 relative overflow-hidden flex items-end justify-between px-1">
           {[30, 60, 45, 70, 40, 20, 80, 50, 20, 70].map((h, i) => (
             <div key={i} style={{height: `${h}%`}} className="w-[8%] bg-gradient-to-t from-brand-orange/40 to-brand-orange rounded-full"></div>
           ))}
        </div>
        <div className="flex justify-between text-[10px] text-gray-600 mt-4 font-bold uppercase tracking-tighter">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;