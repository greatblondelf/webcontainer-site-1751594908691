import React, { useState } from 'react';
import RandomColorButton from './components/RandomColorButton';
import UploadExtractFlow from './components/UploadExtractFlow';
import DarkModeToggle from './components/DarkModeToggle';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Random Color Button & Data Extraction
            </h1>
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
          
          <div className="mb-12 flex justify-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                Interactive Color Button
              </h2>
              <RandomColorButton />
            </div>
          </div>

          <UploadExtractFlow />
        </div>
      </div>
    </div>
  );
}

export default App;
