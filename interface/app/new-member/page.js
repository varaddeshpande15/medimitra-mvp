"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NavbarInternal from "../components/NavbarInternal";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [members, setMembers] = useState([]); // State to hold member data

  useEffect(() => {
    const fetchMembers = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/members", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch members: ${response.statusText}`);
          }

          const membersData = await response.json();
          setMembers(membersData);
        } catch (err) {
          console.error(err.message);
        }
      }
    };

    fetchMembers();
  }, [status]);

  const handleAddMember = () => {
    router.push("/add-member"); // Redirects to the "add-member" page
  };

  // Redirect to login if the user is unauthenticated
  if (status === "unauthenticated") {
    router.push("/login");
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="w-screen h-full relative">
        <NavbarInternal />

        {/* Main Section */}
        <div
          id="main"
          className="xs:invisible lg:visible w-full h-full bg-gradient-to-r from-[#0F081A] to-black"
        >
          {/* Space between Navbar and user section */}
          <div className="flex justify-center items-center w-full h-full pt-48"> {/* Added padding at top */}
            {/* Centered User Logo and Plus Icon */}
            <div className="flex items-center space-x-6">
              {/* User's Circular Logo */}
              <div className="user-logo">
                <img
                  src="/path-to-existing-user-logo.jpg" // Replace with actual user profile image or placeholder
                  alt="User Logo"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>

              {/* Plus Icon */}
              <div className="add-member-icon">
                <button
                  onClick={handleAddMember}
                  className="text-6xl text-gray-400 hover:text-blue-500 transition duration-200"
                  title="Add New Member"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="members-list flex flex-col items-center mt-10">
            {members.length > 0 ? (
              members.map((member) => (
                <div key={member._id} className="member-item bg-gray-800 text-white p-4 rounded-lg my-2 w-4/5">
                  <h3 className="text-xl">{member.name}</h3>
                  <p className="text-gray-400">DOB: {new Date(member.dob).toLocaleDateString()}</p>
                  <p className="text-gray-400">Breakfast: {member.Breakfast}</p>
                  <p className="text-gray-400">Lunch: {member.Lunch}</p>
                  <p className="text-gray-400">Dinner: {member.Dinner}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-300">No members found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
