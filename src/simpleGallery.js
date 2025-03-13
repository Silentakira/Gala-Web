// src/SimpleGallery.js
import React, { useState, useEffect } from 'react';

const SimpleGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch images
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/images');
        if (!response.ok) throw new Error('Failed to fetch images');
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchImages();
    
    // Set up interval (10 seconds)
    const intervalId = setInterval(fetchImages, 10000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-white">Gala Event Photos</h1>
        <p className="text-gray-400">Photos are updated automatically every 10 seconds</p>
      </header>

      {loading && images.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-400">Loading photos...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center p-10 bg-black rounded-lg">
          <p className="text-gray-300">No photos available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="bg-black rounded-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={`/images/${image}`} 
                  alt={`Gala photo ${index + 1}`}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-3 text-center bg-black">
                <a 
                  href={`/images/${image}`} 
                  download
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleGallery;