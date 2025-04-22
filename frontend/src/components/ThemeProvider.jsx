// app/ThemeProvider.js (updated)
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeProvider({ children, ...props }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div style={{ visibility: "hidden" }}>{children}</div>;
    }
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            // enableSystem
            // disableTransitionOnChange
            {...props}>
            {children}
        </NextThemesProvider>
    );
}
