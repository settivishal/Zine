'use client'
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const AppFullCalendar = styled('div')(({ theme }) => ({
  '& .fc': {
    padding: '0.5rem', // Adjusted padding
    backgroundColor: theme.palette.background.paper,
  },
  '& .fc-toolbar': {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem', // Adjusted margin
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
}));

const CalendarComponent = () => {
  return (
    <Card sx={{ height: 'calc(100vh - 4rem)', overflow: 'auto' }}> {/* Adjusted height and overflow */}
      <AppFullCalendar className='app-calendar'>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={[
            { title: 'Blog Post 1', date: '2025-02-20' }
          ]}
        />
      </AppFullCalendar>
    </Card>
  );
};

export default CalendarComponent;