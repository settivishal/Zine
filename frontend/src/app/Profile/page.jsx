"use client";
import axios from 'axios';

import {
    Chip,
    Typography,
    LinearProgress,
} from "@mui/material";

import { useState, useEffect } from "react";
import { useAuth } from '../../hooks/authcontext';

import {UpdateBio, UpdateAge, UpdateGender, UpdateHobbies, UpdateSocialLinks} from "../../components/UpdateBio";
import ActivityGrid from "../../components/ActivityGrid";
import Navbar from "../../components/Navbar";
import ProfilePicture from "../../components/ProfilePicture";
import Footer from "../../components/Footer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
    const [image, setImage] = useState();
    const [profileData, setProfileData] = useState({});
    const [error, setError] = useState("");

    // const [activityData, setActivityData] = useState([]);
    const { accessToken } = useAuth();
    
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);
            

            try {
                const response = await fetch(`${API_BASE_URL}/api/image/update`, {
                    method: "POST",
                    headers: {
                        // "Content-Type": "multipart/form-data", // Do not set this header; the browser will set it automatically
                        Authorization: `Bearer ${accessToken}` // Include the access token in the headers
                        
                    },
                    body: formData,
                });

                if (!response.ok) {
                    const error = await response.json();
                    setError(error.message || "Failed to upload image.");
                    return;
                }

                const data = await response.json();
                setImage(data.image); // Assuming the response contains the URL of the uploaded image
            } catch (error) {
                setError("An error occurred while uploading the image.");
            }
        }
    };


    useEffect(() => {
        if(accessToken) {
            const fetchProfileData = () => {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`, // Include the access token in the headers
                    },
                };

                axios
                    .get(`${API_BASE_URL}/api/profile`, config)
                    .then((response) => {
                        setProfileData(response.data); // Set profile data (username, email, etc.)
                    })
                    .catch((error) => {
                        if (error.response && error.response.data) {
                            setError(error.response.data.message || "Failed to fetch profile data.");
                        } else {
                            setError("Failed to fetch profile data.");
                        }
                    });
            };

            fetchProfileData();
        }
        // const mockActivity = generateMockActivityData();
        // setActivityData(mockActivity);
    }, [accessToken]);
    
    return (
        <div className='bg-white dark:bg-gray-900 relative flex flex-col p-4 min-h-screen'>
            <Navbar Page={"Home"} />
            <div className="min-h-screen px-16 flex items-center justify-center">
                <div className="bg-primary-light dark:bg-primary-dark shadow-xl rounded-lg w-full p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Left Section */}
                    <div className="bg-secondary-light dark:bg-secondary-dark p-6 rounded-lg flex flex-col items-center gap-4">
                        <ProfilePicture currentPic={profileData?.image} />
                        <Typography
                            variant="h5"
                            className="my-4 text-gray-900 font-bold">
                            {profileData?.name}
                        </Typography>
                        
                        <div className="mt-6 text-left w-full">
                            <Typography
                                variant="h6"
                                className="font-bold text-gray-700">
                                Age:
                            </Typography>
                            <div className="flex items-center gap-2">
                                <UpdateAge currentAge={profileData?.age} />
                            </div>
                            <Typography
                                variant="h6"
                                className="font-bold text-gray-700 mt-2">
                                Gender:
                            </Typography>
                            <div className="flex items-center gap-2">
                                <UpdateGender currentGender={profileData?.gender} />
                            </div>
                            <Typography
                                variant="h6"
                                className="font-bold text-gray-700 mt-2">
                                Hobbies:
                            </Typography>
                        </div>
                        <UpdateHobbies currentHobbies={profileData?.hobbies} />
                    </div>

                    {/* Right Section */}
                    <div className="col-span-3 grid grid-cols-1 md:grid-cols-1 gap-6">
                        {/* Bio Section */}
                        <div>
                            <Typography
                                variant="h5"
                                className="font-bold text-gray-800">
                                Bio
                            </Typography>
                            <UpdateBio currentBio={profileData?.bio} />
                        </div>
                        {/* Motivations Section */}
                        <div>
                            <Typography
                                variant="h5"
                                className="font-bold text-gray-800">
                                Activity Grid
                            </Typography>
                            <div className="bg-secondary-light dark:bg-secondary-dark container mx-auto px-4 py-8 p-6 rounded-lg shadow h-96">
                                <h2 className="text-slate-600 text-xl font-semibold mb-4">
                                    Your Activity
                                </h2>
                                <ActivityGrid/>
                            </div>
                        </div>
                        {/* Social Profiles Section */}
                        <div>
                            <Typography
                                variant="h5"
                                className="font-bold text-gray-800">
                                Social Profiles
                            </Typography>

                            {profileData ? (
                                <UpdateSocialLinks
                                    currentLinks={{
                                        instagram_url: profileData?.instagram_url || "",
                                        twitter_url: profileData?.twitter_url || "",
                                        reddit_url: profileData?.reddit_url || "",
                                        linkedin_url: profileData?.linkedin_url || "",
                                    }}
                                />
                                ) : (
                                    <p>Loading...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

// Helper function to generate mock activity data
// function generateMockActivityData() {
//     const data = [];
//     const today = new Date();

//     // Generate data for the last 12 months
//     for (let i = 0; i < 365; i++) {
//         const date = new Date(today);
//         date.setDate(today.getDate() - i);

//         // Random activity count (more likely to be 0)
//         const random = Math.random();
//         let count = 0;

//         if (random > 0.7) count = Math.floor(Math.random() * 5) + 1;
//         if (random > 0.9) count = Math.floor(Math.random() * 10) + 5;

//         data.push({
//             date: date.toISOString().split("T")[0],
//             count,
//         });
//     }
//     return data;
// }