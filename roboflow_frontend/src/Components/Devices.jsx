const Devices = () => {
  const devices = [
    {
      id: 1,
      status: 'Running',
      name: 'Device 1',
      system: 'CPU / GPU',
      version: '1.0',
      lastUpdated: '2023-10-01',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 2,
      status: 'Running',
      name: 'Device 2',
      system: 'CPU / GPU',
      version: '1.0',
      lastUpdated: '2023-10-01',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 3,
      status: 'Paused',
      name: 'Device 3',
      system: 'CPU / GPU',
      version: '1.1',
      lastUpdated: '2023-09-15',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 4,
      status: 'Paused',
      name: 'Device 4',
      system: 'CPU / GPU',
      version: '1.1',
      lastUpdated: '2023-09-15',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 5,
      status: 'Stopped',
      name: 'Device 5',
      system: 'CPU / GPU',
      version: '1.2',
      lastUpdated: '2023-08-20',
      statusColor: 'bg-pink-100 text-pink-800'
    },
    {
      id: 6,
      status: 'Stopped',
      name: 'Device 6',
      system: 'CPU / GPU',
      version: '1.2',
      lastUpdated: '2023-08-20',
      statusColor: 'bg-pink-100 text-pink-800'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Description */}
      <p className="text-gray-600">
        Deploy your model to an NVIDIA Jetson to run inference on the edge.
      </p>

      {/* Devices Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="grid grid-cols-5 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div>Status</div>
            <div>Name</div>
            <div>System</div>
            <div>Version</div>
            <div>Last Updated</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {devices.map((device) => (
            <div key={device.id} className="px-6 py-4">
              <div className="grid grid-cols-5 gap-4 items-center">
                {/* Status */}
                <div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${device.statusColor}`}>
                    {device.status}
                  </span>
                </div>
                
                {/* Name */}
                <div className="text-sm text-gray-900">
                  {device.name}
                </div>
                
                {/* System */}
                <div className="text-sm text-gray-500">
                  {device.system}
                </div>
                
                {/* Version */}
                <div className="text-sm text-gray-500">
                  {device.version}
                </div>
                
                {/* Last Updated */}
                <div className="text-sm text-gray-500">
                  {device.lastUpdated}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Devices;