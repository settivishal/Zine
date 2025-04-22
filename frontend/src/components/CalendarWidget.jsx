'use client';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Paper, Box, IconButton, Tooltip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { parseISO } from 'date-fns';

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

  // Check if today's date is the selected date
  const isTodaySelected = () => {
    if (!selectedDate) return false;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${year}-${month}-${day}`;

    return formattedToday === selectedDate;
  };

  return (
    <Paper
      elevation={3}
      className="w-full bg-primary-light dark:bg-primary-dark text-gray-900 h-[340px] relative"
    >
      {selectedDate && (
        <Tooltip title="Clear date selection">
          <IconButton
            size="small"
            onClick={handleClearDate}
            // sx={{
            //   position: 'absolute',
            //   top: 5,
            //   right: 5,
            //   zIndex: 10,
            //   backgroundColor: 'rgba(0, 0, 0, 0.05)',
            //   '&:hover': {
            //     backgroundColor: 'rgba(0, 0, 0, 0.1)',
            //   },
            // }}
            className="absolute top-1 right-1 z-10 bg-black/5 hover:bg-black/10"
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box >
          <DateCalendar
            value={selectedDate ? parseISO(selectedDate) : null}
            onChange={handleDateChange}
            disableHighlightToday={selectedDate && !isTodaySelected()}
            className = "bg-primary-light dark:bg-primary-dark w-[90%] h-[90%] mx-auto text-sm"
            // sx={{
            //   backgroundColor: 'transparent',
            //   width: '90%',
            //   height: '90%',
            //   margin: 'auto',
            //   fontSize: '0.875rem', // Slightly larger font size for readability
            //   '& .MuiPickersDay-today': {
            //     // Only apply special styling to today if it's not the selected date
            //     backgroundColor: selectedDate && !isTodaySelected() ? 'transparent' : '#1a73e8',
            //     color: selectedDate && !isTodaySelected() ? 'inherit' : 'white',
            //     borderRadius: '50%',
            //     border: selectedDate && !isTodaySelected() ? '1px solid #1a73e8' : 'none',
            //   },
            //   '& .MuiPickersDay-root:hover': {
            //     backgroundColor: '#e8f0fe',
            //   },
            //   '& .MuiPickersDay-root': {
            //     borderRadius: '50%',
            //     fontSize: '0.875rem', // Slightly larger font size for readability
            //     width: '30px', // Adjusted size for better fit
            //     height: '30px',
            //   },
            //   '& .MuiPickersDay-dayWithMargin': {
            //     margin: '2px', // Adds consistent spacing between days
            //   },
            //   '& .MuiPickersDay-dayOutsideMonth': {
            //     color: '#9AA0A6', // Dimmed color for days outside the current month
            //   },
            //   '& .Mui-selected': {
            //     backgroundColor: '#4285F4 !important', // Highlight selected date
            //     color: 'white !important',
            //   },
            // }}
          />
        </Box>
      </LocalizationProvider>
    </Paper>
  );
};

export default CalendarWidget;
