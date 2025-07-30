import React, { useState } from "react";

const sidebarOptions = [
  {
    title: "Object Detection",
    description: "Identify objects and their positions with bounding boxes.",
  },
  {
    title: "Instance Segmentation",
    description: "Detect multiple objects and their shapes.",
  },
  {
    title: "Classification",
    description: "Assign a label to the entire image.",
  },
  {
    title: "Multi-Label Classification",
    description: "Assign multiple labels to the entire image.",
  },
  {
    title: "Keypoint Detection",
    description: "Detect specific points (skeleton) of subjects.",
  },
];

const categories = [
  {
    title: "Popular templates",
    templates: [
      "Build My Own",
      "Detect, count, and Visualize",
      "Detect and Classy",
      "Small Object Detection (SAHI)",
      "Text Recognition",
      "Background Removal",
    ],
  },
  {
    title: "Business Logic",
    templates: ["Conditional Branching", "Active Learning"],
  },
  {
    title: "Video Analytics",
    templates: ["Line Counter", "Time in Zone"],
  },
  {
    title: "Coming Soon",
    templates: ["Email Notifications", "CSV Export"],
  },
];

const ExploreTemplates = () => {
  const [active, setActive] = useState("Object Detection");

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">
        What type of model would you like to deploy?
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 w-full border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0">
          {sidebarOptions.map(({ title, description }) => (
            <div
              key={title}
              onClick={() => setActive(title)}
              className={`cursor-pointer p-3 rounded-md transition mb-2 ${
                active === title
                  ? "bg-purple-100 text-purple-700"
                  : "hover:bg-gray-50 text-gray-800"
              }`}
            >
              <div className="font-medium">{title}</div>
              <div className="text-xs text-gray-500">{description}</div>
            </div>
          ))}
        </div>

        {/* Template Categories */}
        <div className="flex-1 space-y-8">
          {categories.map((category) => (
            <div key={category.title}>
              <h3 className="text-md md:text-lg font-semibold mb-4">{category.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {category.templates.map((template) => (
                  <div key={template} className="text-center">
                    <div className="h-24 bg-purple-300 rounded-md mb-2 w-full"></div>
                    <p className="text-sm font-medium">{template}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreTemplates;
