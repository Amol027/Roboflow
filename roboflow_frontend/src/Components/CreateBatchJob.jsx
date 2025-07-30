import React, { useState, useRef } from 'react';
import { ChevronDown, Upload, X, Image, Video } from 'lucide-react';

const CreateBatchJob = ({ onBack }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [uploadType, setUploadType] = useState('images');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    jobName: 'Batch Job - 6/18/2025 04:33 PM',
    workflow: '',
    machineType: 'CPU',
    processingTimeout: '2',
    saveVisualizations: false,
    workerPerMachine: '',
    workflowInputImageName: 'image',
    workflowParameters: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      if (uploadType === 'images') {
        return file.type.startsWith('image/');
      } else {
        return file.type.startsWith('video/');
      }
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
    // Reset the input to allow selecting the same file again if needed
    event.target.value = '';
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const validFiles = files.filter(file => {
      if (uploadType === 'images') {
        return file.type.startsWith('image/');
      } else {
        return file.type.startsWith('video/');
      }
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      uploadedFiles: uploadedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      })),
      uploadType
    };
    console.log('Creating batch job:', submitData);
  };

  const getAcceptedFileTypes = () => {
    return uploadType === 'images' ? 'image/*' : 'video/*';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Create New Batch Job</h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
              Use Credits
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Job Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Name
            </label>
            <input
              type="text"
              value={formData.jobName}
              onChange={(e) => handleInputChange('jobName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Work Flow */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Flow
            </label>
            <select
              value={formData.workflow}
              onChange={(e) => handleInputChange('workflow', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select a Workflow</option>
              <option value="workflow1">Workflow 1</option>
              <option value="workflow2">Workflow 2</option>
            </select>
          </div>

          {/* Input Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input Data
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="flex justify-center space-x-8 mb-4">
                <button
                  onClick={() => setUploadType('images')}
                  className={`pb-1 ${uploadType === 'images' 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Upload Images
                </button>
                <button
                  onClick={() => setUploadType('videos')}
                  className={`pb-1 ${uploadType === 'videos' 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Upload Videos
                </button>
              </div>
              
              <div 
                className="text-center py-4"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500 mb-2">
                  Drop {uploadType} here or
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Select Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={getAcceptedFileTypes()}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* File List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Uploaded Files ({uploadedFiles.length})
                  </h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          {file.type.startsWith('image/') ? (
                            <Image className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          ) : (
                            <Video className="h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                          <span className="text-sm text-gray-700 truncate" title={file.name}>
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="ml-2 text-gray-400 hover:text-red-500 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Job Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Job Options</h3>

            {/* Machine Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Machine Type
              </label>
              <div className="flex space-x-4">
                {['CPU', 'GPU'].map(type => (
                  <button
                    key={type}
                    onClick={() => handleInputChange('machineType', type)}
                    className={`flex-1 px-4 py-2 rounded-md border ${
                      formData.machineType === type
                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Processing Timeout */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Processing Timeout Hours
              </label>
              <input
                type="number"
                value={formData.processingTimeout}
                onChange={(e) => handleInputChange('processingTimeout', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Save Visualizations */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="saveVisualizations"
                checked={formData.saveVisualizations}
                onChange={(e) => handleInputChange('saveVisualizations', e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="saveVisualizations" className="ml-2 text-sm text-gray-700">
                Save Workflow Output Visualizations
              </label>
            </div>
          </div>

          {/* Advanced Options */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              <ChevronDown className={`h-4 w-4 mr-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              Advanced Options
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
                <InputField label="Worker Per Machine" type="number" value={formData.workerPerMachine} onChange={(val) => handleInputChange('workerPerMachine', val)} />
                <InputField label="Workflow Input Image Name" value={formData.workflowInputImageName} onChange={(val) => handleInputChange('workflowInputImageName', val)} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workflow Parameters
                  </label>
                  <textarea
                    value={formData.workflowParameters}
                    onChange={(e) => handleInputChange('workflowParameters', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter parameters as JSON..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Create Batch Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, type = 'text', value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    />
  </div>
);

export default CreateBatchJob;