import React, { useState } from 'react';
import { CreditCard, Shield } from 'lucide-react';
import { useUser } from '../../Contexts/userContext';
import SettingsHeader from './SettingsHeader';
import SettingSideBar from './SettingsSideBar';
import PlanCard from '../PlanCard';
import FeatureCard from '../FeatureCard';
import CreditsSection from '../CreditsSection';
import SideBar from '../SideBar';

const Settings = () => {
  const { user, loading } = useUser();
  const [activeSection, setActiveSection] = useState('plan-billing');

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-600">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-white">
        <SideBar />
      <SettingSideBar activeSection={activeSection} onSectionChange={setActiveSection} user={user} />
      <div className="flex-1 p-6">
        <SettingsHeader title={`${user.name} Settings`} onBack={() => {}} user={user} />

        <div className="max-w-4xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Plan Billing</h2>
          <p className="text-gray-600 mb-6">Change your plan or manage your billing settings</p>

          <PlanCard user={user} onUpgrade={() => {}} />

          <FeatureCard
            icon={CreditCard}
            title="Add Weights Download"
            description="Upgrade to download model weights."
            buttonText="Upgrade Plan"
            onAction={() => {}}
          />

          <CreditsSection />

          <FeatureCard
            icon={CreditCard}
            title="Billing Portal"
            description="Manage payment methods & view invoices."
            buttonText="Go to portal"
            onAction={() => {}}
          />

          <FeatureCard
            icon={Shield}
            title="Academic Access"
            description="Request increased limits with academic email."
            buttonText="Request Access"
            onAction={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
