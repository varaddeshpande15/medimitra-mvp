// "use client"; // Ensure this is added for client-side components

// import React from 'react';
// import { useRouter } from 'next/navigation'; // Import the useRouter from next/navigation

// function MemberDashboard() {
//   const router = useRouter(); // Initialize the router

//   // Function to handle the button click
//   const handleAddMedicineClick = () => {
//     router.push('/add-medicine'); // Redirect to the /add-medicine page
//   };

//   return (
//     <div>
//         <NavbarInternal /> 
//     <div className=''>
        
//       <button onClick={handleAddMedicineClick} className="bg-blue-500 text-white px-4 py-2 rounded">
//         Add Medicine
//       </button>
//     </div>
//     </div>
//   );
// }

// export default MemberDashboard;
// /pages/add-medicine/[id].js
// Make sure this is a client component
"use client";
import { useRouter } from "next/navigation"; // Use this import instead of next/router
import { useEffect } from "react";
import NavbarInternal from '@app/components/NavbarInternal';

export default function MemberDashboard() {
  const router = useRouter();
    // Function to handle the button click
  const handleAddMedicineClick = () => {
    router.push('/uploadprescription'); // Redirect to the /add-medicine page
  };

  // Your logic for fetching member data or other operations

  const handleGoBack = () => {
    router.back(); // Example of navigating back
  };

  useEffect(() => {
    // Example: You can also implement some logic here
  }, []);

  return (
    <div>
      <div>
         {/* <NavbarInternal />  */}
     <div className=''>
        
       <button onClick={handleAddMedicineClick} className="bg-blue-500 text-white px-4 py-2 rounded">
         Add Medicine
       </button>
     </div>
     </div>
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
}
