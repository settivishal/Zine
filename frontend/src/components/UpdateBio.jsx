"use client";

import axios from "axios";
import { useState, useEffect} from "react";
import { useAuth } from "../hooks/authcontext";

import Button from "./Button";

const updateProfileField = async (
    field,
    value,
    setError,
    setIsEditing,
    setIsSubmitting
) => {
    const [success, setSuccess] = useState("");
    const { accessToken } = useAuth();
    if (!accessToken) {
        setError("Access token is missing.");
        return;
    }
    try {
        const payload = { [field]: value };
        const response = await axios.post(
            "http://localhost:8080/api/profile/update",
            payload, // Ensure the payload matches the server's expected format
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (response.status !== 200) {
            setError(response.data.message || `Failed to update ${field}.`);
            return;
        }

        setSuccess(`${field} updated successfully`);
    } catch (error) {
        console.error(`Error updating ${field}:`, error);
        setError(
            error.response?.data?.message ||
                `Failed to update ${field}. Please try again.`
        );
    } finally {
        setIsEditing(false);
        setIsSubmitting(false);
    }
};


function UpdateBio({ currentBio }) {
    const [bio, setBio] = useState(""); // Ensure default value is an empty string
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setBio(currentBio);
    })

    const handleBio = async (e) => {
        e.preventDefault();

        if (bio.trim() === currentBio) {
            setIsEditing(false);
            return;
        }

        setError("");
        setIsSubmitting(true);
        updateProfileField(
            "bio",
            bio,
            setError,
            setIsEditing,
            setIsSubmitting
        );
    };

    return (
        <div className="space-y-4">
            {isEditing ? (
                <form onSubmit={handleBio} className="space-y-4">
                    <div>
                        <textarea
                            id="paragraphInput"
                            name="paragraphInput"
                            value={bio}
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
                            onClick={(e) => {
                                setBio(currentBio);
                                setIsEditing(false);
                                setError("");
                            }}
                            disabled={isSubmitting}>
                            Cancel
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="flex justify-between items-center">
                    <div>
                        <p className="mt-1 text-4xl text-gray-900">{bio}</p>
                    </div>

                    <Button onClick={() => setIsEditing(true)}>Edit</Button>
                </div>
            )}
        </div>
    );
}

function UpdateAge({ currentAge }) {
    const [age, setAge] = useState(0); // Ensure default value is 0
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // const [success, setSuccess] = useState("");

    useEffect(() => {
        setAge(currentAge);
    })

    

    const handleAge = async (e) => {
        e.preventDefault();

        if (age === currentAge) {
            setIsEditing(false);
            return;
        }

        setError("");
        setIsSubmitting(true);
        updateProfileField(
            "age",
            age,
            setError,
            setIsEditing,
            setIsSubmitting
        );
    };

    return (
        <div className="space-y-4">
            {isEditing ? (
                <form onSubmit={handleAge} className="space-y-4">
                    <div>
                        <input
                            id="ageInput"
                            name="ageInput"
                            type="number"
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))} // Ensure value is a number
                            placeholder="Enter your age..."
                            disabled={isSubmitting}
                            className="border border-gray-300 rounded px-2 py-1 text-blue-800 w-full"
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
                            onClick={(e) => {
                                setAge(currentAge);
                                setIsEditing(false);
                                setError("");
                            }}
                            disabled={isSubmitting}>
                            Cancel
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="flex items-center justify-between">
                    <div>
                        <p className="mt-1 text-4xl text-gray-900">{age}</p>
                    </div>
                    <Button
                        onClick={() => setIsEditing(true)}
                        variant="text"
                        size="small"
                        className="text-gray-500">
                        ✏️
                    </Button>
                </div>
            )}
        </div>
    );
}

function UpdateGender({ currentGender }) {
    const [gender, setGender] = useState(""); // Ensure default value is an empty string
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setGender(currentGender);
    });
    const handleGender = async (e) => {
        e.preventDefault();

        if (gender === currentGender) {
            setIsEditing(false);
            return;
        }

        setError("");
        setIsSubmitting(true);
        updateProfileField(
            "gender",
            gender,
            setError,
            setIsEditing,
            setIsSubmitting
        );
    };

    return (
        <div className="space-y-4">
            {isEditing ? (
                <form onSubmit={handleGender} className="space-y-4">
                    <div>
                        <select
                            id="genderInput"
                            name="genderInput"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            disabled={isSubmitting}
                            className="border border-gray-300 rounded px-2 py-1 text-blue-800 w-full">
                            <option value="" disabled>
                                Select your gender...
                            </option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>

                        {error && (
                            <p className="mt-1 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save"}
                        </Button>

                        <Button
                            onClick={(e) => {
                                setGender(currentGender);
                                setIsEditing(false);
                                setError("");
                            }}
                            disabled={isSubmitting}>
                            Cancel
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="flex justify-between items-center">
                    <div>
                        <p className="mt-1 text-4xl text-gray-900">{gender}</p>
                    </div>
                    <Button
                        onClick={() => setIsEditing(true)}
                        variant="text"
                        size="small"
                        className="text-gray-500">
                        ✏️
                    </Button>
                </div>
            )}
        </div>
    );
}

export { UpdateBio, UpdateAge, UpdateGender };