import React, { useEffect, useState } from "react";
import axios from "axios";

import { useAuth } from "../hooks/authcontext";

import { Button, TextField, Tabs, Tab, Chip, Dialog, DialogTitle, DialogContent } from "@mui/material";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const PublishBlog = ({ blog_data }) => {
    const [isEditing, setIsEditing] = useState(false); // Controls the modal state
    const [tab, setTab] = useState(0); // 0 for Public, 1 for Private
    const [emails, setEmails] = useState([]); // Initialize with existing emails from blog_data
    const [newEmail, setNewEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // Tracks submission state
    const { accessToken } = useAuth();
    const [newEmails, setNewEmails]  = useState([]);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };


    const handleAddEmail = () => {
        // console.log("fucking new email: ", newEmail);
        if (newEmail.trim() && !emails.includes(newEmail.trim())) {
            setEmails([...emails, newEmail.trim()]);
            // console.log("fucking emails: ", emails);
            setNewEmails([...newEmails, newEmail.trim()]);
            // console.log("fucking new Emails bitch: ", newEmails);
            setNewEmail("");
        } else {
            alert("Email already exists or is empty!");
        }
    };

    const handleDeleteEmail = (emailToDelete) => {  
        setEmails(emails.filter((email) => email !== emailToDelete));
    };

    const publishBlog = async (e) => {
        // const newEmails = emails.filter((email) => !blog_data?.Users?.includes(email)
        e.preventDefault();
        // console.log(newEmails)
        const payload = {
            blog_id: blog_data?.ID,
            is_public: tab === 0, // true for Public, false for Private
            users: tab === 1 ? newEmails : [], // Send emails only for Private
        };

        // console.log("Publishing blog with payload:", payload);

        try {
            
            const response = await axios.post(
                `${API_BASE_URL}/api/blog/change-visibility`,
                payload,
                {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            // console.log("Blog visibility updated:", response.data);

            // Show a success message
            alert("Blog visibility updated successfully!");

            // Close the modal after successful submission
            setNewEmails([]); // Reset newEmails state
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating blog visibility:", error);

            // Show an error message
            alert("Failed to update blog visibility. Please try again.");
        } finally {
            setIsSubmitting(false); // End submission
        }
    };

    useEffect(() => {
        if (blog_data?.Users && accessToken) {
            setEmails(blog_data?.Users); // Set initial emails from blog_data
        }
    } , [blog_data?.Users, accessToken]); // Dependency on isSubmitting to trigger publishBlog

    return (
        <div>
            <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
                Publish Blog
            </Button>

            <Dialog open={isEditing} onClose={() => setIsEditing(false)} fullWidth maxWidth="sm">
                <DialogTitle>Publish Blog</DialogTitle>
                <DialogContent>
                    {isEditing && ( 
                        <form
                            onSubmit={publishBlog}
                            className="space-y-4"
                        >
                            <Tabs value={tab} onChange={handleTabChange} centered>
                                <Tab label="Public" />
                                <Tab label="Private" />
                            </Tabs>

                            {tab === 1 && (
                                <div className="mt-4">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {emails.map((email, index) => (
                                            <Chip
                                                key={index}
                                                label={email}
                                                color="primary"
                                                onDelete={() => handleDeleteEmail(email)}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <TextField
                                            label="Add Email"
                                            variant="outlined"
                                            size="small"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            fullWidth
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleAddEmail}
                                            disabled={!newEmail.trim()}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {tab === 0 && (
                                <p className="mt-4 text-gray-600">
                                    This blog will be visible to everyone.
                                </p>
                            )}

                            <div className="flex gap-2 mt-4">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Publishing..." : "Publish"}
                                </Button>
                                <Button
                                    onClick={() => setIsEditing(false)}
                                    variant="outlined"
                                    color="secondary"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PublishBlog;