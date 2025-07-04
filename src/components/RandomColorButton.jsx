import React, { useState } from 'react';

const RandomColorButton = () => {
  const [backgroundColor, setBackgroundColor] = useState('#3b82f6');

  const getRandomColor = () => {
    const colors = [
      '#e74c3c', '#3498db', '#2ecc71', '#f39c12', 
      '#9b59b6', '#1abc9c', '#e67e22', '#34495e',
      '#f1c40f', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#00bcd4', '#009688',
      '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b',
      '#ffc107', '#ff9800', '#ff5722', '#795548'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleClick = () => {
    setBackgroundColor(getRandomColor());
  };

  return (
    <button
      onClick={handleClick}
      className="px-8 py-4 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
      style={{ backgroundColor: backgroundColor }}
      aria-label="Click to change button color randomly"
    >
      Click me to change color!
    </button>
  );
};

export default RandomColorButton;
