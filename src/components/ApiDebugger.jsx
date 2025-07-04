import React, { useState } from 'react';

const ApiDebugger = ({ apiCalls, createdObjects, setCreatedObjects, addApiCall }) => {
  const [showRawData, setShowRawData] = useState(false);

  const deleteAllObjects = async () => {
    if (createdObjects.length === 0) return;

    for (const objectName of createdObjects) {
      try {
        const apiCall = {
          endpoint: `/objects/${objectName}`,
          method: 'DELETE'
        };

        addApiCall({
          ...apiCall,
          status: 'sending'
        });

        const response = await fetch(`https://builder.impromptu-labs.com/api_tools/objects/${objectName}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer fytak7p6jgemco57ecu'
          }
        });

        const result = response.ok ? { message: 'Deleted successfully' } : await response.json();

        addApiCall({
          ...apiCall,
          status: response.ok ? 'success' : 'error',
          response: result
        });
      } catch (error) {
        addApiCall({
          endpoint: `/objects/${objectName}`,
          method: 'DELETE',
          status: 'error',
          error: error.message
        });
      }
    }

    setCreatedObjects([]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          API Debug Console
        </h3>
        <div className="space-x-3">
          <button
            onClick={() => setShowRawData(!showRawData)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
            aria-label="Toggle raw API data display"
          >
            {showRawData ? '🙈 Hide' : '👁️ Show'} Raw Data
          </button>
          {createdObjects.length > 0 && (
            <button
              onClick={deleteAllObjects}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
              aria-label="Delete all created objects"
            >
              🗑️ Delete Objects ({createdObjects.length})
            </button>
          )}
        </div>
      </div>

      {showRawData && (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {apiCalls.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No API calls made yet
            </p>
          ) : (
            apiCalls.map((call, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      call.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      call.status === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {call.method} {call.endpoint}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      call.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      call.status === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {call.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(call.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                {call.payload && (
                  <div className="mb-2">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Request:</p>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto">
                      {JSON.stringify(call.payload, null, 2)}
                    </pre>
                  </div>
                )}
                
                {call.response && (
                  <div className="mb-2">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Response:</p>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto">
                      {JSON.stringify(call.response, null, 2)}
                    </pre>
                  </div>
                )}
                
                {call.error && (
                  <div>
                    <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-1">Error:</p>
                    <p className="text-xs text-red-600 dark:text-red-400">{call.error}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {createdObjects.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Created Objects:
          </p>
          <div className="flex flex-wrap gap-2">
            {createdObjects.map((obj, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                {obj}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiDebugger;
