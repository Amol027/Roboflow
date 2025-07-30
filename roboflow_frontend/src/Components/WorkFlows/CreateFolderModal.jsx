import React from 'react';

const CreateFolderModal = ({ folderName, setFolderName, onCancel, onCreate }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-xl max-h-xl h-[40%] mx-auto pointer-events-auto border border-gray-200">
        <div className="px-8 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Folder</h2>
        </div>

        <div className="px-8 py-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Folder Name
          </label>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter folder name"
          />
        </div>

        <div className="px-8 py-5 flex justify-between items-center border-t border-gray-100">
          <button
            onClick={onCancel}
            className="px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            className="px-5 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
          >
            Create Folder
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;
