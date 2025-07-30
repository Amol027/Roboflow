import React, { useState } from 'react';
import SideBar from './SideBar';
import { Menu } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed height, no scroll */}
      <div className={`
        fixed md:relative top-0 left-0 z-50 w-64 h-screen
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <SideBar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content - Scrollable */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden md:ml-0">
        {/* Mobile Menu Button */}
        <div className="md:hidden p-4 bg-white shadow-sm border-b">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-700 hover:text-black focus:outline-none"
          >
            <Menu />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;