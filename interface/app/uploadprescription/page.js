"use client"
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

function UploadPrescription() {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [userName, setUserName] = useState(''); // State for username
  const [familyMember, setFamilyMember] = useState(''); // State for family member
  const fileInputRef = React.useRef(null);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...files]); // Store file objects for upload
    setPreviews(prevPreviews => [...prevPreviews, ...imageUrls]);
  };

  const handleRemoveImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    setPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('user_name', userName);
    formData.append('family_name', familyMember);
    images.forEach(image => {
      formData.append('file', image);
    });

    try {
      const response = await fetch('http://127.0.0.1:8000/ocr/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log("Response from FastAPI:", data);
      // Handle success or error response here
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-1/2 p-5 border border-gray-300 rounded shadow-lg bg-white flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-4 text-black text-center">Choose your files</h2>

        {/* Input fields for username and family member name */}
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="border border-gray-300 p-2 mb-4 w-full text-black"
        />
        <input
          type="text"
          placeholder="Family Member Name"
          value={familyMember}
          onChange={(e) => setFamilyMember(e.target.value)}
          className="border border-gray-300 p-2 mb-4 w-full text-black"
        />

        <div className="relative w-full h-60 border border-dashed border-gray-400 flex items-center justify-center mb-4">
          {previews.length === 0 ? (
            <span className="text-gray-500">No images selected. Please choose files to upload.</span>
          ) : (
            <>
              {previews.map((preview, index) => (
                <div key={index} className="relative w-24 h-24 mx-2">
                  <img src={preview} alt={`Preview ${index}`} className="object-cover w-full h-full" />
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
          ref={fileInputRef}
          className="hidden"
          multiple
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={previews.length === 0 || !userName || !familyMember} // Disable if no images or empty fields
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default UploadPrescription;
