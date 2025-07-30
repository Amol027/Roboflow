import React from "react";
import { useUser } from "../../Contexts/userContext";

const PlanBilling = () => {
  const { user } = useUser();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Plan & Billing</h2>
        <p className="text-sm text-gray-600">Change your plan or manage your billings settings</p>
      </div>

      {/* Your Plan */}
      <div className="border rounded-lg p-6 shadow-sm bg-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-md font-semibold text-gray-900">Public plan</h3>
            <p className="text-sm text-gray-600">
              Best for personal, open source, and research projects, with public datasets and models for the community to use.
            </p>
          </div>
          <button className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700">Change Plan</button>
        </div>
        <div className="flex justify-between text-sm text-gray-700 mt-2">
          <div>
            <p>What’s included:</p>
            <ul className="list-disc ml-5">
              <li>30 Credits / month</li>
              <li>$3 per additional credit</li>
            </ul>
          </div>
          <div className="text-right">
            <p>Public Data</p>
            <p>Community Support</p>
          </div>
        </div>
      </div>

      {/* Add Weights Download */}
      <div className="border rounded-lg p-6 shadow-sm bg-white flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-gray-800">Add Weights Download</h4>
          <p className="text-sm text-gray-600">
            Your current plan does not include the ability to download model weights. You will need to upgrade to a paid usage based pricing plan to use this feature.
          </p>
        </div>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Upgrade Plan</button>
      </div>

      {/* Purchase Additional Credits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 shadow-sm bg-white space-y-3">
          <h4 className="font-semibold text-gray-800">Prepaid Credits: 0</h4>
          <p className="text-sm text-gray-600">
            Purchase prepaid credits for model training, AI labeling, and deployment. Prepaid credits do not expire and are consumed after the monthly included credits on your plan.
          </p>
          <div className="flex justify-between items-center">
            <span>Credits $3 / Credit</span>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Purchase</button>
          </div>
        </div>
        <div className="border rounded-lg p-6 shadow-sm bg-white space-y-3">
          <h4 className="font-semibold text-gray-800">Interested in bulk discounts?</h4>
          <p className="text-sm text-gray-600">
            Get in touch with a team member to discuss.
          </p>
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200">Talk to Sales</button>
        </div>
      </div>

      {/* Billing */}
      <div className="border rounded-lg p-6 shadow-sm bg-white space-y-3">
        <h4 className="font-semibold text-gray-800">Billing Portal</h4>
        <p className="text-sm text-gray-600">Manage payment methods & view previous invoices.</p>
        <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200">Go to portal</button>
      </div>

      {/* Additional Settings */}
      <div className="border rounded-lg p-6 shadow-sm bg-white space-y-3">
        <h4 className="font-semibold text-gray-800">Using Roboflow for research or education?</h4>
        <p className="text-sm text-gray-600">Accounts with academic emails can request access to increased automated limits.</p>
        <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200">Request Access</button>
      </div>
    </div>
  );
};

export default PlanBilling;
