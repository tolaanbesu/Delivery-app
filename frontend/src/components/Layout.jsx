import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="bg-[#0D0B08] min-h-screen w-full flex justify-center items-start md:py-10">
      {/* On mobile (default), width is 100%. 
         On desktop (md:), we fix the width to a mobile ratio (max-w-md) 
         and add a subtle outer glow/shadow like a device frame.
      */}
      <div className="w-full max-w-md min-h-screen md:min-h-[850px] bg-[#1C160E] relative flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] md:rounded-[3rem] overflow-hidden border-[#2A1E14] md:border-8">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          {children}
        </main>

      </div>
    </div>
  );
};

export default Layout;