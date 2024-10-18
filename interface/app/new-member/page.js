"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NavbarInternal from "../components/NavbarInternal";
import Link from "next/link";

export default function Dashboard() {
  const status = useSession();
  const [title, setTitle] = useState("");
  const router = useRouter();
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const handleCreateNewChat = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/create-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (response.ok) {
      const { chatId } = await response.json();
      router.push(`/chat/${chatId}`);
    } else {
      alert("Failed to create new chat");
    }
  };

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
        //setError(`Error fetching filtered chats: ${err.message}`);
      }
    };

    fetchFilteredChats();
  }, [searchQuery]);

  const handleChatChange = (chatId) => {
    router.push(`/chat/${chatId}`);
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
          <img
            src="blur-purple.svg"
            alt="blur-purple"
            className="xs:hidden md:block w-[2000px] h-[2000px] fixed opacity-65 -left-[500px] -top-[500px]"
            style={{ zIndex: 0 }}
          />
          <div
            id="main"
            className="xs:invisible lg:visible w-full h-full bg-gradient-to-r from-[#0F081A] to-black"
          ></div>
        </div>
      </>
    );
  }
}
