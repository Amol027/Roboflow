import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function MonitoringComponent() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeTimeframe, setActiveTimeframe] = useState('Past Week');

  const timeframes = ['Past 24 hours', 'Past Week', 'Past 2 Week', 'Past Month'];

  const overviewData = [
    { class: 'WBC', detections: '20,836', confidence: '87%', deploymentType: 'Hosted' },
    { class: 'Platelets', detections: '62,508', confidence: '79%', deploymentType: 'Hosted' },
    { class: 'RBC', detections: '395,884', confidence: '81%', deploymentType: 'Hosted' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <ChevronLeft className="w-5 h-5 text-gray-400" />
        <div>
          <div className="text-sm text-gray-500">Model Monitoring</div>
          <h1 className="text-2xl font-semibold text-gray-900">Cell-Composition v49</h1>
        </div>
      </div>

      {/* Time Filter Buttons */}
      <div className="flex gap-2 mb-8">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => setActiveTimeframe(timeframe)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTimeframe === timeframe
                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {timeframe}
          </button>
        ))}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900">20,829</span>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
              +14%
            </span>
          </div>
          <div className="text-sm text-gray-600">Total Inferences</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900">87%</span>
            <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">
              0.0%
            </span>
          </div>
          <div className="text-sm text-gray-600">Avg. Confidence</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900">50ms</span>
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
              +1.4%
            </span>
          </div>
          <div className="text-sm text-gray-600">Avg. Inference Time</div>
        </div>
      </div>

      {/* Class Detections Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Class Detections</h2>
        <div className="bg-gray-50 rounded-lg h-64 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Chart visualization would go here</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        {['Overview', 'Recent Inferences'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      {activeTab === 'Overview' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detections
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deployment Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {overviewData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.detections}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.confidence}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.deploymentType}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'Recent Inferences' && (
        <div className="bg-gray-50 rounded-lg h-64 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Recent inferences data would be displayed here</div>
        </div>
      )}
    </div>
  );
}