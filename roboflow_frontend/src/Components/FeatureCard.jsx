import React from 'react';

const FeatureCard = ({ icon: Icon, title, description, buttonText, onAction, disabled = false }) => (
  <div className={`border rounded-lg p-4 ${disabled ? 'bg-gray-50' : 'bg-white'}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded ${disabled ? 'bg-gray-200' : 'bg-blue-50'}`}>
          <Icon className={`w-5 h-5 ${disabled ? 'text-gray-400' : 'text-blue-600'}`} />
        </div>
        <div>
          <h3 className={`font-medium ${disabled ? 'text-gray-500' : 'text-gray-900'}`}>{title}</h3>
          <p className={`text-sm mt-1 ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
        </div>
      </div>
      {buttonText && (
        <button
          onClick={onAction}
          disabled={disabled}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            disabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-yellow-500 text-white hover:bg-yellow-600'
          }`}
        >
          {buttonText}
        </button>
      )}
    </div>
  </div>
);

export default FeatureCard;
