import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../Contexts/userContext";
import {
  HelpCircle,
  Bell,
  ChevronRight,
  ChevronDown,
  CreditCard,
  Settings,
} from "lucide-react";
import SettingsPopup from "./Settings/SettingsPopup";
import  UserDropdown from "./Userdropdown";

const SideBar = () => {
  const { user } = useUser();
  const location = useLocation();
  const settingsRef = useRef(null);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const userName = user?.name || "User";
  const userEmail = user?.email || "user@example.com";
  const plan = user?.plan || "Public Plan";
  const members = user?.members || "1 Member";
  const avatar = user?.avatar || "https://i.pravatar.cc/24?img=5";

  const navigationItems = [
    { path: "/dashboard", label: "Projects", icon: "📁" },
    { path: "/workflow", label: "Workflows", icon: "🧩" },
    { path: "/monitoring", label: "Monitoring", icon: "📊" },
    { path: "/deployment", label: "Deployments", icon: "🚀" },
    { path: "/explore", label: "Explore", icon: "🔎" },
  ];

  const isActivePage = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  const handleSettingsClick = (e) => {
    e.preventDefault();
    setShowSettingsPopup((prev) => !prev);
  };

  return (
    <>
      <div className="h-screen bg-gradient-to-b from-[#B726C5] to-[#506dff] text-white w-full flex flex-col justify-between relative">
        {/* Top */}
        <div className="p-3 md:p-4 flex-1 flex flex-col justify-start min-h-0">
          {/* Logo */}
          <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-lg flex items-center justify-center font-bold text-purple-600 text-xs md:text-base">
              R
            </div>
            <span className="text-lg md:text-xl font-semibold">roboflow</span>
          </div>

          {/* User Info */}
          <div className="mb-3 md:mb-4">
            <div className="text-xs md:text-sm font-medium">{userName}</div>
            <div className="text-xs text-white/80">
              {plan} • {members}
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white/10 rounded-xl p-1 pt-2 md:pt-3 space-y-1 text-xs md:text-sm flex-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 md:space-x-3 px-2 py-2 md:py-3 rounded transition-colors ${
                  isActivePage(item.path)
                    ? "bg-white/20 text-white font-medium"
                    : "hover:bg-white/10 text-white/90"
                }`}
              >
                <span className="text-sm md:text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Settings */}
            <button
              ref={settingsRef}
              onClick={handleSettingsClick}
              className={`flex items-center justify-between w-full px-2 py-2 md:py-3 rounded transition-colors ${
                showSettingsPopup
                  ? "bg-white/20 text-white font-medium"
                  : "hover:bg-white/10 text-white/90"
              }`}
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <Settings size={14} className="md:w-4 md:h-4" />
                <span>Settings</span>
              </div>
              <ChevronRight
                size={12}
                className={`md:w-3.5 md:h-3.5 transition-transform ${
                  showSettingsPopup ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="p-3 md:p-4 relative">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 md:p-3 space-y-1 md:space-y-2 text-xs md:text-sm text-white relative">
            <button className="flex items-center justify-between w-full hover:bg-white/10 px-2 py-1.5 md:py-2 rounded">
              <div className="flex items-center space-x-2">
                <HelpCircle size={14} className="md:w-4 md:h-4" />
                <span>Help & Docs</span>
              </div>
              <ChevronRight size={12} className="md:w-3.5 md:h-3.5" />
            </button>

            <button className="flex items-center justify-between w-full hover:bg-white/10 px-2 py-1.5 md:py-2 rounded">
              <div className="flex items-center space-x-2">
                <Bell size={14} className="md:w-4 md:h-4" />
                <span>Notifications</span>
              </div>
              <ChevronRight size={12} className="md:w-3.5 md:h-3.5" />
            </button>

            {/* Avatar + Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown((prev) => !prev)}
                className="flex items-center justify-between w-full hover:bg-white/10 px-2 py-1.5 md:py-2 rounded"
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={avatar}
                    alt="Profile"
                    className="w-5 h-5 rounded-full"
                  />
                  <span>{userName}</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    showUserDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showUserDropdown && (
                <div className="absolute top-full  left-50 z-40  w-64">
                  <UserDropdown onClose={() => setShowUserDropdown(false)} />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 text-xs text-white/90 px-2 py-1">
              <CreditCard size={12} className="md:w-3.5 md:h-3.5" />
              <span>0 credits used</span>
            </div>

            <div className="text-xs text-white/70 px-2 pb-1 md:pb-2">
              Resets on June 30
            </div>

            <div>
              <button className="w-full bg-white text-purple-600 font-semibold text-xs md:text-sm rounded-lg py-1.5 md:py-2 hover:bg-white/90 transition">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSettingsPopup && (
        <SettingsPopup
          anchorRef={settingsRef}
          onClose={() => setShowSettingsPopup(false)}
        />
      )}
    </>
  );
};

export default SideBar;
