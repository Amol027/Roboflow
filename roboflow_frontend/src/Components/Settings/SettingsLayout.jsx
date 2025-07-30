import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, CreditCard, BarChart3,
  Users, Key, ExternalLink, UserCircle
} from 'lucide-react';
import { useUser } from '../../Contexts/userContext';

const SettingsLayout = () => {
  const { user, loading } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarItems = [
    { id: 'account', label: 'Account', icon: UserCircle, path: '/settings/account' },
    { id: 'plan-billing', label: 'Plan & Billing', icon: CreditCard, path: '/settings/plan-billing' },
    { id: 'usage', label: 'Usage', icon: BarChart3, path: '/settings/usage' },
    { id: 'team-members', label: 'Team Members', icon: Users, path: '/settings/team-members' },
    { id: 'api-keys', label: 'API Keys', icon: Key, path: '/settings/api-keys' },
    { id: 'third-party-keys', label: 'Third Party Keys', icon: ExternalLink, path: '/settings/third-party-keys' },
  ];

  const getCurrentSectionTitle = () => {
    const currentPath = location.pathname;
    const currentItem = sidebarItems.find(item => item.path === currentPath);
    return currentItem ? currentItem.label : 'Settings';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen ml-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed top-0 left-0 z-10">
        {user && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <div>{user.plan || 'Free Plan'}</div>
              <div>{user.members || '1 Member'}</div>
            </div>
          </div>
        )}

        <div className="px-6 py-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Workspace Settings
          </h3>
        </div>

        <nav className="flex-1 px-4 pb-6 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md mb-1 transition-colors
                  ${isActive ? 'bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                `}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content area */}
      <main className="ml-64 flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {getCurrentSectionTitle()}
              </h1>
            </div>

            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsLayout;
