'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import CalendarWidget from '../../components/CalendarWidget';
import BlogList from '../../components/BlogList';
import TagsComponent from '../../components/Tags';
import { useAuth } from '../../hooks/authcontext';

export default function Page() {
    const [tags, setTags] = useState([]);
    const { accessToken } = useAuth();
    console.log(accessToken);

    useEffect(() => {
        if (accessToken) {
            fetchTags();
        }
    }, [accessToken]);

    const fetchTags = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/tags", {
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

    const handleViewChange = (newView) => {
        setCalendarView(newView);
    };

    return (
        <div className="relative flex flex-col p-4 min-h-screen bg-white">
            {/* Navbar */}
            <Navbar Page={"profile"} />

            {/* Main Content */}
            <div
                id="home-main-content"
                className="flex flex-row gap-4 h-[calc(100vh-80px)] hide-scrollbar"
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
                    <CalendarWidget />

                    {/* Tags Component */}
                    <TagsComponent tags={tags} setTags={setTags} />
                </div>

                {/* Blog List */}
                <div className="flex-grow bg-white rounded-lg shadow-md p-4">
                    <BlogList availableTags={tags} onTagsUpdate={fetchTags} />
                </div>
            </div>
        </div>
    );
}