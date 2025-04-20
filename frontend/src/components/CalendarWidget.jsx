'use client';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Paper, Box, IconButton, Tooltip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const CalendarWidget = ({ onDateSelect, selectedDate }) => {
  const handleDateChange = (newDate) => {
    if (onDateSelect) {
      // Format the date as YYYY-MM-DD using locale methods to avoid timezone issues
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(newDate.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;
      onDateSelect(formattedDate);
    }
  };

  const handleClearDate = () => {
    if (onDateSelect) {
      onDateSelect(null);
    }
  };

  return (
    <Paper
      elevation={3}
      style={{
        width: '100%', // Ensures it takes up the full width of its container
        backgroundColor: '#ffffff', // Matches sidebar background
        color: '#111111', // Matches text color in dark mode
        height: '340px', // Adjusted height to fill the screen
        position: 'relative', // For positioning the clear button
      }}
    >
      {selectedDate && (
        <Tooltip title="Clear date selection">
          <IconButton
            size="small"
            onClick={handleClearDate}
            sx={{
              position: 'absolute',
              top: 5,
              right: 5,
              zIndex: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box>
          <DateCalendar
            value={selectedDate ? new Date(selectedDate) : null}
            onChange={handleDateChange}
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
              '& .Mui-selected': {
                backgroundColor: '#4285F4 !important', // Highlight selected date
                color: 'white !important',
              },
            }}
          />
        </Box>
      </LocalizationProvider>
    </Paper>
  );
};

export default CalendarWidget;
