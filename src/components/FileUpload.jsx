import React, { useState } from 'react';

const FileUpload = ({ onFilesUploaded, addApiCall }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const fileArray = Array.from(fileList);
    setFiles(fileArray);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    try {
      const fileContents = await Promise.all(
        files.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
          });
        })
      );

      const apiCall = {
        endpoint: '/input_data',
        method: 'POST',
        payload: {
          created_object_name: 'uploaded_documents',
          data_type: 'strings',
          input_data: fileContents
        }
      };

      addApiCall({
        ...apiCall,
        status: 'sending'
      });

      const response = await fetch('https://builder.impromptu-labs.com/api_tools/input_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fytak7p6jgemco57ecu'
        },
        body: JSON.stringify(apiCall.payload)
      });

      const result = await response.json();

      addApiCall({
        ...apiCall,
        status: response.ok ? 'success' : 'error',
        response: result
      });

      if (response.ok) {
        onFilesUploaded(files);
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      addApiCall({
        endpoint: '/input_data',
        method: 'POST',
        status: 'error',
        error: error.message
      });
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors duration-200 ${
          dragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload files"
        />
        
        <div className="space-y-4">
          <div className="text-6xl">📄</div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Support for text files, documents, and more
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Selected Files ({files.length})
          </h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
          </div>
          
          <button
            onClick={uploadFiles}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800"
            aria-label="Upload selected files"
          >
            Upload Files
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
