'use client';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Paper, Box } from '@mui/material';

const CalendarWidget = () => {
  return (
    <Paper
      elevation={3}
      style={{
        width: '100%', // Ensures it takes up the full width of its container
        //padding: '0.5rem', // Adds padding for better spacing
        backgroundColor: '#ffffff', // Matches sidebar background
        color: '#111111', // Matches text color in dark mode
        height: '340px', // Adjusted hght to fill the screen
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box>
          <DateCalendar
            sx={{
              backgroundColor: 'transparent',
              width: '90%',
              height: '90%',
              margin: 'auto',
              fontSize: '0.875rem', // Slightly larger font size for readability
              '& .MuiPickersDay-today': {
                backgroundColor: '#1a73e8',
                color: 'white',
                borderRadius: '50%',

              },
              '& .MuiPickersDay-root:hover': {
                backgroundColor: '#e8f0fe',
              },
              '& .MuiPickersDay-root': {
                borderRadius: '50%',
                fontSize: '0.875rem', // Slightly larger font size for readability
                width: '30px', // Adjusted size for better fit
                height: '30px',
              },
              '& .MuiPickersDay-dayWithMargin': {
                margin: '2px', // Adds consistent spacing between days
              },
              '& .MuiPickersDay-dayOutsideMonth': {
                color: '#9AA0A6', // Dimmed color for days outside the current month
              },
            }}
          />
        </Box>
      </LocalizationProvider>
    </Paper>
  );
};

export default CalendarWidget;
