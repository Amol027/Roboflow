import React, { useState } from 'react';
import DeploymentsList from '../Components/DeploymentList';
import CreateBatchJob from '../Components/CreateBatchJob';
import DashboardLayout from '../Components/DashboardLayout';

const DeploymentsPage = () => {
  const [showCreateJob, setShowCreateJob] = useState(false);

  return (
    <DashboardLayout>
      {!showCreateJob ? (
        <DeploymentsList onCreateJob={() => setShowCreateJob(true)} />
      ) : (
        <CreateBatchJob onBack={() => setShowCreateJob(false)} />
      )}
    </DashboardLayout>
  );
};

export default DeploymentsPage;