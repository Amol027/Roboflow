import React, { useState } from 'react';
import { User, Users, Menu, X } from 'lucide-react';
import SideBar from '../Components/SideBar';
import ProjectsContent from '../Components/ProjectContent';

const TopBar = ({ onMenuClick, isMobileMenuOpen }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X size={20} className="text-gray-600" />
          ) : (
            <Menu size={20} className="text-gray-600" />
          )}
        </button>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Projects</h1>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User size={16} className="text-gray-600" />
          </div>
        </div>
        <button className="flex items-center space-x-2 px-3 md:px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          <Users size={16} className="text-gray-600" />
          <span className="text-sm text-gray-700 hidden sm:inline">Invite Team</span>
          <span className="text-sm text-gray-700 sm:hidden">Invite</span>
        </button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar for Desktop */}
      <div className="hidden lg:block fixed top-0 left-0 w-64 h-full z-30 bg-white border-r">
        <SideBar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
          {/* Mobile Sidebar */}
          <div className="fixed left-0 top-0 h-full w-64 bg-white z-50 lg:hidden">
            <SideBar />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex flex-col min-h-screen lg:ml-64">
        <TopBar
          onMenuClick={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <div className="flex-1 p-4 md:p-6">
          <ProjectsContent />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
