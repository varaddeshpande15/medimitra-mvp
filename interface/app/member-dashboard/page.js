"use client"; // Ensure this is added for client-side components

import React from 'react';
import { useRouter } from 'next/navigation'; // Import the useRouter from next/navigation
import NavbarInternal from '@app/components/NavbarInternal';
function MemberDashboard() {
  const router = useRouter(); // Initialize the router

  // Function to handle the button click
  const handleAddMedicineClick = () => {
    router.push('/add-medicine'); // Redirect to the /add-medicine page
  };

  return (
    <div>
        <NavbarInternal /> 

    <div className=''>
        
      <button onClick={handleAddMedicineClick} className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Medicine
      </button>
    </div>
    </div>
  );
}

export default MemberDashboard;
