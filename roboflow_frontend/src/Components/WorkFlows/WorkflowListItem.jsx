import React from 'react';
import { ArrowRight } from 'lucide-react';

const WorkflowListItem = ({ name, lastUpdated }) => {
  return (
    <div className="grid grid-cols-2 items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-1 font-medium">
        {name}
        <ArrowRight className="w-4 h-4 text-gray-400" />
      </div>
      <div className="text-gray-600">{lastUpdated}</div>
    </div>
  );
};

export default WorkflowListItem;
