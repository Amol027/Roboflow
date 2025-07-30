import React from "react";
import { useUser } from "../Contexts/userContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";

const UserDropdown = ({ onClose }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-white text-gray-900 shadow-lg border rounded-lg text-sm ml-10">
      <div className="px-4 py-3 border-b ">
        <div className="flex items-center gap-2">
          <img
            src={user?.avatar || "https://i.pravatar.cc/24?img=5"}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="font-semibold">{user?.full_name || user?.name}</p>
            <p className="text-xs text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>
      <ul className="py-1">
        <li
          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer gap-2"
          onClick={() => {
            navigate("/settings/account");
            onClose();
          }}
        >
          <Settings className="w-4 h-4" /> Account settings
        </li>
        <li
          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer gap-2 text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </li>
      </ul>
    </div>
  );
};

export default UserDropdown;