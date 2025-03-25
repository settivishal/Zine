'use client'
import { Card, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useRef, useEffect } from 'react';

const AppFullCalendar = styled('div')(({ theme }) => ({
  position: 'relative',
  '& .fc': {
    padding: '0.5rem',
    backgroundColor: theme.palette.background.paper,
  },
  '& .fc-toolbar': {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    position: 'relative',
  },
  '& .fc-button': {
    backgroundColor: '#1a73e8',
    color: 'white',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: '#1558b0',
    },
  },
  '& .fc-daygrid-day': {
    border: '1px solid #e0e0e0',
  },
  '& .fc-daygrid-day-number': {
    color: '#1a73e8',
  },
  '& .fc-event': {
    backgroundColor: '#1a73e8',
    color: 'white',
    borderRadius: '4px',
    padding: '2px 4px',
    
  },
  '& .view-toggle-container': {
    position: 'absolute',
    top: '30px',
    right: '50px',
    transform: 'translateY(-50%)',
    zIndex: 10,
  },
}));

const Calendar = ({ view = 'dayGridMonth', onViewChange }) => {
  const calendarRef = useRef(null);
  const mappedView = view === 'timeGridWeek' ? 'dayGridWeek' : view;
  
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      onViewChange(newView);
    }
  };
  
  useEffect(() => {
    // Insert view toggle buttons into the header
    if (calendarRef.current) {
      const headerEl = calendarRef.current.querySelector('.fc-toolbar-chunk:nth-child(3)');
      if (headerEl) {
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'view-toggle-container';
        headerEl.appendChild(toggleContainer);
        
        // The actual buttons will be rendered by React in the component below
      }
    }
  }, []);

  return (
    <Card sx={{ height: 'calc(100vh - 4rem)', overflow: 'auto' }}>
      <AppFullCalendar className='app-calendar' ref={calendarRef}>
        <div className="view-toggle-container">
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="calendar view"
            size="small"
          >
            <ToggleButton value="dayGridMonth" aria-label="month view">
              Month
            </ToggleButton>
            <ToggleButton value="dayGridWeek" aria-label="week view">
              Week
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView={mappedView}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''
          }}
          events={[
            { title: 'Blog Post 1', date: '2025-02-20' }
          ]}
        />
      </AppFullCalendar>
    </Card>
  );
};

export default Calendar;
