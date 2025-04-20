"use client";
import axios from 'axios';

import {
    Chip,
    Typography,
    LinearProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useAuth } from '../../hooks/authcontext';

import {UpdateBio, UpdateAge, UpdateGender, UpdateHobbies} from "../../components/UpdateBio";
import ActivityGrid from "../../components/ActivityGrid";
import Navbar from "../../components/Navbar";
import ProfilePicture from "../../components/ProfilePicture";

export default function ProfilePage() {
    const [image, setImage] = useState();
    const [profileData, setProfileData] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const [activityData, setActivityData] = useState([]);
    const { accessToken } = useAuth();
    
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);
            

            try {
                const response = await fetch("http://localhost:8080/api/image/update", {
                    method: "POST",
                    headers: {
                        // "Content-Type": "multipart/form-data", // Do not set this header; the browser will set it automatically
                        Authorization: `Bearer ${accessToken}` // Include the access token in the headers
                        
                    },
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || "Failed to upload image.");
                    return;
                }

                const data = await response.json();
                setImage(data.image); // Assuming the response contains the URL of the uploaded image
            } catch (error) {
                setErrorMessage("An error occurred while uploading the image.");
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
                    .get("http://localhost:8080/api/profile", config)
                    .then((response) => {
                        setProfileData(response.data); // Set profile data (username, email, etc.)
                    })
                    .catch((error) => {
                        if (error.response && error.response.data) {
                            setErrorMessage(error.response.data.message || "Failed to fetch profile data.");
                        } else {
                            setErrorMessage("Failed to fetch profile data.");
                        }
                    });
            };

            fetchProfileData();
        }
        const mockActivity = generateMockActivityData();
        setActivityData(mockActivity);
    }, [accessToken]);
    
    
    return (
        <>
            <Navbar Page={"Home"} />
            <div className="min-h-screen px-16 flex items-center justify-center">
                <div className="bg-amber-100 shadow-xl rounded-lg w-full p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Left Section */}
                    <div className="bg-orange-50 p-6 rounded-lg flex flex-col items-center gap-4">
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
                            {/* <Chip label="Frequent Flyer" color="primary" /> */}
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
                            <div className="container mx-auto px-4 py-8 bg-white p-6 rounded-lg shadow h-96">
                                <h2 className="text-slate-600 text-xl font-semibold mb-4">
                                    Your Activity
                                </h2>
                                <ActivityGrid activityData={activityData} />
                            </div>
                        </div>
                        <div className="shadow-xl rounded-lg w-full p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personality Section */}
                            {/* <div className="p-8">
                                <Typography
                                    variant="h6"
                                    className="font-bold text-gray-800">
                                    Personality
                                </Typography>
                                {[
                                    "Introvert",
                                    "Analytical",
                                    "Loyal",
                                    "Passive",
                                ].map((trait, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 mt-1">
                                        <span className="text-sm text-gray-600">
                                            {trait}
                                        </span>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(index + 1) * 20}
                                            sx={{ width: "100%", height: 8 }}
                                            color={
                                                index % 2 === 0
                                                    ? "primary"
                                                    : "secondary"
                                            }
                                        />
                                    </div>
                                ))}
                            </div> */}

                            {/* Frustrations Section */}
                            {/* <div className="p-8">
                                <Typography
                                    variant="h6"
                                    className="font-bold text-gray-800">
                                    Frustrations
                                </Typography>
                                <ul className="list-disc list-inside mt-2 text-sm text-gray-600 space-y-1">
                                    <li>
                                        Too much time spent booking – she’s
                                        busy!
                                    </li>
                                    <li>Too many websites visited per trip</li>
                                    <li>
                                        Not tech-savvy – dislikes the process
                                    </li>
                                </ul>
                            </div> */}

                            {/* Goals Section */}
                            {/* <div className="p-8">
                                <Typography
                                    variant="h6"
                                    className="font-bold text-gray-800">
                                    Goals
                                </Typography>
                                <ul className="list-disc list-inside mt-2 text-sm text-gray-600 space-y-1">
                                    <li>To spend less time booking travel</li>
                                    <li>To narrow her options quickly</li>
                                </ul>
                            </div> */}

                            {/* Favorite Brands Section */}
                            {/* <div className="p-8">
                                <Typography
                                    variant="h6"
                                    className="font-bold text-gray-800">
                                    Favourite Brands
                                </Typography>
                                <div className="flex gap-4 mt-4 items-center justify-start flex-wrap">
                                    {[
                                        "Adidas",
                                        "Nike",
                                        "Netflix",
                                        "Airbnb",
                                        "Zara",
                                    ].map((brand) => (
                                        // Replace with brand logos if available
                                        <Chip
                                            key={brand}
                                            label={brand}
                                            color={"default"}
                                            size={"medium"}
                                        />
                                    ))}
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
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