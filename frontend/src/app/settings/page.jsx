"use client";

import { useState, useEffect, createContext } from "react";
import UpdatePassword from "../../components/UpdateUserCreds";
import ProfilePicture from "../../components/ProfilePicture";
import { useAuth } from "../../hooks/authcontext";
import Navbar from "../../components/Navbar";

export default function SettingsPage() {
    const [profileData, setProfileData] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const [activityData, setActivityData] = useState([]);
    const { accessToken } = useAuth();


    return (
        <>
            <Navbar Page = {"Home"}/>
            <main className="bg-primary-light dark:bg-primary-dark container min-h-screen m-24 px-16 items-center rounded-xl mx-auto py-8">
                {/* Update password section */}
                <div className="bg-secondary-light dark:bg-secondary-dark w-1/2 p-6 m-3 rounded-lg shadow">
                    <h2 className="text-slate-600 text-xl font-semibold mb-4">
                        Security
                    </h2>
                    <UpdatePassword />
                </div>
            </main>
        </>
    );
}
