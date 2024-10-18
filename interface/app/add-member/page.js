"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NavbarInternal from "../components/NavbarInternal";

export default function AddMember() {
  const status = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [breakfastTime, setBreakfastTime] = useState("");
  const [breakfastAmPm, setBreakfastAmPm] = useState("AM");
  const [lunchTime, setLunchTime] = useState("");
  const [lunchAmPm, setLunchAmPm] = useState("PM");
  const [dinnerTime, setDinnerTime] = useState("");
  const [dinnerAmPm, setDinnerAmPm] = useState("PM");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Combine time with AM/PM
    const formattedBreakfast = `${breakfastTime} ${breakfastAmPm}`;
    const formattedLunch = `${lunchTime} ${lunchAmPm}`;
    const formattedDinner = `${dinnerTime} ${dinnerAmPm}`;

    // Send data to the backend
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
        alert("New family member added successfully!");
        router.push("/dashboard");
    } else {
        alert("Failed to add new family member");
    }
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
            className="w-full h-full bg-gradient-to-r from-[#0F081A] to-black"
          >
            {/* Space below Navbar */}
            <div className="flex justify-center items-center w-full h-full pt-24">
              
              {/* Form Container */}
              <div className="w-[80%] lg:w-[40%] bg-black border-1 border-white p-8 rounded-lg shadow-lg">
                {/* Heading */}
                <h1 className="text-3xl font-bold text-center text-white mb-6">
                  Add New Family Member
                </h1>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-white">
                      Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 text-black block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Date of Birth Input */}
                  <div>
                    <label className="block text-sm font-medium text-white">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="mt-1 block text-black  w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      required
                    />
                  </div>

                  {/* Breakfast Time Input */}
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block  text-sm font-medium text-white">
                        Breakfast Time
                      </label>
                      <input
                        type="time"
                        className="mt-1 block w-full p-2 text-black  border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={breakfastTime}
                        onChange={(e) => setBreakfastTime(e.target.value)}
                        required
                      />
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700">
                        AM/PM
                      </label>
                      <select
                        className="mt-1 block p-2 text-black   border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={breakfastAmPm}
                        onChange={(e) => setBreakfastAmPm(e.target.value)}
                        required
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div> */}
                  </div>

                  {/* Lunch Time Input */}
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-white">
                        Lunch Time
                      </label>
                      <input
                        type="time"
                        className="mt-1 block w-full text-black  p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={lunchTime}
                        onChange={(e) => setLunchTime(e.target.value)}
                        required
                      />
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700">
                        AM/PM
                      </label>
                      <select
                        className="mt-1 block p-2 text-black  border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={lunchAmPm}
                        onChange={(e) => setLunchAmPm(e.target.value)}
                        required
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div> */}
                  </div>

                  {/* Dinner Time Input */}
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-white">
                        Dinner Time
                      </label>
                      <input
                        type="time"
                        className="mt-1 block w-full text-black  p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={dinnerTime}
                        onChange={(e) => setDinnerTime(e.target.value)}
                        required
                      />
                    </div>
                    {/* <div>
                      <label className="block text-sm  font-medium text-gray-700">
                        AM/PM
                      </label>
                      <select
                        className="mt-1 block p-2 border text-black  border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={dinnerAmPm}
                        onChange={(e) => setDinnerAmPm(e.target.value)}
                        required
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div> */}
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
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
