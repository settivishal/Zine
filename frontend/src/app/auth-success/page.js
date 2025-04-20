'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Suspense } from 'react';

export default function AuthSuccess() {
    return(
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <AuthSuccessComponent />
            </Suspense>
        </div>
    )
}

function AuthSuccessComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    

    useEffect(() => {
        const status = searchParams.get('status');

        if (status === 'success') {
            // Extract tokens and user info from URL
            const accessToken = searchParams.get('access_token');
            const refreshToken = searchParams.get('refresh_token');
            const expiresAt = searchParams.get('expires_at');
            const name = searchParams.get('name');
            const email = searchParams.get('email');

            // Store tokens in secure cookies
            document.cookie = `accessToken=${accessToken}; path=/; secure; samesite=strict`;
            document.cookie = `refreshToken=${refreshToken}; path=/; secure; samesite=strict`;
            document.cookie = `expires_at=${expiresAt}; path=/; secure; samesite=strict`;

            // Store user info in localStorage (since it's less sensitive)
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);

            // Redirect to home page
            router.push('/home');
        } else {
            // Handle error case
            const errorMessage = searchParams.get('error_message');
            console.error('Authentication failed:', errorMessage);
            router.push('/login?error=' + encodeURIComponent(errorMessage));
        }
    }, [searchParams, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-semibold mb-4">Processing authentication...</h1>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        </div>
    );
}