import React from 'react';

const DedicatedDeployments = () => {
  const deployments = [
    {
      id: 1,
      status: 'Running',
      name: 'https://',
      system: 'CPU / GPU',
      version: '1.0',
      statusColor: 'bg-green-100 text-green-800',
    },
    {
      id: 2,
      status: 'Paused',
      name: 'https://',
      system: 'CPU / GPU',
      version: '1.0',
      statusColor: 'bg-yellow-100 text-yellow-800',
    },
    {
      id: 3,
      status: 'Building',
      name: 'https://',
      system: 'CPU / GPU',
      version: '1.0',
      statusColor: 'bg-blue-100 text-blue-800',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          Run computer vision models on dedicated remote servers...
        </p>
        <div className="flex gap-2 mt-3">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-1 rounded text-sm font-medium transition-colors">
            Upgrade
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors">
            Docs
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
            +New Deployment
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="grid grid-cols-5 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div>Status</div>
            <div>Name</div>
            <div>System</div>
            <div>Version</div>
            <div>Actions</div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {deployments.map((d) => (
            <div key={d.id} className="px-6 py-4">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${d.statusColor}`}>
                    {d.status}
                  </span>
                </div>
                <div className="text-sm text-gray-900">{d.name}</div>
                <div className="text-sm text-gray-500">{d.system}</div>
                <div className="text-sm text-gray-500">{d.version}</div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 transition-colors" />
                  <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DedicatedDeployments;
