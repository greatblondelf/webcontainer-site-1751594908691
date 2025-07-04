import React, { useEffect } from 'react';

const ExtractionProgress = ({ 
  files, 
  isExtracting, 
  onStartExtraction, 
  onExtractionComplete, 
  onCancel,
  addApiCall 
}) => {
  
  useEffect(() => {
    if (isExtracting) {
      performExtraction();
    }
  }, [isExtracting]);

  const performExtraction = async () => {
    try {
      const apiCall = {
        endpoint: '/apply_prompt',
        method: 'POST',
        payload: {
          created_object_names: ['extracted_data'],
          prompt_string: 'Extract key information and summarize the main points from: {uploaded_documents}',
          inputs: [
            {
              object_name: 'uploaded_documents',
              processing_mode: 'combine_events'
            }
          ]
        }
      };

      addApiCall({
        ...apiCall,
        status: 'sending'
      });

      const response = await fetch('https://builder.impromptu-labs.com/api_tools/apply_prompt', {
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
        // Fetch the extracted data
        const dataResponse = await fetch('https://builder.impromptu-labs.com/api_tools/return_data/extracted_data', {
          headers: {
            'Authorization': 'Bearer fytak7p6jgemco57ecu'
          }
        });

        const extractedData = await dataResponse.json();
        
        addApiCall({
          endpoint: '/return_data/extracted_data',
          method: 'GET',
          status: dataResponse.ok ? 'success' : 'error',
          response: extractedData
        });

        onExtractionComplete(extractedData, ['uploaded_documents', 'extracted_data']);
      } else {
        throw new Error(result.message || 'Extraction failed');
      }
    } catch (error) {
      addApiCall({
        endpoint: '/apply_prompt',
        method: 'POST',
        status: 'error',
        error: error.message
      });
      console.error('Extraction error:', error);
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Ready to Extract Data
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {files.length} file{files.length !== 1 ? 's' : ''} ready for processing
        </p>
      </div>

      {!isExtracting ? (
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Files to process:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {files.map((file, index) => (
                <li key={index}>• {file.name}</li>
              ))}
            </ul>
          </div>
          
          <button
            onClick={onStartExtraction}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
            aria-label="Start data extraction process"
          >
            Start Extraction
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="spinner"></div>
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Extracting data...
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Processing your files and extracting key information
            </p>
          </div>
          
          <button
            onClick={onCancel}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
            aria-label="Cancel extraction process"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ExtractionProgress;
