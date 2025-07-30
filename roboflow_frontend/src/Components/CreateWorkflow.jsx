import React, { useState } from 'react';
import { ChevronLeft, Code, X, Plus, ChevronDown, Search } from 'lucide-react';

// Add Model Modal Component
const AddModelModal = ({ isOpen, onClose, onAddModel }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState(null);

  const models = [
    { name: "Object Detection Model", description: "Identify and locate objects in the image", category: "Computer Vision" },
    { name: "Industrial Segmentation Model", description: "Segment industrial objects and components", category: "Computer Vision" },
    { name: "Shop-Label Classification Model", description: "Classify shop labels and signage", category: "Computer Vision" },
    { name: "Multi-Label Classification Model", description: "Multi-label text and image", category: "Computer Vision" },
    { name: "Keyword Detection Model", description: "Detect keywords in text and audio", category: "Natural Language" },
    { name: "Attributed Classifier", description: "Advanced classification with attributes", category: "Computer Vision" },
    { name: "Google Detect", description: "Google's object detection capabilities", category: "Computer Vision" },
    { name: "OpenAI", description: "OpenAI's language and vision capabilities", category: "Language Models" },
    { name: "Depth Estimation", description: "Estimate depth from single images", category: "Computer Vision" },
    { name: "Florence-2 Model", description: "Microsoft's vision-language model", category: "Vision-Language" },
    { name: "Qwen2.5-VL", description: "Multimodal AI for vision and language", category: "Vision-Language" },
    { name: "SteveLM", description: "Specialized language model", category: "Language Models" },
    { name: "MoonBeam-2", description: "Advanced multimodal processing", category: "Multimodal" },
    { name: "Google Vision OCR", description: "Optical character recognition", category: "Computer Vision" },
    { name: "YOLO-World Model", description: "Real-time object detection", category: "Computer Vision" },
    { name: "ColBERT", description: "Efficient text retrieval and ranking", category: "Natural Language" },
    { name: "Segment Anything 2 Model", description: "Advanced image segmentation", category: "Computer Vision" },
    { name: "CLIP Embedding Model", description: "Connect images and text with embeddings", category: "Vision-Language" },
    { name: "FastSpeech Encoder Embedding Model", description: "Speech and audio processing", category: "Audio" },
    { name: "Clip Comparison", description: "Compare and analyze video clips", category: "Video" },
    { name: "OCR Model", description: "Extract text from images and documents", category: "Computer Vision" },
    { name: "Harmonic Detection", description: "Detect harmonic patterns in data", category: "Audio" },
    { name: "VLM Code Detection", description: "Detect and analyze code in images", category: "Vision-Language" },
    { name: "Cake Detection", description: "Specialized cake and pastry detection", category: "Computer Vision" },
    { name: "Stability AI Inpainting", description: "AI-powered image inpainting and editing", category: "Generative AI" },
    { name: "Stability AI Outpainting", description: "Extend images beyond their borders", category: "Generative AI" },
    { name: "Stability AI Image Generation", description: "Generate high-quality images from text", category: "Generative AI" },
    { name: "Llama 3.2 Vision", description: "Meta's vision-language model", category: "Vision-Language" }
  ];

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddModel = () => {
    if (selectedModel) {
      onAddModel(selectedModel);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Add a Model</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Model List */}
          <div className="w-full md:w-1/2 border-r flex flex-col">
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search model blocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Model List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {filteredModels.map((model, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedModel(model)}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      selectedModel?.name === model.name
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{model.name}</div>
                        <div className="text-xs text-gray-500">{model.description}</div>
                        <div className="text-xs text-purple-600 mt-1">{model.category}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Model Details */}
          <div className="hidden md:flex md:w-1/2 flex-col">
            {selectedModel ? (
              <div className="p-6 flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-purple-500 rounded"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedModel.name}</h3>
                    <p className="text-sm text-purple-600">{selectedModel.category}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{selectedModel.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Capabilities</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">
                        This model provides advanced {selectedModel.category.toLowerCase()} capabilities 
                        for processing and analyzing your data with high accuracy and performance.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Usage</h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        Connect this model to your workflow to enable {selectedModel.name.toLowerCase()} 
                        functionality. Configure input parameters and process your data seamlessly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 flex-1 flex items-center justify-center">
                <div className="text-center border-2 border-gray-200 rounded-lg p-6 h-4/5 w-11/12">
                  
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-4 border-t space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleAddModel}
            disabled={!selectedModel}
            className={`px-6 py-2 rounded-md text-sm font-medium ${
              selectedModel
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add Model
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateWorkflow = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddBlockPanel, setShowAddBlockPanel] = useState(false);
  const [showInputPanel, setShowInputPanel] = useState(false);
  const [showOutputPanel, setShowOutputPanel] = useState(false);
  const [showAddModelModal, setShowAddModelModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [inputParams, setInputParams] = useState([]);
  const [outputParams, setOutputParams] = useState([]);
  const [addedModels, setAddedModels] = useState([]);

  const backToWorkflow = () => console.log('Navigate back');

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => setIsDeploying(false), 2000);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard
      .writeText('https://example.com/workflow/share/abc123')
      .then(() => alert('Link copied!'))
      .catch(() => alert('Failed to copy link.'));
  };

  const addInputParameter = () => {
    setInputParams([...inputParams, { id: Date.now(), name: '', type: 'text' }]);
  };

  const addOutputParameter = () => {
    setOutputParams([...outputParams, { id: Date.now(), name: '', value: '' }]);
  };

  const removeInputParameter = (id) => {
    setInputParams(inputParams.filter(param => param.id !== id));
  };

  const removeOutputParameter = (id) => {
    setOutputParams(outputParams.filter(param => param.id !== id));
  };

  const updateInputParameter = (id, field, value) => {
    setInputParams(inputParams.map(param => 
      param.id === id ? { ...param, [field]: value } : param
    ));
  };

  const updateOutputParameter = (id, field, value) => {
    setOutputParams(outputParams.map(param => 
      param.id === id ? { ...param, [field]: value } : param
    ));
  };

  const handleAddModel = (model) => {
    setAddedModels([...addedModels, { ...model, id: Date.now() }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Header */}
      <div className="bg-white border-b px-4 py-3 sm:px-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="flex items-center text-gray-800 font-medium">
              <button onClick={backToWorkflow} className="mr-2 p-1">
                <ChevronLeft className="w-5 h-5" />
              </button>
              Custom Workflow
            </div>
            <div className="text-sm text-gray-500 ml-6">
              Running on: <span className="text-purple-600 font-medium">Serverless Hosted API V2</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDeploy}
              disabled={isDeploying}
              className="px-3 py-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-md border border-purple-200 text-sm"
            >
              {isDeploying ? 'Deploying...' : 'Deploy'}
            </button>
            <button className="px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
              Test Workflow
            </button>
            <button className="px-3 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-md text-sm">
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar */}
        <div className="bg-white w-16 border-r flex flex-col items-center py-4">
          <button className="text-gray-600 hover:text-gray-800 p-2">
            <Code className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 relative overflow-y-auto">
          <div className="flex justify-end px-4 sm:px-6 py-3">
            <div className="flex gap-2">
              <button
                onClick={() => setShowShareModal(true)}
                className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 text-sm"
              >
                Share Workflow
              </button>
              <button
                onClick={() => setShowAddBlockPanel(true)}
                className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 text-sm"
              >
                Add Block
              </button>
            </div>
          </div>

          {/* Blocks & UI */}
          <div className="p-4 sm:p-8 max-w-4xl mx-auto">
            {/* Inputs Block */}
            <div 
              className="bg-white rounded-lg p-6 mb-6 shadow border cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setShowInputPanel(true)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex justify-center items-center">
                    <div className="w-4 h-4 bg-gray-400 rounded" />
                  </div>
                  <span className="font-medium text-lg">Inputs</span>
                </div>
                <ChevronLeft className="w-5 h-5 rotate-180 text-gray-400" />
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <div className="w-0.5 h-8 bg-gray-300" />
            </div>

            <div className="bg-white rounded-lg p-6 mb-6 text-center shadow border">
              <h3 className="text-lg font-medium mb-3">To Get Started</h3>
              <button 
                onClick={() => setShowAddModelModal(true)}
                className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 mb-2"
              >
                Add a Model
              </button>
              <div className="text-sm text-gray-500">
                or <span className="text-purple-600 underline hover:text-purple-700 cursor-pointer">Start From a Template</span>
              </div>
            </div>

            {/* Added Models */}
            {addedModels.map((model, index) => (
              <div key={model.id}>
                <div className="flex justify-center mb-4">
                  <div className="w-0.5 h-8 bg-gray-300" />
                </div>
                <div className="bg-white rounded-lg p-6 mb-6 shadow border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex justify-center items-center">
                        <div className="w-4 h-4 bg-purple-500 rounded" />
                      </div>
                      <div>
                        <span className="font-medium text-lg">{model.name}</span>
                        <div className="text-sm text-gray-500">{model.description}</div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center mb-4">
              <div className="w-0.5 h-8 bg-gray-300" />
            </div>

            {/* Outputs Block */}
            <div 
              className="bg-white rounded-lg p-6 shadow border cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setShowOutputPanel(true)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex justify-center items-center">
                    <div className="w-4 h-4 bg-gray-400 rounded" />
                  </div>
                  <span className="font-medium text-lg">Outputs</span>
                </div>
                <ChevronLeft className="w-5 h-5 rotate-180 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Add Block */}
        {showAddBlockPanel && (
          <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white border-l z-30 shadow-lg flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold text-gray-900 text-base">Add Block</h2>
              <button onClick={() => setShowAddBlockPanel(false)} className="text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Search workflow block"
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex px-4 py-2 gap-4 border-b text-sm">
              <button
                onClick={() => setActiveTab('all')}
                className={`pb-1 ${activeTab === 'all' ? 'border-b-2 border-purple-600 text-purple-600 font-medium' : 'text-gray-600'}`}
              >
                All Blocks
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`pb-1 ${activeTab === 'custom' ? 'border-b-2 border-purple-600 text-purple-600 font-medium' : 'text-gray-600'}`}
              >
                Custom
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
              {activeTab === 'all' ? (
                <>
                  {["Model", "Visualization", "Logic and Branching", "Data Storage", "Notification", "Video", "Transformation", "Classical Computer Vision", "Advanced", "Custom"].map((block) => (
                    <div
                      key={block}
                      className="p-3 rounded-md border hover:bg-gray-50 flex justify-between items-center cursor-pointer"
                    >
                      <div>
                        <div className="font-medium">{block}</div>
                        <div className="text-xs text-gray-500">Description of {block}</div>
                      </div>
                      <ChevronLeft className="w-4 h-4 rotate-180 text-gray-400" />
                    </div>
                  ))}
                </>
              ) : (
                <div className="p-3 border rounded hover:bg-gray-50 flex justify-between items-center">
                  <div>
                    <div className="font-medium">Custom Python Block</div>
                    <div className="text-xs text-gray-500">Create block to execute custom Python code</div>
                  </div>
                  <Code className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-4 border-t text-center text-sm text-purple-600 cursor-pointer hover:underline">
              View All Blocks
            </div>
          </div>
        )}

        {/* Right Sidebar: Input Panel */}
        {showInputPanel && (
          <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white border-l z-30 shadow-lg flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold text-gray-900 text-base">Input</h2>
              <button onClick={() => setShowInputPanel(false)} className="text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b">
              <p className="text-sm text-gray-600 mb-4">Specify the required inputs for calling this workflow.</p>
              <div className="flex gap-2">
                <button
                  onClick={addInputParameter}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Parameter
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 text-sm">
                  <Plus className="w-4 h-4" />
                  Add Image
                </button>
                <button className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 text-sm">
                  +
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {inputParams.length === 0 ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-gray-500 mb-2">Image</p>
                    <div className="flex gap-2 mb-4">
                      <button className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded text-sm">Image</button>
                      <button className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded text-sm">Video</button>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                      <p className="text-gray-500 text-sm mb-2">Drop files here or</p>
                      <button className="px-4 py-2 bg-gray-100 border border-gray-200 rounded text-sm">Select File</button>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter Image URL"
                      className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                    />
                  </div>
                  <button className="w-full py-3 bg-black text-white rounded text-sm">
                    Test Workflow
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {inputParams.map((param) => (
                    <div key={param.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Parameter</h3>
                        <button 
                          onClick={() => removeInputParameter(param.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={param.name}
                            onChange={(e) => updateInputParameter(param.id, 'name', e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Parameter name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                          <select
                            value={param.type}
                            onChange={(e) => updateInputParameter(param.id, 'type', e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="image">Image</option>
                            <option value="file">File</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Sidebar: Output Panel */}
        {showOutputPanel && (
          <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white border-l z-30 shadow-lg flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold text-gray-900 text-base">Response</h2>
              <button onClick={() => setShowOutputPanel(false)} className="text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b">
              <p className="text-sm text-gray-600 mb-4">Each workflow ends with a response object, which can include one or more outputs from any step in the workflow.</p>
              <button
                onClick={addOutputParameter}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Output
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {outputParams.length === 0 ? (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Output</h3>
                      <div className="flex gap-1">
                        <button className="text-gray-400 hover:text-gray-600">↑</button>
                        <button className="text-gray-400 hover:text-gray-600">↓</button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter Image URL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                        <div className="relative">
                          <select className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none">
                            <option>Select an output</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="bg-cyan-50 border border-cyan-200 rounded px-3 py-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span className="text-sm text-cyan-700">Input</span>
                        <span className="text-sm text-gray-600">Image</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {outputParams.map((param) => (
                    <div key={param.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Output</h3>
                        <div className="flex gap-1">
                          <button className="text-gray-400 hover:text-gray-600">↑</button>
                          <button className="text-gray-400 hover:text-gray-600">↓</button>
                          <button 
                            onClick={() => removeOutputParameter(param.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={param.name}
                            onChange={(e) => updateOutputParameter(param.id, 'name', e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Output name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                          <select
                            value={param.value}
                            onChange={(e) => updateOutputParameter(param.id, 'value', e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select an output</option>
                            <option value="input_image">Input Image</option>
                            <option value="processed_result">Processed Result</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Share Workflow</h2>
                <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:text-gray-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
                  <div className="flex">
                    <input
                      type="text"
                      value="https://example.com/workflow/share/abc123"
                      readOnly
                      className="flex-1 border border-gray-300 px-3 py-2 rounded-l text-sm bg-gray-50"
                    />
                    <button
                      onClick={handleCopyShareLink}
                      className="px-4 py-2 bg-purple-600 text-white rounded-r hover:bg-purple-700 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Model Modal */}
        <AddModelModal
          isOpen={showAddModelModal}
          onClose={() => setShowAddModelModal(false)}
          onAddModel={handleAddModel}
        />
      </div>
    </div>
  );
};

export default CreateWorkflow;