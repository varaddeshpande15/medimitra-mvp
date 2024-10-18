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
      try {
        const response = await fetch('/api/member', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const membersData = await response.json();
        console.log("Fetched members:", membersData);
        setMembers(membersData); // Set the fetched members to state
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };

    fetchMembers(); // Call the function to fetch members

    // Redirect to login if the user is unauthenticated
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]); // Depend on status and router

  const handleAddMember = () => {
    router.push("/add-member"); // Redirects to the "add-member" page
  };

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
          <div className="flex justify-center items-center w-full h-full pt-48">
            {/* Centered User Logo and Plus Icon */}
            <div className="flex items-center space-x-6">
              {/* Plus Icon */}
              <div className="add-member-icon">
                <button
                  onClick={handleAddMember}
                  className="text-6xl text-gray-400 hover:text-blue-500 transition duration-200 fixed bottom-9 right-5"
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
              <div className="flex flex-wrap justify-center">
                {members.map((member) => (
                  <div key={member._id} className="flex flex-col items-center mx-4 mb-4">
                    <div className="member-logo rounded-full overflow-hidden border-2 border-gray-400 w-16 h-16 flex items-center justify-center">
                      <img
                        src={member.profileImage || '/path-to-placeholder-image.jpg'} // Ensure each member has a profile image or a placeholder
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="member-name text-white text-lg mt-2">{member.name}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300">No members found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
