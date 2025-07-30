import { useNavigate } from "react-router-dom";
import BASE_URL from "../utils/Config";

const ProjectsContent = () => {
  const navigate = useNavigate();

  const DirectToForm = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("Please log in first.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/projects/` , {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ FIXED
        },
        body: JSON.stringify({
          name: "Untitled Project",
          description: "Created via + New Project button",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create project.");
      }
      console.log("New Project ID:", data.id);
        navigate("/projects/new", { state: { projectId: data.id } });

    } catch (error) {
      console.error(error);
      alert("Error creating project: " + error.message);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <svg width="200" height="150" viewBox="0 0 200 150" className="mx-auto">
            <g transform="translate(50, 30)">
              <path d="M0 20 L80 0 L180 20 L180 100 L80 120 L0 100 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="2" />
              <path d="M0 20 L80 0 L180 20 L180 30 L80 50 L0 30 Z" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
              <circle cx="15" cy="15" r="3" fill="#ef4444" />
              <circle cx="25" cy="15" r="3" fill="#f59e0b" />
              <circle cx="35" cy="15" r="3" fill="#10b981" />
              <rect x="10" y="40" width="60" height="50" fill="white" stroke="#d1d5db" />
              <path d="M20 75 L30 65 L40 70 L50 55 L60 60" stroke="#8b5cf6" strokeWidth="2" fill="none" />
              <path d="M20 80 L30 70 L40 75 L50 60 L60 65" stroke="#06b6d4" strokeWidth="2" fill="none" />
            </g>
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          There are no projects in this workspace.
        </h2>

        <p className="text-gray-600 mb-8">
          Create a project and upload images to start labeling, training, and deploying 
          your computer vision model.
        </p>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={DirectToForm}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-medium"
          >
            + New Project
          </button>

          <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-md font-medium flex items-center space-x-2">
            <span>📖</span>
            <span>View a Tutorial</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsContent;