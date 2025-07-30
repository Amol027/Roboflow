import React from 'react';
import { ArrowLeft, User } from 'lucide-react';

const SettingsHeader = ({ title, onBack, user }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded">
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </button>
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
    </div>
    {user && (
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="font-medium text-gray-900">{user.name}</div>
          <div className="text-sm text-gray-600">{user.email}</div>
        </div>
        <div className="w-8 h-8 background-gray-200 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      </div>
    )}
  </div>
);

export default SettingsHeader;
