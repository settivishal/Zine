'use client';
import { useState } from 'react';
import Navbar from '../../components/navbar';
import CalendarWidget from '../../components/CalendarWidget';
import BlogList from '../../components/CalendarComponent';
// import TagsComponent from '../../components/tags'; // Import the new component

export default function Page() {
    const [calendarView, setCalendarView] = useState('dayGridMonth');

    const handleViewChange = (newView) => {
        setCalendarView(newView);
    };

    return (
        <div className="relative flex flex-col p-4 min-h-screen bg-white">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="flex flex-row gap-4 h-[calc(100vh-80px)] overflow-y-auto">
                {/* Sidebar */}
                <div className="flex-shrink-0 space-y-4">
                    {/* Calendar Widget */}
                    <CalendarWidget />

                    {/* Tags Component */}
                    {/* <TagsComponent /> */}
                </div>

                {/* Blog List */}
                <div className="flex-grow bg-white rounded-lg shadow-md p-4">
                    <BlogList />
                </div>
            </div>
        </div>
    );
}
