import React from "react";

// Simple utility function to replace classNames
const cn = (...classes) => classes.filter(Boolean).join(' ');

const usageData = {
  included: 30,
  prepaid: 0,
  flex: 0,
  categories: {
    Dataset: [
      { label: "Storage", quota: "5000 images", credit: "1 credit", used: 0 },
      { label: "Labeling", quota: "1000 images", credit: "1 credit", used: 0 },
      { label: "Augmentation", quota: "20,000 images", credit: "1 credit", used: 0 },
      { label: "AI Labeling", quota: "100 images", credit: "1 credit", used: 0 },
    ],
    Training: [
      { label: "Model Training", quota: "30 minutes", credit: "1 credit", used: 0 },
    ],
    Deploy: [
      { label: "Self Hosted (Image)", quota: "1000 inferences", credit: "1 credit", used: 0 },
      { label: "Self Hosted (Video Stream)", quota: "600 minutes", credit: "2 credits", used: 0 },
      { label: "Hosted Inference V2", quota: "500 seconds", credit: "1 credit", used: 0 },
      { label: "Hosted Inference (Image)", quota: "1000 inferences", credit: "1 credit", used: 0 },
      { label: "Hosted Inference (Stored Video)", quota: "200 minutes", credit: "2 credits", used: 0 },
      { label: "Dedicated Deployment (CPU)", quota: "4 hrs", credit: "4 credits", used: 0 },
      { label: "Dedicated Deployment (GPU)", quota: "1 hour", credit: "4 credits", used: 0 },
      { label: "Batch Processing (CPU)", quota: "1 hour", credit: "2 credits", used: 0 },
      { label: "Batch Processing (GPU)", quota: "0.25 hours", credit: "2 credits", used: 0 },
    ],
  },
  workspace: {
    members: { used: 1, max: 5 },
    projects: { used: 0, max: 10 },
  }
};

const getProgressBarColor = (category) => {
  switch (category) {
    case "Dataset":
      return "bg-yellow-400";
    case "Training":
      return "bg-green-500";
    case "Deploy":
      return "bg-blue-500";
    default:
      return "bg-gray-400";
  }
};

 const Usage = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Usage</h2>
        <p className="text-sm text-gray-600">Usage resets in 11 days, on June 30. Usage within the hour may not be shown.</p>
      </div>

      {/* Filters and Credits */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="space-x-2">
          <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded">Dataset</button>
          <button className="bg-green-200 text-green-800 px-3 py-1 rounded">Training</button>
          <button className="bg-blue-200 text-blue-800 px-3 py-1 rounded">Deploy</button>
        </div>
        <div className="space-x-2">
          <button className="bg-white border px-3 py-1 rounded">Audit Log</button>
          <button className="bg-yellow-400 text-white px-3 py-1 rounded">Upgrade</button>
        </div>
      </div>

      {/* Credit Summary */}
      <div className="text-sm">
        <h3 className="font-semibold text-gray-800">Credits Used</h3>
        <p>Total Usage: {usageData.included + usageData.prepaid + usageData.flex}</p>
        <p>Included: {usageData.included}</p>
        <p>Prepaid Credits: {usageData.prepaid} <button className="text-yellow-500 underline ml-2">Purchase</button></p>
        <p>Flex Usage: {usageData.flex}</p>
      </div>

      {/* Usage Sections */}
      {Object.entries(usageData.categories).map(([category, items]) => (
        <div key={category}>
          <h4 className="font-semibold text-md text-gray-800 mb-2">{category}</h4>
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>{item.label} ({item.quota} / {item.credit})</span>
                  <span>{item.used}</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className={cn("h-2 rounded-full", getProgressBarColor(category))}
                    style={{ width: `${item.used}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Workspace Limits */}
      <div>
        <h4 className="font-semibold text-md text-gray-800 mb-2">Workspace Limits</h4>
        <div className="space-y-4">
          {Object.entries(usageData.workspace).map(([label, data], idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm text-gray-700 mb-1 capitalize">
                <span>{label}</span>
                <span>{data.used} / {data.max}</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(data.used / data.max) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Usage