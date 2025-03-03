"use client";

import { useState } from "react";

import Button from "../src/app/templates/Components/Button";

export default function UpdateUsername({ currentUsername, onUpdate }) {
    const [username, setUsername] = useState(currentUsername);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate username
        if (!username.trim()) {
            setError("Username cannot be empty");
            return;
        }

        if (username.trim() === currentUsername) {
            setIsEditing(false);
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            // In a real app, you would send this to your API
            // For this example, we'll just update the state
            await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

            onUpdate(username);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating username:", error);
            setError("Failed to update username. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        {/* <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700">
                            Username
                        </label> */}
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="text-black mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter new username"
                            disabled={isSubmitting}
                        />
                        {error && (
                            <p className="mt-1 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save"}
                        </Button>
                        
                        <Button 
                            onClick={() => {
                                setUsername(currentUsername);
                                setIsEditing(false);
                                setError("");
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>    
                            
                    </div>
                </form>
            ) : (
                <div className="flex justify-between items-center">
                    <div>
                        {/* <h3 className="text-sm font-medium text-gray-700">
                            Username
                        </h3> */}
                        <p className="mt-1 text-4xl text-gray-900">
                            {currentUsername}
                        </p>
                    </div>

                    <Button onClick={() => setIsEditing(true)}>Edit</Button>
                </div>
            )}
        </div>
    );
}
