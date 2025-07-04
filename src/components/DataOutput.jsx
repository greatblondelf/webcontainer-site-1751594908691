import React, { useState } from 'react';

const DataOutput = ({ data, onReset, addApiCall }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const downloadCSV = () => {
    if (!data || !data.text_value) return;
    
    const csvContent = `data:text/csv;charset=utf-8,${data.text_value}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "extracted_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Extracted Data Results
        </h3>
        <div className="space-x-3">
          <button
            onClick={downloadCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            aria-label="Download data as CSV"
          >
            📥 Download CSV
          </button>
          <button
            onClick={onReset}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-800"
            aria-label="Reset and start over"
          >
            🔄 Start Over
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-striped table-hover w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('content')}
                  aria-label="Sort by content"
                >
                  Extracted Content
                  {sortField === 'content' && (
                    <span className="ml-2">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100">
                  {data.text_value || 'No content available'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
        <details className="group">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded">
            📊 Data Summary
          </summary>
          <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400" aria-describedby="data-summary">
            <p><strong>Status:</strong> Extraction completed successfully</p>
            <p><strong>Content Length:</strong> {data.text_value ? data.text_value.length : 0} characters</p>
            <p><strong>Processing Time:</strong> {new Date().toLocaleString()}</p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default DataOutput;
