import React from 'react';

const WorkflowHeader = () => (
  <div className="bg-white border-b border-gray-200 w-full">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h1 className="text-2xl font-semibold text-gray-900">Workflows</h1>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
          Invite Team
        </button>
      </div>
    </div>
  </div>
);

export default WorkflowHeader;
