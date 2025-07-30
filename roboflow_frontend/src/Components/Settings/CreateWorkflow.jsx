import React, { useState } from 'react';
import { ChevronLeft, Share, Plus, Code } from 'lucide-react';

export default function WorkflowBuilder() {
  const [isDeploying, setIsDeploying] = useState(false);

  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-600 hover:text-gray-800">
              <ChevronLeft className="w-5 h-5 mr-1" />
              Custom Workflow
            </button>
            <div className="text-sm text-gray-500">
              Running on: Serverless Hosted API v2
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleDeploy}
              disabled={isDeploying}
              className="px-4 py-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 disabled:opacity-50"
            >
              {isDeploying ? 'Deploying...' : 'Deploy'}
            </button>
            <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
              Test Workflow
            </button>
            <button className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg">
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <button className="flex items-center text-gray-600 hover:text-gray-800">
            <Code className="w-4 h-4 mr-2" />
          </button>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
              <Share className="w-4 h-4 mr-2" />
              Share Workflow
            </button>
            <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Block
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Workflow Canvas */}
          <div className="relative">
            {/* Inputs Block */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  </div>
                  <span className="text-lg font-medium text-gray-900">Inputs</span>
                </div>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Connector Line */}
            <div className="flex justify-center mb-4">
              <div className="w-0.5 h-8 bg-gray-300"></div>
            </div>

            {/* Center Action Block */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">To Get Started</h3>
                <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium mb-3">
                  Add a Model
                </button>
                <div className="text-sm text-gray-500">
                  or <button className="text-purple-600 hover:text-purple-700 underline">Start From a Template</button>
                </div>
              </div>
            </div>

            {/* Connector Line */}
            <div className="flex justify-center mb-4">
              <div className="w-0.5 h-8 bg-gray-300"></div>
            </div>

            {/* Outputs Block */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  </div>
                  <span className="text-lg font-medium text-gray-900">Outputs</span>
                </div>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}