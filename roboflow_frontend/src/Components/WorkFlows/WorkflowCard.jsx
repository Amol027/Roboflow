import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const WorkflowCard = ({ workflow }) => {
  const isCenterItem = (index) => Math.floor(workflow.items.length / 2) === index;

  return (
    <div className="rounded-lg border border-gray-300 overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
      {/* Canvas Area */}
      <div className="bg-gray-200 p-4 h-48 flex flex-col justify-center items-center gap-3">
        {workflow.items.map((item, index) => (
          <div
            key={index}
            className={`px-4 py-1 rounded text-sm text-center w-40 ${
              isCenterItem(index) ? 'bg-gray-100 text-gray-600' : 'bg-white text-gray-800'
            }`}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">{workflow.name}</h3>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default WorkflowCard;
