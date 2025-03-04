"use client";

import { useState } from "react";

import Button from "../app/templates/Components/Button";

export default function UpdateBio({ currentBio}) {
    const [bio, setBio] = useState(currentBio);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleBio = async (e) => {
        e.preventDefault();

        if (bio.trim() === currentBio) {
            setIsEditing(false);
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:8080/api/bio", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body:JSON.stringify({bio}),
            });
        
            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Failed to update Bio.");
                return;
            }
        
            const data = await response.json();

            setSuccess("Bio updated successfully");

            
        } catch (error) {
            console.error("Error updating Bio:", error);
            setError("Failed to update Bio. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            {isEditing ? (
                <form onSubmit={handleBio} className="space-y-4">
                    <div>
                        <textarea
                            id="paragraphInput"
                            name="paragraphInput"
                            value = {bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows="5"
                            cols="50"
                            placeholder="Tell us about yourself..."
                            disabled={isSubmitting}
                            className="w-full p-2 text-black border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                                setBio(currentBio);
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
                        <p className="mt-1 text-4xl text-gray-900">
                            {currentBio}
                        </p>
                    </div>

                    <Button onClick={() => setIsEditing(true)}>Edit</Button>
                </div>
            )}
        </div>
    );
}
