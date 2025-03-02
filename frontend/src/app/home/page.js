'use client';
import CalendarComponent from '../../../components/CalendarComponent';
import CalendarWidget from '../../../components/CalendarWidget';

export default function CalendarLayout() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1rem',
        padding: '1rem',
        height: '100vh',
        backgroundColor: '#ffffff', // Matches dark theme background
      }}
    >
      {/* Calendar Widget */}
      <div style={{ flexShrink: 0 }}>
        <CalendarWidget />
      </div>

      {/* Full Calendar */}
      <div style={{ flexGrow: 1 }}>
        <CalendarComponent />
      </div>
    </div>
  //   <div className="relative flex flex-col h-screen bg-gray-100">
  //     {/* Header */}
  //     <header className="h-16 shrink-0 bg-white border-b px-6 flex items-center justify-between shadow-sm">
  //       <h1 className="text-xl font-semibold text-gray-800">Blog Calendar</h1>
  //     </header>

  //     {/* Main Content */}
  //     <div className="flex flex-row justify-center items-center overflow-hidden relative">
  // {/* Fixed Widget on the Left */}
  //     <div
  //       className="fixed top-16 left-0 w-[250px] bg-white shadow-lg border-r p-2"
  //       style={{ height: 'calc(100vh - 4rem)' }}
  //     >
  //       <CalendarWidget />
  //     </div>

  //     {/* Main Calendar Area */}
  //     <div 
  //       className="flex-1 ml-[250px] overflow-auto bg-white p-4"
  //       style={{ width: 'calc(100vw - 250px)' }}
  //     >
  //       <CalendarComponent />
  //     </div>
  //     </div>

  //   </div>
  );
}
