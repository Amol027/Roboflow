import { useState,useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useUser } from "../../Contexts/userContext";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../utils/Config"


const NewProject = () => {
  const [projectName, setProjectName] = useState("My First Project");
  const [annotationGroup, setAnnotationGroup] = useState("Objects");
  const [selectedLicense, setSelectedLicense] = useState("CC BY 4.0");
  const [isLicenseOpen, setIsLicenseOpen] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputLink, setOutputLink] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const [submittedModel, setSubmittedModel] = useState("");
  const [modelOptions, setModelOptions] = useState([]);
  const [showProjectTypeWarning, setShowProjectTypeWarning] = useState(false);
  const [isResultPopupOpen, setIsResultPopupOpen] = useState(false);
  const [actionType, setActionType] = useState(""); // "Prediction" or "Training"
  const [predictedClass, setPredictedClass] = useState("");
const [confidenceScore, setConfidenceScore] = useState("");
const [isClassInfoPopupOpen, setIsClassInfoPopupOpen] = useState(false);
 const [classCount, setClassCount] = useState(0);
const [classCountSubmitted, setClassCountSubmitted] = useState(false);
const [classNames, setClassNames] = useState([]);
const [numClasses, setNumClasses] = useState(""); 
 const [zipFile, setZipFile] = useState("null");
 
// const handleFileChange = (e) => {
//   const file = e.target.files[0];
//   setZipFile(file); // <- this should set state correctly
// };


const [metrics, setMetrics] = useState({
  train_accuracy: "N/A",
  val_accuracy: "N/A",
  precision: "N/A",
  recall: "N/A"
});


useEffect(() => {
  axios.get(`${BASE_URL}/classification/metrics`) 
    .then((response) => {
      setMetrics(response.data);
      // console.log("fetch metrics",response.data)
    })
    .catch((error) => {
      console.error("Error fetching metrics:", error);
    });
}, []);





  const { user } = useUser();
  const navigate = useNavigate();
  
  const [projectId, setProjectId] = useState(null);
const location = useLocation();

