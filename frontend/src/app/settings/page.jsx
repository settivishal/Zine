"use client";

import { useState, useEffect, createContext } from "react";
import UpdatePassword from "../../components/UpdateUserCreds";
// import UpdatePassword from "../../components/UpdatePassword";
import ProfilePicture from "../../components/ProfilePicture";
// const ProfileContext = createContext();
import { useAuth } from "../../hooks/authcontext";
import Navbar from "../../components/Navbar";

export default function ProfilePage({ children }) {
    const [profileData, setProfileData] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const [activityData, setActivityData] = useState([]);
    const { accessToken } = useAuth();

    // useEffect(() => {
    //     if(accessToken){
    //         (async () => {
    //             // Fetch user data and activity data from API
    //             // This would typically be an API call to your backend
    //             // For demo purposes, we're using mock data
    //             const response = await fetch("http://localhost:8080/api/profile", {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     Authorization: `Bearer ${accessToken}`, // Assuming you have a token in your auth context
    //                 },
    //             });

    //             if (!response.ok) {
    //                 const errorData = await response.json();
    //                 setErrorMessage(
    //                     errorData.message || "Failed to fetch profile data."
    //                 );
    //                 return;
    //             }

    //             const data = await response.json();
    //             console.log("data" + data)

    //             setProfileData(data); // Set profile data (username, email, etc.)
    //         })();
    //     }
    // }, [accessToken]);

    return (
        <>
            <Navbar Page = {"Home"}/>
            <main className="container min-h-screen m-24 px-16 items-center rounded-xl bg-amber-200 mx-auto py-8">
                {/* Update password section */}
                <div className="w-1/2 bg-white p-6 m-3 rounded-lg shadow">
                    <h2 className="text-slate-600 text-xl font-semibold mb-4">
                        Security
                    </h2>
                    <UpdatePassword />
                </div>
            </main>
        </>
    );
}
