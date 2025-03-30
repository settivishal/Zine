"use client";

import { useState } from "react";
import { useAuth } from "../hooks/authcontext";

import Button from "./Button";

// function UpdateUsername({ currentUsername, onUpdate }) {
//     const [username, setUsername] = useState(currentUsername);
//     const [isEditing, setIsEditing] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState("");

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Validate username
//         if (!username.trim()) {
//             setError("Username cannot be empty");
//             return;
//         }

//         if (username.trim() === currentUsername) {
//             setIsEditing(false);
//             return;
//         }

//         setError("");
//         setIsSubmitting(true);

//         try {
//             await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

//             onUpdate(username);
//             setIsEditing(false);
//         } catch (error) {
//             console.error("Error updating username:", error);
//             setError("Failed to update username. Please try again.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="space-y-4">
//             {isEditing ? (
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <input
//                             type="text"
//                             id="username"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             className="text-black mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="Enter new username"
//                             disabled={isSubmitting}
//                         />
//                         {error && (
//                             <p className="mt-1 text-sm text-red-600">{error}</p>
//                         )}
//                     </div>

//                     <div className="flex gap-2">
//                         <Button disabled={isSubmitting}>
//                             {isSubmitting ? "Saving..." : "Save"}
//                         </Button>
                        
//                         <Button 
//                             onClick={() => {
//                                 setUsername(currentUsername);
//                                 setIsEditing(false);
//                                 setError("");
//                             }}
//                             disabled={isSubmitting}
//                         >
//                             Cancel
//                         </Button>    
                            
//                     </div>
//                 </form>
//             ) : (
//                 <div className="flex justify-between items-center">
//                     <div>
//                         <p className="mt-1 text-4xl text-gray-900">
//                             {currentUsername}
//                         </p>
//                     </div>

//                     <Button onClick={() => setIsEditing(true)}>Edit</Button>
//                 </div>
//             )}
//         </div>
//     );
// }





export default function UpdatePassword() {
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [New_Password, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { accessToken } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset messages
        setError("");
        setSuccess("");

        // Validate inputs
        if (!Password) {
            setError("Current password is required");
            return;
        }

        if (!New_Password) {
            setError("New password is required");
            return;
        }

        if (New_Password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (New_Password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:8080/api/change_password", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify({Email, Password, New_Password }),
            });
        
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || "Failed to update password.");
                return;
            }
        
            const data = await response.json();

            // Reset form
            setPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setSuccess("Password updated successfully");

            
        } catch (error) {
            console.error("Error updating password:", error);
            setError("Failed to update password. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
                <div className="p-3 bg-green-100 text-gray-600 rounded-md">
                    {success}
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700">
                    User Email
                </label>
                <div className="relative mt-1">
                    <input
                        id="email"
                        type="text"
                        placeholder="email"
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-3 w-full py-2 border border-gray-600 rounded  text-sm text-black focus:outline-none focus:ring-1 focus:bor focus:ring-blue-500"
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700">
                    Current Password
                </label>
                <div className="relative mt-1">
                    <input
                        id="password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-3 w-full py-2 border border-gray-600 rounded  text-sm text-black focus:outline-none focus:ring-1 focus:bor focus:ring-blue-500"
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-gray-700">
                    New Password
                </label>
                <div className="relative mt-1">
                    <input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={New_Password}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mb-3 w-full py-2 border border-gray-600 rounded  text-sm text-black focus:outline-none focus:ring-1 focus:ring-blue-500"
                        disabled={isSubmitting}
                    />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                    Password must be at least 8 characters long
                </p>
            </div>

            <div>
                <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                </label>
                <div className="relative mt-1">
                    <input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        // className="mb-3 w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-1 focus:ring-gray-400"
                        className="mb-3 w-full py-2 border border-gray-600 rounded  text-sm text-black focus:outline-none focus:ring-1 focus:ring-blue-500"
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div>
                <Button
                    type="submit"
                    className=" text-black flex justify-center py-2 px-4 border border-gray-600 shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Password"}
                </Button>
            </div>

            <div className="mt-4 text-sm text-gray-600">
                <p>Password requirements:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>At least 8 characters long</li>
                    <li>Include at least one uppercase letter</li>
                    <li>Include at least one number</li>
                    <li>Include at least one special character</li>
                </ul>
            </div>
        </form>
    );
}


// export { UpdateUsername, UpdatePassword };