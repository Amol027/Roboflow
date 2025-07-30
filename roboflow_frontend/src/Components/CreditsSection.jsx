import React, { useState } from 'react';

const CreditsSection = () => {
  const [credits] = useState(0);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Purchase Additional Credits</h2>
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">Prepaid Credits: {credits}</div>
            <p className="text-sm text-gray-600 mt-1">Prepaid credits do not expire.</p>
            <div className="mt-2">
              <span className="text-sm text-gray-700">Credits: $1 / Credit</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-2">What are credits?</div>
            <div className="text-sm text-gray-600 mb-4">Contact us for bulk discounts.</div>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm">Talk to Sales</button>
          </div>
        </div>
        <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-600 mt-4">
          Purchase
        </button>
      </div>
    </div>
  );
};

export default CreditsSection;
