import axios from "axios";

// ✅ Updated ngrok URL and correct /pose-label endpoint
const FILE_UPLOAD_URL = "https://8771-2401-4900-1b69-601a-65-3832-da00-6d01.ngrok-free.app/pose-label";

export const uploadPoseFile = async (selectedFile, projectName, taskName) => {
  try {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("project_name", projectName);
    formData.append("task_name", taskName);

    const response = await axios.post(FILE_UPLOAD_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ File Upload Success:", response.data);

    return {
      ...response.data,
      preview_url: "https://8771-2401-4900-1b69-601a-65-3832-da00-6d01.ngrok-free.app${response.data.preview_url}",
    };
  } catch (error) {
    console.error("❌ Upload Failed:", error.response?.data || error.message);
    throw error;
  }
};