'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import CalendarWidget from '../../components/CalendarWidget';
import BlogList from '../../components/BlogList';
import TagsComponent from '../../components/Tags';
import { useAuth } from '../../hooks/authcontext';
import Footer from '../../components/Footer';

// Get the API base URL from the environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
    const [tags, setTags] = useState([]);
    const { accessToken } = useAuth();
    const [selectedDate, setSelectedDate] = useState(null);

    console.log(accessToken);

    useEffect(() => {
        if (accessToken) {
            fetchTags();
        }
    }, [accessToken]);

    const fetchTags = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tags`, {
                method: "GET",
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (response.ok) {
                const data = await response.json();
                setTags(data);
            } else {
                console.error("Failed to fetch tags");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const handleViewChange = (newView) => {
        setCalendarView(newView);
    };

    return (
        <div className="bg-white dark:bg-gray-900 relative flex flex-col p-4 min-h-screen">
            {/* Navbar */}
            <Navbar Page={"profile"} />

            {/* Main Content */}
            <div
                id="home-main-content"
                className=" flex flex-row gap-4 h-[calc(100vh-80px)] hide-scrollbar"
                style={{
                    overflow: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                <style jsx global>{`
                    /* Hide scrollbar for Chrome, Safari and Opera */
                    #home-main-content::-webkit-scrollbar,
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none !important;
                    }
                    
                    /* Hide scrollbar for IE, Edge and Firefox */
                    #home-main-content,
                    .hide-scrollbar {
                        -ms-overflow-style: none !important;  /* IE and Edge */
                        scrollbar-width: none !important;  /* Firefox */
                    }
                `}</style>

                {/* Sidebar */}
                <div className="flex-shrink-0 space-y-4">
                    {/* Calendar Widget */}
                    <CalendarWidget
                        onDateSelect={handleDateSelect}
                        selectedDate={selectedDate}
                    />

                    {/* Tags Component */}
                    <TagsComponent tags={tags} setTags={setTags} />
                </div>

                {/* Blog List */}
                <div className="flex-grow bg-primary-light dark:bg-primary-dark rounded-lg shadow-md p-4">
                    <BlogList
                        availableTags={tags}
                        onTagsUpdate={fetchTags}
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}