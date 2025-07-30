import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Grid, List, Plus, MoreHorizontal } from "lucide-react";

const WorkflowControls = ({
  viewType,
  setViewType,
  setShowModal,
  searchTerm,
  setSearchTerm,
}) => {
  const navigate = useNavigate();

  // 🔁 Function to handle Explore Templates navigation
  const handleExploreTemplates = () => {
    navigate("/exploreTemplates");
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      {/* Left Section: Search, Buttons */}
      <div className="flex flex-wrap items-center gap-3 w-full">
        {/* Search bar */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search workflows"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* Plus Button: Modal Trigger */}
        <button
          onClick={() => setShowModal(true)}
          className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
          title="Create Workflow"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>

        {/* Explore Templates */}
        <button
          onClick={handleExploreTemplates}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
        >
          Explore Templates
        </button>

        {/* Create Workflow (non-modal) */}
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700">
          +Create Workflow
        </button>
      </div>

      {/* Right Section: View Switcher */}
      <div className="flex items-center gap-2">
        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <button
            onClick={() => setViewType("card")}
            className={`p-2 ${
              viewType === "card"
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewType("list")}
            className={`p-2 ${
              viewType === "list"
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
        <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
          <MoreHorizontal className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default WorkflowControls;
