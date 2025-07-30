import React, { useState, useEffect } from "react";
import {
  Camera,
  Eye,
  Filter,
  Square,
  Crop,
  AlertTriangle,
  BarChart3,
  Download,
  Play,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const WorkflowNode = ({
  icon: Icon,
  label,
  subtitle,
  bgColor,
  textColor,
  isInput,
  isOutput,
  image,
  nodeId,
  registerNode,
}) => (
  <div
    ref={(ref) => registerNode(nodeId, ref)}
    className={`${bgColor} rounded-lg p-3 w-36 shadow-sm border hover:shadow-md transition-shadow`}
  >
    {isInput && (
      <div className="flex items-center gap-1 mb-2">
        <Download className="w-3 h-3 text-gray-600" />
        <span className="text-xs font-medium text-gray-700">Input</span>
      </div>
    )}

    {isOutput && (
      <div className="flex items-center gap-1 mb-2">
        <Download className="w-3 h-3 text-gray-600" />
        <span className="text-xs font-medium text-gray-700">Response</span>
      </div>
    )}

    {image ? (
      <div className="bg-gray-100 rounded-lg p-2 aspect-video flex items-center justify-center mb-2 relative overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded flex items-center justify-center">
          <div className="text-white text-center">
            <Camera className="w-4 h-4 mx-auto mb-1" />
            <div className="text-xs">Industrial Scene</div>
          </div>
        </div>
        <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white px-1 py-0.5 rounded text-xs">
          📹 Camera 1
        </div>
      </div>
    ) : image === false ? (
      <div className="bg-gray-100 rounded-lg p-2 aspect-video flex items-center justify-center mb-2 relative overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-500 rounded flex items-center justify-center">
          <div className="text-white text-center">
            <AlertTriangle className="w-4 h-4 mx-auto mb-1" />
            <div className="text-xs">Alert Generated</div>
          </div>
        </div>
        <div className="absolute bottom-1 left-1 bg-pink-500 text-white px-1 py-0.5 rounded text-xs font-medium flex items-center gap-1">
          <AlertTriangle className="w-2 h-2" />
          Backup Detected on Line 4
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-center mb-2">
        <Icon className={`w-5 h-5 ${textColor}`} />
      </div>
    )}

    {!isInput && !isOutput && (
      <div className="text-center">
        <div className={`font-medium text-xs ${textColor}`}>{label}</div>
        {subtitle && (
          <div className={`text-xs opacity-75 ${textColor} mt-1`}>
            {subtitle}
          </div>
        )}
      </div>
    )}
  </div>
);

const ConditionalNode = ({ label, condition, nodeId, registerNode }) => (
  <div
    ref={(ref) => registerNode(nodeId, ref)}
    className="bg-blue-50 border border-blue-200 rounded-lg p-3 w-36 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-center justify-center gap-1 mb-2">
      <AlertTriangle className="w-4 h-4 text-blue-600" />
      <div className="font-medium text-xs text-blue-700">{label}</div>
    </div>
    <div className="text-center">
      <div className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full inline-block">
        {condition}
      </div>
    </div>
  </div>
);

export default function VisionWorkflowBuilder() {
  const [isRunning, setIsRunning] = useState(false);
  const [connections, setConnections] = useState([]);
  const nodeRefs = {};

  const navigate = useNavigate();

  const RedirectToWorkflow=()=>{
    navigate("/CreateWorkflow");
  }

  // Register node ref
  const registerNode = (id, ref) => {
    if (ref) {
      nodeRefs[id] = ref;
    }
  };

  // Calculate connections after component mounts
  useEffect(() => {
    const calculateConnections = () => {
      const container = document.querySelector(".workflow-diagram");
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newConnections = [];

      const connectionPairs = [
        { from: "input", to: "detect-boxes" },
        { from: "detect-boxes", to: "filter-zone" },
        { from: "filter-zone", to: "add-boxes" },
        { from: "filter-zone", to: "count-boxes" },
        { from: "add-boxes", to: "crop-zone" },
        { from: "count-boxes", to: "detect-backup" },
        { from: "crop-zone", to: "response" },
        { from: "detect-backup", to: "response" },
      ];

      connectionPairs.forEach(({ from, to }) => {
        const fromRef = nodeRefs[from];
        const toRef = nodeRefs[to];

        if (fromRef && toRef) {
          const fromRect = fromRef.getBoundingClientRect();
          const toRect = toRef.getBoundingClientRect();

          const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
          const fromY = fromRect.bottom - containerRect.top;
          const toX = toRect.left + toRect.width / 2 - containerRect.left;
          const toY = toRect.top - containerRect.top;

          // Create a smooth curved path
          const controlPointOffset = Math.abs(toY - fromY) * 0.4;
          const path = `M ${fromX} ${fromY} Q ${fromX} ${
            fromY + controlPointOffset
          } ${toX} ${toY}`;

          newConnections.push({ path, from, to });
        }
      });

      setConnections(newConnections);
    };

    // Calculate connections after a short delay to ensure all nodes are rendered
    const timer = setTimeout(calculateConnections, 100);

    // Also recalculate on window resize
    const handleResize = () => {
      calculateConnections();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const runWorkflow = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 3000);
  };

  return (
    <div className="min-h-screen flex items-center bg-gray-50 px-8 py-6">
      {/* Header */}
      <div className=" flex flex-col w-2/4 items-start text-center mb-8">
        <div className="text-purple-600 text-sm font-medium mb-2">
          WorkFlows
        </div>
        <h1 className="text-6xl font-bold items-start text-gray-900 mb-4">
          Quickly Build Vision Applications
        </h1>
        <p className="text-gray-600 font-bold mb-8 text-lg">
          Connects blocks to build production-ready vision systems you can run
          on the edge.
        </p>

        <div className="flex text-left  w-full flex-col justify-center gap-4 mb-8">
          <div>
            <button onClick={RedirectToWorkflow} className="bg-purple-600 w-full justify-center hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
              <Plus className="w-4 text-left h-4" />
              Create a workflow
            </button>
          </div>
          <div className="flex w-full gap-0.5"><button className="text-gray-600 w-2/4 border-2 rounded-2xl border-gray-400 hover:text-gray-800 font-medium px-6 py-3">
            Learn more
          </button>
          <button className="text-gray-600 border-2 w-2/4 rounded-2xl border-gray-400 hover:text-gray-800 font-medium px-6 py-3">
            Browse Templates
          </button></div>
        </div>
      </div>

      {/* Workflow Container */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end gap-2 mb-4">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium">
            Detect Backup
          </button>
          <button
            onClick={runWorkflow}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1"
          >
            <Play className="w-3 h-3" />
            Try Workflow
          </button>
        </div>

        {/* Workflow visualization */}
        <div
          className="relative workflow-diagram bg-white rounded-lg p-6 shadow-sm border"
          style={{ height: "700px" }}
        >
          {/* Connection Lines SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#9CA3AF" />
              </marker>
            </defs>

            {/* Dynamic connection lines */}
            {connections.map(({ path, from, to }, index) => (
              <path
                key={`${from}-${to}-${index}`}
                d={path}
                stroke="#9CA3AF"
                strokeWidth="1.5"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
            ))}
          </svg>

          {/* Workflow Nodes */}
          <div className="relative space-y-8" style={{ zIndex: 2 }}>
            {/* Input node */}
            <div className="flex justify-center">
              <WorkflowNode
                nodeId="input"
                registerNode={registerNode}
                isInput={true}
                image={true}
                bgColor="bg-white border border-gray-200"
              />
            </div>

            {/* Detect Boxes */}
            <div className="flex justify-center">
              <WorkflowNode
                nodeId="detect-boxes"
                registerNode={registerNode}
                icon={Eye}
                label="Detect Boxes"
                bgColor="bg-purple-50 border border-purple-200"
                textColor="text-purple-700"
              />
            </div>

            {/* Filter to Zone */}
            <div className="flex justify-center">
              <WorkflowNode
                nodeId="filter-zone"
                registerNode={registerNode}
                icon={Filter}
                label="Filter to Zone"
                bgColor="bg-yellow-50 border border-yellow-200"
                textColor="text-yellow-700"
              />
            </div>

            {/* Parallel nodes */}
            <div className="flex justify-center gap-16">
              <WorkflowNode
                nodeId="add-boxes"
                registerNode={registerNode}
                icon={Square}
                label="Add Bounding Boxes"
                bgColor="bg-cyan-50 border border-cyan-200"
                textColor="text-cyan-700"
              />
              <WorkflowNode
                nodeId="count-boxes"
                registerNode={registerNode}
                icon={BarChart3}
                label="Count Boxes"
                bgColor="bg-orange-50 border border-orange-200"
                textColor="text-orange-700"
              />
            </div>

            {/* Next level nodes */}
            <div className="flex justify-center gap-16">
              <WorkflowNode
                nodeId="crop-zone"
                registerNode={registerNode}
                icon={Crop}
                label="Crop to Zone"
                bgColor="bg-green-50 border border-green-200"
                textColor="text-green-700"
              />
              <ConditionalNode
                nodeId="detect-backup"
                registerNode={registerNode}
                label="Detect Backup"
                condition="# Count > 4"
              />
            </div>

            {/* Output node */}
            <div className="flex justify-center">
              <WorkflowNode
                nodeId="response"
                registerNode={registerNode}
                isOutput={true}
                image={false}
                bgColor="bg-white border border-gray-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Running indicator */}
      {isRunning && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-200 rounded-lg p-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-700 text-sm font-medium">
            Workflow Running
          </span>
        </div>
      )}
    </div>
  );
}
