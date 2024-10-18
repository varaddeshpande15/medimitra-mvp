"use client"
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa'; // Importing cross icon

function UploadPrescription() {
  const [images, setImages] = useState([]); // Array to hold multiple images
  const [previews, setPreviews] = useState([]); // Array for previews
  const fileInputRef = React.useRef(null); // Reference for the hidden input element

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files); // Get files from the input
    const imageUrls = files.map(file => URL.createObjectURL(file)); // Create URLs for each file
    setImages(prevImages => [...prevImages, ...imageUrls]); // Add new images to existing ones
    setPreviews(prevPreviews => [...prevPreviews, ...imageUrls]); // Add previews
  };

  const handleRemoveImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index)); // Remove the image from the array
    setPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index)); // Remove the preview
  };

  const handleUploadClick = () => {
    fileInputRef.current.click(); // Programmatically trigger the hidden input
  };

  const handleSubmit = () => {
    // Handle submit logic if needed
    console.log("Submitted Images:", images);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-1/2 p-5 border border-gray-300 rounded shadow-lg bg-white flex flex-col items-center"> {/* Increased size */}
        <h2 className="text-lg font-semibold mb-4 text-black text-center">Choose your files</h2>

        <div className="relative w-full h-60 border border-dashed border-gray-400 flex items-center justify-center mb-4"> {/* Increased height */}
          {previews.length === 0 ? (
            <span className="text-gray-500">No images selected. Please choose files to upload.</span> // Placeholder text
          ) : (
            <>
              {previews.map((preview, index) => (
                <div key={index} className="relative w-24 h-24 mx-2">
                  <img src={preview} alt={`Cropped ${index}`} className="object-cover w-full h-full" />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 p-1 bg-red-500 rounded-full"
                    title="Remove Image"
                  >
                    <FaTimes className="text-white" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        <button
          onClick={handleUploadClick}
          className="mb-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Upload File
        </button>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef} // Reference to the hidden input
          className="hidden" // Hide the input
          multiple // Allow multiple files
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={previews.length === 0} // Disable if no images are uploaded
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default UploadPrescription;
