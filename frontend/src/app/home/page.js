'use client';
import { useState } from 'react';
import CalendarComponent from '../../../components/CalendarComponent';
import CalendarWidget from '../../../components/CalendarWidget';

export default function CalendarLayout() {
  const [calendarView, setCalendarView] = useState('dayGridMonth'); // Default view is month

  const handleViewChange = (newView) => {
    setCalendarView(newView);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1rem',
        padding: '1rem',
        height: '100vh',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Calendar Widget */}
      <div style={{ flexShrink: 0 }}>
        <CalendarWidget />
      </div>

      {/* Full Calendar */}
      <div style={{ flexGrow: 1 }}>
        <CalendarComponent 
          view={calendarView} 
          onViewChange={handleViewChange} 
          key={calendarView} 
        />
      </div>
    </div>
  );
}
