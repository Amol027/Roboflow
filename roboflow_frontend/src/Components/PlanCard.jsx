import React from 'react';
import { Globe } from 'lucide-react';

const PlanCard = ({ user, onUpgrade }) => (
  <div className="border rounded-lg p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Globe className="w-8 h-8 text-purple-600" />
        <div>
          <h3 className="font-semibold text-gray-900">{user?.plan || 'Public plan'}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Best for personal, open source, and research projects.
          </p>
          <div className="mt-3">
            <div className="font-medium text-gray-700">What's Included:</div>
            <div className="flex gap-8 mt-2">
              <div>
                <div className="font-semibold text-gray-900">{user?.credits || 20} Credits</div>
                <div className="text-xs text-gray-600">Per Month</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Public Data</div>
                <div className="text-xs text-gray-600">Community Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={onUpgrade}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
      >
        Change Plan
      </button>
    </div>
  </div>
);

export default PlanCard;
