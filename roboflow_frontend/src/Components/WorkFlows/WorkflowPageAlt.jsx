import React, { useState } from "react";
import DashboardLayout from "../DashboardLayout"; // Adjust the path if needed
import WorkflowCard from "./WorkflowCard";
import WorkflowListItem from "./WorkflowListItem";
import WorkflowHeader from "./WorkflowHeader";
import WorkflowControls from "./WorkflowControls";
import CreateFolderModal from "./CreateFolderModal";

const WorkflowPageAlt = () => {
  const [viewType, setViewType] = useState("card");
  const [showModal, setShowModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const workflows = [
    {
      id: 1,
      name: "Custom Workflow",
      items: ["Inputs", "to get started", "Outputs"],
    },
    {
      id: 2,
      name: "Data Processing",
      items: ["Import", "Transform", "Export"],
    },
    {
      id: 3,
      name: "Email Automation",
      items: ["Trigger", "Filter", "Send Email"],
    },
  ];

  const filteredWorkflows = workflows.filter((w) =>
    w.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateFolder = () => {
    if (folderName.trim()) {
      console.log("Creating folder:", folderName);
      setShowModal(false);
      setFolderName("");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <WorkflowHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <WorkflowControls
            viewType={viewType}
            setViewType={setViewType}
            setShowModal={setShowModal}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          {viewType === "card" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredWorkflows.map((workflow) => (
                <WorkflowCard key={workflow.id} workflow={workflow} />
              ))}
            </div>
          ) : (
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="grid grid-cols-2 bg-gray-200 text-sm font-medium text-gray-700 px-4 py-2">
                <div>Workflow Name</div>
                <div>Last Updated</div>
              </div>
              {workflows.map((workflow) => (
                <WorkflowListItem
                  key={workflow.id}
                  name={workflow.name}
                  lastUpdated={workflow.lastUpdated}
                />
              ))}
            </div>
          )}
        </div>

        {showModal && (
          <CreateFolderModal
            folderName={folderName}
            setFolderName={setFolderName}
            onCancel={() => {
              setShowModal(false);
              setFolderName("");
            }}
            onCreate={handleCreateFolder}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default WorkflowPageAlt;
