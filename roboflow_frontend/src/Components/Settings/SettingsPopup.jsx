import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, CreditCard, BarChart3, Users, Key, ExternalLink } from 'lucide-react';

const settingsOptions = [
  { label: 'Account', path: '/settings/account', icon: UserCircle, description: 'Personal info and preferences' },
  { label: 'Plan & Billing', path: '/settings/plan-billing', icon: CreditCard, description: 'Subscription and payments' },
  { label: 'Usage', path: '/settings/usage', icon: BarChart3, description: 'Monitor API usage and limits' },
  { label: 'Team Members', path: '/settings/team-members', icon: Users, description: 'Manage collaborators' },
  { label: 'API Keys', path: '/settings/api-keys', icon: Key, description: 'Create and manage API keys' },
  { label: 'Third Party Keys', path: '/settings/third-party-keys', icon: ExternalLink, description: 'External integrations' },
];

const SettingsPopup = ({ anchorRef, onClose }) => {
  const popupRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, anchorRef]);

  const getPopupPosition = () => {
    if (!anchorRef?.current) return { top: 100, left: 300 };

    const anchorRect = anchorRef.current.getBoundingClientRect();
    const top = anchorRect.top + window.scrollY + 40;
    const left = anchorRect.right + 10;
    return { top, left };
  };

  const { top, left } = getPopupPosition();

  const handleOptionClick = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      ref={popupRef}
      className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 text-sm w-72 overflow-hidden"
      style={{ top, left }}
    >
      <div className="p-2 bg-gray-50 border-b border-gray-200">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide px-2">
          Workspace Settings
        </h3>
      </div>
      {settingsOptions.map((option, index) => {
        const Icon = option.icon;
        return (
          <button
            key={option.path}
            onClick={() => handleOptionClick(option.path)}
            className={`
              w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors
              flex items-start gap-3 group
              ${index !== settingsOptions.length - 1 ? 'border-b border-gray-100' : ''}
            `}
          >
            <Icon className="w-4 h-4 text-gray-500 mt-0.5 group-hover:text-gray-700" />
            <div>
              <div className="font-medium text-gray-900 group-hover:text-gray-800">
                {option.label}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {option.description}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default SettingsPopup;
