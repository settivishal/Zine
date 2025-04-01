"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Avatar, Button } from "@mui/material";
import { useAuth } from "../hooks/authcontext";

export default function ProfilePicture({ currentPic }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [error, setError] = useState("");

    const [preview, setPreview] = useState(currentPic);
    const { accessToken } = useAuth();
    useEffect(() => {
        if(currentPic){
            setPreview(currentPic);
        }
        console.log("preview", preview);
    }, [currentPic]);
        
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log("this ran")
        if (file) {
            console.log("file", file);
            if (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png") {
                setSelectedImage(file);
                setPreview(URL.createObjectURL(file));
            } else {
                alert("Please select a valid image file (JPEG or PNG).");
                setSelectedImage(null);
                setPreview(currentPic);
            }
        }
    };
    const handleImageUpload = async (event) => {
        // const file = event.target.files[0];
        if (selectedImage) {
            const formData = new FormData();
            formData.append("image", selectedImage);
            // console.log("formData")

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
                setSelectedImage(null);
            } catch (error) {
                setError("An error occurred while uploading the image.");
            }
        }
    };
    

    return (
        <div className="flex flex-col items-center gap-4">
            <Avatar
                alt= "Profile Picture"
                src={preview}
                sx={{ width: 200, height: 200 }}
                className="border-4 text-gray-900 border-white shadow-lg"
            />
            <div className="flex items-center gap-4">
                <Button
                    variant="contained"
                    component="label"
                    className="m-28"
                >
                    Upload
                    <input
                        type="file"
                        hidden
                        onChange={handleImageChange}
                    />
                </Button>
                <Button
                    variant="contained"
                    className="m-28"
                    onClick={handleImageUpload}
                    disabled={!selectedImage}
                >
                    Save
                </Button>
            </div>
            
        </div>
    );
}
