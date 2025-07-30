import React from 'react';

const Tabs = ({ tabs, activeTab, setActiveTab }) => (
  <div className="flex space-x-8 border-b border-gray-200">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`pb-2 px-1 text-sm font-medium transition-colors ${
          activeTab === tab
            ? 'text-purple-600 border-b-2 border-purple-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default Tabs;
