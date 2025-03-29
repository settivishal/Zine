"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import {
    Button,
} from "@mui/material";

// components/DynamicHeroIcon.jsx
import { UserIcon } from "@heroicons/react/24/outline";

const DynamicHeroIcon = ({ icon, ...props }) => {
    return <UserIcon {...props} />;
};

// export default DynamicHeroIcon;

// components/ProfileIcon.jsx
// import { UserIcon } from "@heroicons/react/24/outline";

function ProfileIcon({ className = "" }) {
    return (
        <div
            className={`relative overflow-hidden bg-gray-800 rounded-full flex items-center justify-center ${className}`}>
            <UserIcon className="w-full h-full text-gray-400" />
        </div>
    );
}

export default function ProfilePicture({currentPicture}) {
    const [isHovering, setIsHovering] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");
    const fileInputRef = useRef(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);

            axios.post("http://localhost:8080/api/image/update", formData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("accessToken"),
                },
            })
            .then((response) => {
                setImage(response.data.imageUrl); // Assuming the response contains the URL of the uploaded image
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    setError(error.response.data.message || "Failed to upload image.");
                } else {
                    setError("An error occurred while uploading the image.");
                }
            });
        }
    };


    // const handleUpdatePicture = async (e) => {
    //     e.preventDefault();
    //     const file = e.target.files[0];
    //     if (!file) return;
    //     const formData = new FormData();
    //     formData.append("profilePicture", file);
    //     // Validation checks...
    //     setIsUploading(true);

    //     try {
    //         const response = await fetch("http://localhost:8080/api/image/update", {
    //             method: "POST",
    //             headers: {
    //             "Content-Type": "application/json",
    //             },
    //             body: formData,
    //         });
        
    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             setError(errorData.message || "Failed to upload picture");
    //             return;
    //         }
        
    //         const data = await response.json();
    //         setSuccess("Profile picture updated successfully!"); // Show
    //     } catch (error) {
    //         console.error("Error uploading image:", error);
    //     } finally {
    //         setIsUploading(false);
    //     }
    // };

    return (
        <div className="flex flex-col items-center">
            <div
                className="relative w-32 h-32 overflow-hidden rounded-full"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}>
                {currentPicture ? (
                    <Image
                        src={currentPicture}
                        alt="Profile"
                        fill
                        sizes="128px"
                        className="object-cover"
                    />
                ) : (
                    <ProfileIcon className="w-full h-full" />
                )}

                {isHovering && (
                    <div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer"
                    >
                    </div>
                )}

                
            </div>

            <Button
                variant="contained"
                component="label"
                className="m-4">
                Upload Picture
                <input
                    type="file"
                    hidden
                    onChange={handleImageUpload}
                />
                
            </Button>
        </div>
    );
}













// export default function ProfilePic({ currentPic, onUpdate }) {
//     const [isHovering, setIsHovering] = useState(false);
//     const [isUploading, setIsUploading] = useState(false);
//     const fileInputRef = useRef(null);

//     const handleFileChange = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         // Check file type
//         if (!file.type.startsWith("image/")) {
//             alert("Please select an image file");
//             return;
//         }

//         // Check file size (limit to 5MB)
//         if (file.size > 5 * 1024 * 1024) {
//             alert("File size should be less than 5MB");
//             return;
//         }

//         setIsUploading(true);

//         try {
//             // In a real app, you would upload the file to your server
//             const imageUrl = URL.createObjectURL(file);
//             onUpdate(imageUrl);
//         } catch (error) {
//             console.error("Error uploading image:", error);
//             alert("Failed to upload image. Please try again.");
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     return (
//         <div className="flex flex-col items-center">
//             <div
//                 className="relative w-32 h-32 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600"
//                 onMouseEnter={() => setIsHovering(true)}
//                 onMouseLeave={() => setIsHovering(false)}>
//                 {currentPic ? (
//                     <Image
//                         src={currentPic || "/default-avatar.png"}
//                         alt="Profile"
//                         layout="fill"
//                         objectFit="cover"
//                         className="w-full h-full"
//                     />
//                 ) : (
//                     <svg
//                         className="absolute w-36 h-36 text-gray-400 -left-2"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                         xmlns="http://www.w3.org/2000/svg">
//                         <path
//                             fillRule="evenodd"
//                             d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                             clipRule="evenodd"></path>
//                     </svg>
//                 )}

//                 {isHovering && (
//                     <div
//                         className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer"
//                         onClick={() => fileInputRef.current?.click()}>
//                         <span className="text-white text-sm font-medium">
//                             {isUploading ? "Uploading..." : "Change Photo"}
//                         </span>
//                     </div>
//                 )}

//                 <input
//                     type="file"
//                     ref={fileInputRef}
//                     className="hidden"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                 />
//             </div>

//             <button
//                 className="mt-3 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
//                 onClick={() => fileInputRef.current?.click()}>
//                 Update Profile Picture
//             </button>
//         </div>
//     );
// }
