// 'use client'

// import { useTheme } from 'next-themes'
// import { useEffect, useState } from 'react'
// import { Brightness4, Brightness7 } from '@mui/icons-material'

// export function ThemeToggle() {
//   const [mounted, setMounted] = useState(false)
//   const { theme, setTheme } = useTheme()

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   if (!mounted) {
//     return null
//   }

//   const toggleTheme = () => {
//     setTheme(theme === 'light' ? 'dark' : 'light')
//   }

//   return (
//     <Tooltip title="Toggle theme">
//       <IconButton onClick={toggleTheme} color="inherit">
//         {theme === 'light' ? <Brightness4 /> : <Brightness7 />}
//       </IconButton>
//     </Tooltip>
//   )
// }

// components/ThemeToggle.jsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IconButton, Tooltip } from '@mui/material'
// import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="inline-flex items-center justify-center p-2">
                <span className="sr-only">Toggle theme</span>
            </button>
        );
    }

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <Tooltip title="Toggle theme">
            <IconButton onClick={toggleTheme} >
                {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                ) : (
                    <Moon className="h-5 w-5" />
                )}
                {/* <DarkModeIcon className="h-5 w-5" /> */}
            </IconButton>
        </Tooltip>
    );
}
