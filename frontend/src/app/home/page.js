'use client';
import { useState } from 'react';
import CalendarComponent from '../../components/CalendarComponent';
import CalendarWidget from '../../components/CalendarWidget';
import Navbar from '../../components/navbar';
import TagsComponent from '../../components/tags'; // Import the new component

export default function CalendarLayout() {
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
          <TagsComponent />
        </div>

        {/* Full Calendar */}
        <div className="flex-grow">
          <CalendarComponent 
            view={calendarView} 
            onViewChange={handleViewChange} 
            key={calendarView} 
          />
        </div>
      </div>
    </div>
  );
}
