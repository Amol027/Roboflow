import React from 'react';
import EmptyStateIcon from './EmptyStateIcon';

const BatchJobs = ({ onCreateJob }) => (
  <div className="space-y-6">
    <p className="text-gray-600">
      Process large sets of images or videos through a workflow.
    </p>
    <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">
      <div>NAME</div>
      <div>STATUS</div>
      <div>NOTIFICATION</div>
      <div>WORKFLOW</div>
      <div>ACTIONS</div>
    </div>
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-6">
        <EmptyStateIcon />
      </div>
      <p className="text-gray-500 text-lg mb-6">
        This workspace does not contain any jobs
      </p>
      <button
        onClick={onCreateJob}
        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        +Create New Job
      </button>
    </div>
  </div>
);

export default BatchJobs;
