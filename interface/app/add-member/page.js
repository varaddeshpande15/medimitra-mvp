"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NavbarInternal from "../components/NavbarInternal";

export default function AddMember() {
  const { data: session, status } = useSession(); // Access session to get the email
  const router = useRouter();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [breakfastTime, setBreakfastTime] = useState("");
  const [lunchTime, setLunchTime] = useState("");
  const [dinnerTime, setDinnerTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user?.email) {
      alert("User is not logged in");
      return;
    }

    // Format the meal times
    const formattedBreakfast = `${breakfastTime}`;
    const formattedLunch = `${lunchTime}`;
    const formattedDinner = `${dinnerTime}`;

    // Get the logged-in user's email
    const userEmail = session.user.email;

    // Send data to the FastAPI backend at the correct URL
    const fastAPIresponse = await fetch('http://127.0.0.1:8000/users/' + userEmail + '/family/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        family_name: name,
        dob,
        breakfast: formattedBreakfast,
        lunch: formattedLunch,
        dinner: formattedDinner,
      }),
    });

    const response = await fetch("/api/member", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          name,
          dob,
          Breakfast: formattedBreakfast,
          Lunch: formattedLunch,
          Dinner: formattedDinner,
      }),
  });

    if (response.ok) {
      const newMember = await response.json();
      alert("New family member added successfully!");
      router.push(`/new-member`);
    } else {
      alert("Failed to add new family member");
    }
  };

  if (status === "unauthenticated") {
    router.push("/login");
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
    return (
      <>
        <div className="w-screen h-full relative">
          <NavbarInternal />

          {/* Main Section */}
          <div
            id="main"
            className="w-full h-full bg-gradient-to-r from-[#0F081A] to-black"
          >
            <div className="flex justify-center items-center w-full h-full pt-24">
              <div className="w-[80%] lg:w-[40%] bg-black border-1 border-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-white mb-6">
                  Add New Family Member
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white">
                      Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 text-black block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="mt-1 block text-black w-full p-2 border border-gray-300 rounded-md shadow-sm"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-white">
                        Breakfast Time
                      </label>
                      <input
                        type="time"
                        className="mt-1 block w-full p-2 text-black border border-gray-300 rounded-md shadow-sm"
                        value={breakfastTime}
                        onChange={(e) => setBreakfastTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-white">
                        Lunch Time
                      </label>
                      <input
                        type="time"
                        className="mt-1 block w-full text-black p-2 border border-gray-300 rounded-md shadow-sm"
                        value={lunchTime}
                        onChange={(e) => setLunchTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-white">
                        Dinner Time
                      </label>
                      <input
                        type="time"
                        className="mt-1 block w-full text-black p-2 border border-gray-300 rounded-md shadow-sm"
                        value={dinnerTime}
                        onChange={(e) => setDinnerTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
