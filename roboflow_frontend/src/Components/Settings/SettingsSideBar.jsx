import React from 'react';
import { User } from 'lucide-react';

const SettingsSideBar = ({ activeSection, onSectionChange, user }) => {
  const sections = [
    { id: 'account', label: 'Account' },
    { id: 'workspaces', label: 'WORKSPACES', isHeader: true },
    { id: 'plan-billing', label: 'Plan & Billing' },
    { id: 'usage', label: 'Usage' },
    { id: 'team-members', label: 'Team Members' },
    { id: 'api-keys', label: 'Api Keys' },
    { id: 'third-party', label: 'Third Party Keys' },
  ];

  return (
    <div className="w-48 bg-gray-50 p-4 border-r">
      {user && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <span className="font-medium text-sm text-gray-900">{user.name}</span>
          </div>
          <div className="text-xs text-gray-600">{user.plan}</div>
          <div className="text-xs text-gray-600">{user.members}</div>
        </div>
      )}
      {sections.map((section) => (
        section.isHeader ? (
          <div key={section.id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-6 mb-2">
            {section.label}
          </div>
        ) : (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full text-left px-3 py-2 text-sm rounded mb-1 ${
              activeSection === section.id
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {section.label}
          </button>
        )
      ))}
    </div>
  );
};

export default SettingsSideBar;
