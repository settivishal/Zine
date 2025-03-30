import React, { useState, useEffect } from "react";
import { Button, Avatar, Box } from "@mui/material";
import axios from "axios";
import { useAuth } from "@/hooks/authcontext";

const ProfilePicture = ({ currentPic }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(currentPic);
    const { accessToken } = useAuth();
    useEffect(() => {
        setPreview(currentPic);
        console.log("preview", preview);
    })

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

    const handleUpload = async () => {
        if (!selectedImage) {
            alert("Please select an image first!");
            return;
        }
        const formData = new FormData();
        formData.append("image", selectedImage);

        try {
            const response = await axios.post("http://localhost:8080/api/image/update", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}` // Assuming you have a token in your auth context,
                },
            });
            alert("Profile picture uploaded successfully!");
            console.log(response.data);
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            alert("Failed to upload profile picture.");
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Avatar
                src={preview}
                alt="Profile Preview"
                sx={{ width: 200, height: 200 }}
            />
            <Button variant="contained" component="label">
                Choose Picture
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                />
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                hidden
                disabled={!selectedImage}
            >
                Upload
            </Button>
        </Box>
    );
};

export default ProfilePicture;