"use client";

// import { access } from "fs";
import axios from 'axios';
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/authcontext";


export default function ActivityGrid() {
    const [monthGrids, setMonthGrids] = useState([]);
    const [activityData, setActivityData] = useState([]);
    const { accessToken } = useAuth(); // Assuming you have a way to get the access token
    const [error, setError] = useState("");

    const fetchGridData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/profile/grid", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });


            setActivityData(response.data.grid.Dates); // Set the activity data
            processActivityData(response.data.grid.Dates); // Process the data to create month grids
        } catch (error) {
            console.error("Error fetching grid data:", error);
        }
    };

    useEffect(() => {
        if(accessToken) {
            fetchGridData(); // Fetch grid data when the component mounts
        }
    }, [accessToken]); // Dependency on accessToken to refetch if it changes
    
    
    const processActivityData = (dates) => {

        const dateSet = new Set(dates);
        
        // Get current date to determine year range
        const today = new Date();
        const currentMonth = today.getMonth();
        
        // Create month grids for the past 12 months
        const grids = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Start from 11 months ago
        for (let i = 11; i >= 0; i--) {
            let monthIndex = (currentMonth - i + 12) % 12;
            let year = today.getFullYear();
            if (monthIndex > currentMonth) {
                year--;
            }
            
            // Create grid for this month
            const monthData = createMonthGrid(year, monthIndex);

            monthData.forEach((day) => {
                if (day && dateSet.has(day.date)) {
                    day.isActive = true;
                }
            });
    
            grids.push({
                name: monthNames[monthIndex],
                grid: monthData,
            });
            
        }
        
        setMonthGrids(grids);
    };

    const createMonthGrid = (year, month) => {
        const grid = [];
    
        // Get first day of the month and last day of the month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
    
        // Get day of the week for the first day (0 = Sunday, 6 = Saturday)
        const firstDayOfWeek = firstDay.getDay();
    
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfWeek; i++) {
            grid.push(null);
        }
    
        // Add cells for each day of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split("T")[0];
    
            // Initially, no `isActive` is assigned
            grid.push({
                date: dateStr,
                isActive: false, // Default to false
            });
        }
    
        return grid;
    };
    
    // Function to determine cell color based on activity count
    const getCellColor = (isActive)=> {
        if (isActive) return "bg-green-700";
        return "bg-gray-200"; // Default color for inactive days
    };
    
    // Calculate total active days
    const totalActiveDays = activityData ? activityData.length : 0;
    //   activityData.filter(item => item.count > 0).length : 0;
    
    
    return (
        <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center justify-between mb-6">
                {/* <h2 className="text-xl font-semibold">
                    <span className="text-white">{totalSubmissions}</span> 
                    <span className="text-gray-400"> submissions in the past one year </span>
                    <span className="text-gray-400 text-sm ml-1 cursor-help">ⓘ</span>
                </h2> */}
                <div className="flex gap-2 space-x-6">
                    <div className="flex items-center">
                        <span className="text-gray-400 mr-2">Total active days:</span>
                        <span className="text-black">{totalActiveDays}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-400 mr-2">Max streak:</span>
                        <span className="text-black">2</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-400 mr-2">Current</span>
                        <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
            
            <div className="flex space-x-4 overflow-x-auto pb-4">
                {monthGrids.map((month, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="grid grid-cols-7 gap-1">
                            {month.grid.map((day, dayIndex) => (
                                <div
                                    key={dayIndex}
                                    className={`w-3 h-3 rounded-sm ${getCellColor(day?.isActive)}`}
                                    title={day ? `${day.date}: ${day.isActive} submissions` : ''}
                                ></div>
                            ))}   
                        </div>
                        <div className="text-gray-400 text-xs mt-2 text-center">{month.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}