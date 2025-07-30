import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import BatchJobs from './BatchJobs';
import DedicatedDeployments from './DedicatedDeployments';
import Devices from './Devices';
import Tabs from './Tabs';

const DeploymentsList = ({ onCreateJob }) => {
  const [activeTab, setActiveTab] = useState('Batch Jobs');
  const tabs = ['Batch Jobs', 'Dedicated Deployments', 'Devices'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Batch Jobs':
        return <BatchJobs onCreateJob={onCreateJob} />;
      case 'Dedicated Deployments':
        return <DedicatedDeployments />;
      case 'Devices':
        return <Devices />;
      default:
        return <BatchJobs onCreateJob={onCreateJob} />;
    }
  };

  const getButtonText = () => {
    switch (activeTab) {
      case 'Dedicated Deployments':
        return '+New Deployment';
      case 'Devices':
        return '+Add Device';
      default:
        return '+New Batch Job';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Deployments</h1>
            <button
              onClick={onCreateJob}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {getButtonText()}
            </button>
          </div>
          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default DeploymentsList;
