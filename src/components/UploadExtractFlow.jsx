import React, { useState } from 'react';
import FileUpload from './FileUpload';
import ExtractionProgress from './ExtractionProgress';
import DataOutput from './DataOutput';
import ApiDebugger from './ApiDebugger';

const UploadExtractFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [extractedData, setExtractedData] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [apiCalls, setApiCalls] = useState([]);
  const [createdObjects, setCreatedObjects] = useState([]);

  const addApiCall = (call) => {
    setApiCalls(prev => [...prev, { ...call, timestamp: new Date().toISOString() }]);
  };

  const handleFilesUploaded = (files) => {
    setUploadedFiles(files);
    setCurrentStep(2);
  };

  const handleExtractionComplete = (data, objectNames) => {
    setExtractedData(data);
    setCreatedObjects(prev => [...prev, ...objectNames]);
    setIsExtracting(false);
    setCurrentStep(3);
  };

  const handleStartExtraction = () => {
    setIsExtracting(true);
  };

  const handleCancel = () => {
    setIsExtracting(false);
    setCurrentStep(1);
    setUploadedFiles([]);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setUploadedFiles([]);
    setExtractedData(null);
    setIsExtracting(false);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Upload & Extract Data Flow
        </h2>
        
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= step 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step 
                      ? 'bg-primary-600' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <FileUpload 
            onFilesUploaded={handleFilesUploaded}
            addApiCall={addApiCall}
          />
        )}
        
        {currentStep === 2 && (
          <ExtractionProgress 
            files={uploadedFiles}
            isExtracting={isExtracting}
            onStartExtraction={handleStartExtraction}
            onExtractionComplete={handleExtractionComplete}
            onCancel={handleCancel}
            addApiCall={addApiCall}
          />
        )}
        
        {currentStep === 3 && (
          <DataOutput 
            data={extractedData}
            onReset={handleReset}
            addApiCall={addApiCall}
          />
        )}
      </div>

      <ApiDebugger 
        apiCalls={apiCalls}
        createdObjects={createdObjects}
        setCreatedObjects={setCreatedObjects}
        addApiCall={addApiCall}
      />
    </div>
  );
};

export default UploadExtractFlow;
