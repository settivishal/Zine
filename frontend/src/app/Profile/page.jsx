"use client";

import { useState, useEffect, createContext } from "react";
import ActivityGrid from "../../components/ActivityGrid";
import {
    UpdateUsername,
    UpdatePassword,
} from "../../components/UpdateUserCreds";
// import UpdatePassword from "../../components/UpdatePassword";
import ProfilePicture from "../../components/ProfilePicture";
import { UpdateBio } from "../../components/UpdateBio";
// const ProfileContext = createContext();

export default function ProfilePage({ children }) {
    const [profileData, setProfileData] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const [activityData, setActivityData] = useState([]);

    useEffect(() => {
        (async () => {
            // Fetch user data and activity data from API
            // This would typically be an API call to your backend
            // For demo purposes, we're using mock data
            const response = await fetch("http://localhost:8080/api/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer" + " " + localStorage.getItem("accessToken"),
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(
                    errorData.message || "Failed to fetch profile data."
                );
                return;
            }

            const data = await response.json();
            // console.log("data" + data)

            setProfileData(data); // Set profile data (username, email, etc.)
            // Mock activity data - array of objects with date and count
            // const mockActivity = generateMockActivityData();
            // setActivityData(mockActivity);
        })();

        const mockActivity = generateMockActivityData();
        console.log(mockActivity);
        setActivityData(mockActivity);
    }, []);

    // const handleUsernameUpdate = (newUsername) => {
    //     setUser({ ...user, username: newUsername });
    //     // In a real app, you would save this to your backend
    // };

    // const handleProfilePictureUpdate = (newPictureUrl) => {
    //     setUser({ ...user, profilePicture: newPictureUrl });
    //     // In a real app, you would upload the image and save the URL
    // };

    return (
        <main className="container bg-zinc-600 mx-auto px-2 py-8 max-w-full">
            <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {/* Left sidebar with profile picture and basic info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-slate-900 p-20 rounded-lg shadow">
                        <ProfilePicture
                            currentPicture={""}
                            // onUpdate={handleProfilePictureUpdate}
                        />

                        <div className="mt-4">
                            <h2 className="text-gray-500 text-2xl font-semibold">
                                {profileData?.name}
                            </h2>
                            <p className="text-2xl text-gray-600">
                                {profileData?.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main content area */}
                <div className="md:col-span-2 lg:col-span-3 space-y-4">
                    {/* Bio */}
                    <div className="bg-white p-6 rounded-lg shadow h-96">
                        <h2 className="text-slate-600 text-xl font-semibold mb-4">
                            BIO
                        </h2>
                        <label
                            htmlFor="About"
                            className="block text-lg font-medium text-gray-700">
                            About
                        </label>
                        <UpdateBio currentBio={profileData?.bio} />
                    </div>
                    {/* Activity grid */}
                    <div className="container mx-auto px-4 py-8 bg-white p-6 rounded-lg shadow h-96">
                        <h2 className="text-slate-600 text-xl font-semibold mb-4">
                            Your Activity
                        </h2>
                        <ActivityGrid activityData={activityData} />
                    </div>
                    {/* Update profile section */}
                    <div className="w-1/2 bg-white p-6 rounded-lg shadow">
                        <h2 className="text-slate-600 text-xl font-semibold mb-4">
                            Update Username
                        </h2>
                        <UpdateUsername
                            currentUsername={profileData?.name}
                            // onUpdate={handleUsernameUpdate}
                        />
                    </div>
                    {/* Update password section */}
                    <div className="w-1/2 bg-white p-6 rounded-lg shadow">
                        <h2 className="text-slate-600 text-xl font-semibold mb-4">
                            Security
                        </h2>
                        <UpdatePassword />
                    </div>
                </div>
            </div>
        </main>
    );
}

// Helper function to generate mock activity data
function generateMockActivityData() {
    const data = [];
    const today = new Date();

    // Generate data for the last 12 months
    for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        // Random activity count (more likely to be 0)
        const random = Math.random();
        let count = 0;

        if (random > 0.7) count = Math.floor(Math.random() * 5) + 1;
        if (random > 0.9) count = Math.floor(Math.random() * 10) + 5;

        data.push({
            date: date.toISOString().split("T")[0],
            count,
        });
    }
    return data;
}
