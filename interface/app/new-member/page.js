"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NavbarInternal from "../components/NavbarInternal";
import Link from "next/link";

export default function Dashboard() {
  const status = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchFilteredChats = async () => {
      try {
        const response = await fetch("/api/get-chats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            searchQuery,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch filtered chats: ${response.statusText}`
          );
        }

        const chats = await response.json();
        setFilteredChats(chats);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchFilteredChats();
  }, [searchQuery]);

  const handleAddMember = () => {
    router.push("/add-member"); // Redirects to the "add-member" page
  };

  if (status.status === "unauthenticated") {
    router.push("/login");
  }

  if (status.status === "loading") {
    return <div>Loading...</div>;
  }

  if (status.status === "authenticated") {
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
          </div>
        </div>
      </>
    );
  }
}
