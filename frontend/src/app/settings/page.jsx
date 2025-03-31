"use client";

import { useState, useEffect, createContext } from "react";
import UpdatePassword from "../../components/UpdateUserCreds";
// import UpdatePassword from "../../components/UpdatePassword";
import ProfilePicture from "../../components/ProfilePicture";
// const ProfileContext = createContext();
import { useAuth } from "../../hooks/authcontext";

export default function ProfilePage({ children }) {
    const [profileData, setProfileData] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const [activityData, setActivityData] = useState([]);
    const { accessToken } = useAuth();

    useEffect(() => {
        if(accessToken){
            (async () => {
                // Fetch user data and activity data from API
                // This would typically be an API call to your backend
                // For demo purposes, we're using mock data
                const response = await fetch("http://localhost:8080/api/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`, // Assuming you have a token in your auth context
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
                c

                setProfileData(data); // Set profile data (username, email, etc.)
            })();
        }
    }, [accessToken]);

    // const handleUsernameUpdate = (newUsername) => {
    //     setUser({ ...user, username: newUsername });
    //     // In a real app, you would save this to your backend
    // };

    // const handleProfilePictureUpdate = (newPictureUrl) => {
    //     setUser({ ...user, profilePicture: newPictureUrl });
    //     // In a real app, you would upload the image and save the URL
    // };

    return (
        <main className="container min-h-screen m-24 px-16 items-center bg-zinc-600 mx-auto py-8">
            <div>
                <ProfilePicture currentPic={profileData?.image}/>
            </div>
            {/* Update profile section */}
            {/* <div className="w-1/2 bg-slate-100 p-6 m-3 rounded-lg shadow">
                <h2 className="text-slate-600 text-xl font-semibold mb-4">
                    Update Username
                </h2>
                <UpdateUsername
                    currentUsername={profileData?.name}
                    // onUpdate={handleUsernameUpdate}
                />
            </div> */}
            {/* Update password section */}
            <div className="w-1/2 bg-white p-6 m-3 rounded-lg shadow">
                <h2 className="text-slate-600 text-xl font-semibold mb-4">
                    Security
                </h2>
                <UpdatePassword />
            </div>
        </main>
    );
}