useEffect(() => {
  if (location.state?.projectId) {
    setProjectId(location.state.projectId);
  }
}, [location.state]);

  const handleTrainingUpload = async () => {
    if (!zipFile || !classNames || classNames.length === 0 || !submittedModel || !(location?.state?.projectId)) {
  console.log("❌ Missing fields", { zipFile, classNames, submittedModel, projectId: location?.state?.projectId });
  alert("Please fill all required fields.");
  return;
}
  
    const token = localStorage.getItem("authToken");
  
    const classArray = classNames.map((cls) => cls.trim());
  
    const formData = new FormData();
    formData.append("project_id", location?.state?.projectId || "");
    formData.append("num_classes", classArray.length);
    formData.append("class_names", classArray.join(","));
    formData.append("model_name", submittedModel);
    formData.append("file", zipFile);
  
    console.log("Upload button clicked ✅");
    console.log("Sending request to:", `${BASE_URL}/classification/train`);
  
    try {
      const response = await axios.post(`${BASE_URL}/classification/train`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("🎯 API Response:", response.data);
      alert("Training started successfully!");
      setIsResultPopupOpen(true); // optionally show result popup
    } catch (error) {
      console.error("❌ API call failed:", error);
      alert("Training failed: " + (error.response?.data?.detail || error.message));
      console.error("🔍 Detailed error:", error.response?.data);

          alert("Training failed: " + JSON.stringify(error.response?.data));
      
          
    }
    
  };
  


  // const handleTrainingUpload = async () => {
  //   if (!zipFile || !classNames || !submittedModel || !projectId) {
  //     alert("Please fill all required fields.");
  //     return;
  //   }

  //   const token = localStorage.getItem("authToken");
  //    e.preventDefault();
     
  //    const classArray = classNames.split(",").map((cls) => cls.trim());
  //    // const handleClassificationTrain = async () => {
      
  //     const formData = new FormData();
  //   formData.append("project_id", location?.state?.projectId ||"");
  //   formData.append("num_classes", selectedModel);
  //   formData.append("class_names", classNames.join(","));
  //   formData.append("model_name", submittedModel);
  //   formData.append("file",zipFile );
  //   console.log("Upload button clicked ✅");
  //   console.log("Sending request to:", `${BASE_URL}/classification/train`);
  //   console.log("FormData preview:");

  //   try {
  //     const response = await axios.post(`${BASE_URL}/classification/train`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //          Authorization: `Bearer ${token}`,
           
  //         },
          
  //     });
  //      console.log("🎯 API Response:", response.data);
  //     console.log("Classification training success:", response.data);
  //     alert("Training started successfully!");
  //   } catch (error) {
  //      console.error("❌ API call failed:", error);
  //     console.error("Classification training error:", error);
  //     alert("Training failed:" + (error.response?.data?.detail || error.message) );
  //   }
  // };
// useEffect(()=>{
// const token = localStorage.getItem("authToken");

//   if (!token) {
//     alert("Please log in first.");
//     return;
//   }
// },[])
//   useEffect(() => {
//   if (location.state && location.state.projectId) {
//     setProjectId(location.state.projectId);
//     console.log("Project ID received:", location.state.projectId);
//   } else {
//     alert("No project ID found. Please create a project first.");
//   }
// }, [location]);

  const licenses = ["Private", "Public Domain", "MIT", "CC BY 4.0", "BY-NC-SA 4.0", "ODbL v1.0"];

  const projectTypes = [
    { name: "Classification", description: "Classify data into predefined categories.", tags: ["Labels", "Categories", "Supervised"] },
    { name: "Auto labeler", description: "Automatically detect objects using bounding boxes.", tags: ["Bounding Boxes", "Counts", "Tracking"] },
    { name: "Keypoint Annotations", description: "Assign keypoint labels to the entire image.", tags: ["Pose Estimation", "Skeletons", "Body Parts"] },
    { name: "Polygon Annotations", description: "Draw polygons to mark object outlines.", tags: ["Polygons", "Measuring", "Odd Shapes"] },
    { name: "NER", description: "Identify named entities from text content.", tags: ["Text", "NER", "Tokens"] },
    { name: "Object Detection", description: "Draw bounding boxes and classify detected objects.", tags: ["Visual Detection", "Annotations", "Labels"] },
    { name: "Dataset Splitter", description: "Split your dataset into training, testing, and validation sets.", tags: ["Train/Test", "Ratios", "Shuffling"] },
    { name: "Model Trainer", description: "Train a model on the annotated dataset.", tags: ["Training", "Model", "Accuracy"] },
    
  ];

  const modelOptionsMap = {
    "Classification": ["resnet", "mobilenet"],
    "Auto labeler": ["yolov8x", "retinanet"],
    "Keypoint Annotations": ["yolov8n", "movenet"],
    "Polygon Annotations": ["maskrcnn_resnet50_fpn", "yolov8x"],
    "NER": ["flair", "spacy"],
    "Object Detection": ["frcnn", "yolov8"],
    "Dataset Splitter": ["yolov5s", "yolov8n"],
    "Model Trainer": ["MobileNetV2", "yolo"],
    
  };

  const handleProjectTypeClick = (type) => {
    setSelectedProjectType(type.name);
    setUploadedFiles([]);
    setOutputLink(null);
    setModelOptions(modelOptionsMap[type.name] || []);
    setIsPopupOpen(true);
  };

//   const handleFileUpload = (e) => {
//   const newFiles = Array.from(e.target.files);

//   if (actionType === "Prediction" && selectedProjectType === "Classification") {
//     setUploadedFiles([newFiles[0]]); // Only one file allowed
//   } else {
//     setUploadedFiles((prev) => [...prev, ...newFiles]);
//   }

//   setOutputLink(null);
//   const file = e.target.files[0];
//   setZipFile(file.name);
// };
const handleFileUpload = (e) => {
  const files = Array.from(e.target.files);
  setUploadedFiles((prev) => [...prev, ...files]);

  // If you need to send the first ZIP file separately
  const zip = files.find(file => file.name.endsWith('.zip'));
  if (zip) setZipFile(zip);
};

  const handleRemoveFile = (index) => {
    const updated = [...uploadedFiles];
    updated.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  const handleProcess = () => {
  setIsProcessing(true);
  setTimeout(() => {
    setIsProcessing(false);
    setOutputLink("/output/result.zip");
    setIsResultPopupOpen(true);

    // Only for classification prediction, simulate result
    if (actionType === "Prediction" && selectedProjectType === "Classification") {
      setPredictedClass("Dog");
      setConfidenceScore("92.45%");
    }
  }, 3000);
};



  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
  e.preventDefault();
  setDragActive(false);
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const newFiles = Array.from(e.dataTransfer.files);

    if (actionType === "Prediction" && selectedProjectType === "Classification") {
      setUploadedFiles([newFiles[0]]);
    } else {
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }

    setOutputLink(null);
    e.dataTransfer.clearData();
  }
};


  const ReturnHome = () => navigate("/");

  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-y-auto bg-gray-50 py-6 px-4 md:px-12 lg:px-24 z-0">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center text-sm text-gray-500 mb-2 flex-wrap">
          <button onClick={ReturnHome}>{user?.name || "User"}</button>
          <span className="mx-2">›</span>
          <span className="bg-gray-200 px-2 py-1 rounded text-xs">Public</span>
          <span className="mx-2">›</span>
          <span>{projectName}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Let's Create Your Project.</h1>
      </div>

      {/* Form Fields */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Annotation Group</label>
          <input type="text" value={annotationGroup} onChange={(e) => setAnnotationGroup(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div className="flex-1 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">License</label>
          <button onClick={() => setIsLicenseOpen(!isLicenseOpen)} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white flex items-center justify-between">
            <span>{selectedLicense}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {isLicenseOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              {licenses.map((license) => (
                <button key={license} onClick={() => { setSelectedLicense(license); setIsLicenseOpen(false); }} className="w-full px-3 py-2 text-left hover:bg-gray-50">
                  {license}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Section: Project Type + Upload */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left - Project Types */}
        <div className="lg:w-2/5 overflow-y-auto max-h-[calc(100vh-300px)] pr-2 z-10">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Project Type</h2>
          {projectTypes.map((type) => (
            <div key={type.name} onClick={() => handleProjectTypeClick(type)} className={`p-4 border rounded-lg cursor-pointer mb-3 transition-all ${selectedProjectType === type.name ? "border-blue-300 bg-purple-50" : "border-gray-200 hover:border-gray-300"}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{type.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {type.tags.map((tag) => (
                      <span key={tag} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ml-4 mt-1 ${selectedProjectType === type.name ? "border-gray-500 bg-blue-500" : "border-gray-300"}`}>
                  {selectedProjectType === type.name && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right - Upload Section */}
        <div className="lg:w-3/5 relative">
          <div className="bg-gray-100 rounded-lg p-4 md:p-6 min-h-[500px]">

            <div className="flex justify-center">

              <div

                className="bg-white shadow-md rounded-lg p-7 w-full max-w-2xl min-h-[420px]"

                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}

              >
                {submittedModel && (
                  <div className="mb-6 text-xl text-gray-700 font-medium">
                    <span className="text-gray-600">Selected Model:</span>{" "}
                    <span className="text-blue-700 font-semibold">{submittedModel}</span>
                  </div>
                )}


                <div className={`border-2 ${dragActive ? "border-green-500 bg-green-50" : "border-gray-400"} border-dashed p-6 rounded-md text-center h-[180px] flex flex-col justify-center transition-all`}>

                  <input type="file" accept=".zip,.jpg,.jpeg,.png,.mp4" multiple className="hidden" id="upload-files"  onChange={handleFileUpload} />
                  <label
                    htmlFor="upload-files" 
                     
                    onClick={(e) => {
                      if (!selectedProjectType) {
                        e.preventDefault();
                        setShowProjectTypeWarning(true);
                      }
                    }}
                    className="cursor-pointer text-black-600 text-md"
                  >
                    {uploadedFiles.length === 0
                      ? "Click or Drag files (ZIP, JPG, PNG, MP4)"
                      : "Add More Files or Drop Here"}
                  </label>

                  {showProjectTypeWarning && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center relative">
                        <button
                          onClick={() => setShowProjectTypeWarning(false)}
                          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-lg"
                        >
                          ✕
                        </button>
                        <h2 className="text-xl font-semibold mb-4 text-red-600">
                          Select Project Type
                        </h2>
                        <p className="text-gray-700 mb-6">
                          Please select a project type before uploading files.
                        </p>
                        <button
                          onClick={() => setShowProjectTypeWarning(false)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
                        >
                          Okay
                        </button>
                      </div>
                    </div>
                  )}


                  {uploadedFiles.length > 0 && (
                    <ul className="mt-4 text-left text-sm text-gray-700 space-y-1 overflow-y-auto max-h-[100px]">
                      {uploadedFiles.map((file, index) => (
                        <li key={index} className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded">
                          <span className="truncate max-w-[80%]">{file.name}</span>
                          <button className="text-red-500 hover:text-red-700 text-sm" onClick={() => handleRemoveFile(index)}>
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                </div>




                {/* Buttons  for  preview files */}
                <div className="mt-6 space-y-4 text-center">
                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    className={`w-full px-5 py-2 rounded text-white transition ${uploadedFiles.length === 0 ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                    disabled={uploadedFiles.length === 0}
                  >
                    Preview Files
                  </button>
                  <button
                   onClick={handleTrainingUpload}  
                    className={`w-full px-5 py-2 rounded text-white transition ${uploadedFiles.length === 0 || isProcessing ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                    disabled={uploadedFiles.length === 0 || isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Process"}
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
     {isPopupOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="bg-white rounded-lg shadow-xl p-6 w-96 relative min-h-[300px] transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.02] text-center">
      <button
        onClick={() => setIsPopupOpen(false)}
        className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-lg"
      >
        ✕
      </button>
      <h2 className="text-2xl font-semibold m-3 mb-7 text-blue-700">Choose Action</h2>
      <div className="flex flex-col gap-4 items-center">
        {/* ✅ Autolabeler: only show for supported project types */}
        {["Auto labeler", "Polygon Annotations", "Keypoint Annotations", "Object Detection"].includes(selectedProjectType) && (
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg w-4/5 h-12"
            onClick={() => {
              setIsPopupOpen(false);
              setActionType("Autolabeler");
            }}
          >
            Autolabeler
          </button>
        )}

        {/* ✅ Training: always shown */}
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-4/5 h-12"
          onClick={() => {
            setIsPopupOpen(false);
            setActionType("Training");
            setIsModalOpen(true);
          }}
        >
          Training
        </button>

        {/* ✅ Prediction: always shown */}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-4/5 h-12"
          onClick={() => {
            setIsPopupOpen(false);
            setActionType("Prediction");
          }}
        >
          Prediction
        </button>
      </div>
    </div>
  </div>
)}


      {/* Model Select Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
          <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-xl min-h-[300px] flex flex-col justify-center transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.02] text-center">
            <h2 className="text-2xl font-semibold mb-6 text-black-600">
              Select Model for {selectedProjectType}
            </h2>

            <label className="block text-base font-medium text-gray-700 mb-2 text-left">
              Choose Model <span className="text-red-500">*</span>
            </label>

            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={`block w-full px-4 py-2 text-base border ${selectedModel === "" ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              <option value="">Select a model</option>
              {modelOptions.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>

            {/* Validation Message */}
            {selectedModel === "" && (
              <p className="text-sm text-red-500 mt-2 text-left">Model selection is required.</p>
            )}

            <button
              onClick={() => {
                if (selectedModel === "") return; 
                setSubmittedModel(selectedModel); 
                setIsModalOpen(false); 
                console.log("Selected Project Type:", selectedProjectType);
console.log("Action Type:", actionType);

                if (selectedProjectType === "Classification" && actionType === "Training") {
    setClassCount(0);
      setClassCountSubmitted(false);
      setClassNames([]);
      setIsClassInfoPopupOpen(true);
    
  }
                console.log("Model Selected:", selectedModel);
              }}
              className={`w-full mt-6 py-2 rounded-md text-white text-base transition ${selectedModel === ""
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
                }`}
              disabled={selectedModel === ""}
            >
              Submit
            </button>
          </div>
        </div>
      )}

    {isClassInfoPopupOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white w-[500px] h-[600px] rounded-lg shadow-lg p-6 relative overflow-y-auto">
      <button
        onClick={() => setIsClassInfoPopupOpen(false)}
        className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-lg"
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold text-center text-purple-700 mb-4">
        Classification Setup
      </h2>

      <label className="block text-gray-700 text-sm mb-2">
        Number of Classes:
      </label>
      <input
        type="number"
        min={1}
        value={classCount}
        onChange={(e) => {
          const count = Number(e.target.value);
          setClassCount(count);
          setNumClasses(count); 
          setClassNames(Array(count).fill(""));
        }}
        className="w-full border border-gray-300 px-4 py-2 rounded-md mb-4"
      />

      <p className="text-sm text-gray-700 mb-2">Enter Class Names:</p>
      {classNames.map((name, idx) => (
        <input
          key={idx}
          type="text"
          placeholder={`Class ${idx + 1}`}
          value={name}
          onChange={(e) => {
            const updated = [...classNames];
            updated[idx] = e.target.value;
            setClassNames(updated);
          }}
          className="w-full border border-gray-300 px-3 py-2 rounded-md mb-2"
        />
      ))}

      <button
        onClick={() => {
          console.log("Submitted Classes:", classNames);
          setIsClassInfoPopupOpen(false);
        }}
        disabled={classNames.length < 1 || classNames.every((name) => name.trim() === "")}
        className={`${
          classNames.length >= 1 && classNames.some((name) => name.trim() !== "")
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-300 cursor-not-allowed"
        } text-white px-6 py-2 rounded-md w-full mt-4`}
      >
        Submit Classes
      </button>
    </div>
  </div>
)}



      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl h-[80vh] rounded-lg shadow-lg p-6 relative flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-lg"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-center text-blue-700 mb-4">
              File Preview
            </h2>

            {/* Scrollable File Grid */}
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {uploadedFiles.map((file, index) => {
                  const fileURL = URL.createObjectURL(file);
                  const type = file.type;

                  return (
                    <div
                      key={index}
                      className="w-full h-[250px] border rounded-xl p-4 bg-gray-50 shadow-md relative flex flex-col justify-between"
                    >
                      <p className="text-sm font-medium text-center truncate mb-2">
                        {file.name}
                      </p>

                      <div className="w-full h-[240px] flex items-center justify-center rounded bg-white overflow-hidden">
                        {type.startsWith("image/") ? (
                          <img
                            src={fileURL}
                            alt={file.name}
                            className="w-full h-full object-contain"
                          />
                        ) : type.startsWith("video/") ? (
                          <video controls className="w-full h-full object-contain">
                            <source src={fileURL} type={type} />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <div className="text-gray-600 text-sm text-center">
                            No preview available
                          </div>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                        onClick={() => {
                          const updated = [...uploadedFiles];
                          updated.splice(index, 1);
                          setUploadedFiles(updated);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add More Files Button Fixed Bottom */}
            <div className="pt-4  mt-4">
              <div className="text-center">
                <input
                  type="file"
                  id="add-more-files"
                  multiple
                  accept=".zip,.jpg,.jpeg,.png,.mp4"
                  className="hidden"
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files);
                    setUploadedFiles((prev) => [...prev, ...newFiles]);
                  }}
                />
                <label
                  htmlFor="add-more-files"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md cursor-pointer"
                >
                  Add More Files
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
{/* result popup */}
{isResultPopupOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white w-full max-w-5xl h-[80vh] rounded-lg shadow-lg p-6 relative flex flex-col">
      <button
        onClick={() => setIsResultPopupOpen(false)}
        className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-lg"
      >
        ✕
      </button>

      <h2 className="text-2xl font-semibold text-center text-purple-700 mb-4">
        Processed Output
      </h2>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actionType === "Prediction" && selectedProjectType === "Classification" ? (
            <div className="w-full h-[250px] border rounded-xl p-4 bg-gray-50 shadow-md flex flex-col justify-between">
              <p className="text-sm font-medium text-center truncate mb-2">
                {uploadedFiles[0]?.name}
              </p>
              <div className="w-full h-[200px] flex items-center justify-center rounded bg-white overflow-hidden">
                <img
                  src={URL.createObjectURL(uploadedFiles[0])}
                  alt="Prediction Result"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-3 text-center text-gray-800">
                <p><strong>Class:</strong> {predictedClass}</p>
                <p><strong>Confidence:</strong> {confidenceScore}</p>
              </div>
            </div>
          ) : (
            
              <div className="text-center w-full flex flex-col items-center justify-center h-full">

              <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
              Training Completed Successfully 🎉
            </h2>

          <div className="bg-gray-100 p-4 rounded shadow-md max-w-xl mx-auto">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Training Metrics</h3>
            <table className="w-full text-sm border text-gray-700">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Metric</th>
                  <th className="border px-4 py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border px-4 py-2">Accuracy</td><td className="border px-4 py-2">{metrics.train_accuracy}</td></tr>
                <tr><td className="border px-4 py-2">Loss</td><td className="border px-4 py-2">{metrics.val_accuracy}</td></tr>
                <tr><td className="border px-4 py-2">Precision</td><td className="border px-4 py-2">{metrics.precision}</td></tr>
                <tr><td className="border px-4 py-2">Recall</td><td className="border px-4 py-2">{metrics.recall}</td></tr>
              </tbody>
            </table>
          </div>
                <p className="text-center text-green-600 mt-4 font-medium">
              {metrics.message || "Training success. Now you can go for prediction."}
            </p>
              </div>
            
          )}
        </div>
      </div>

      <div className="pt-4 mt-4 text-center">
        <a
          href="/sample_output.zip"
          download
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md"
        >
          Download Output (.zip)
        </a>
      </div>
    </div>
  </div>
)}


    </div>

  );
};
// }
export default NewProject;