import { NextResponse } from 'next/server'

export function middleware(request) {

    // Get the token from cookies
    const token = request.cookies.get('accessToken')?.value
    const expiresAt = request.cookies.get('expires_at')?.value
    console.log('Token found:', token)
    console.log('Expires at:', expiresAt)

    // Define protected routes
    const protectedRoutes = ['/profile', '/home']
    const currentPath = request.nextUrl.pathname

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route =>
        currentPath.startsWith(route)
    )
    console.log('Is protected route:', isProtectedRoute)

    // Parse the expiration date (format: "2025-03-28 13:29:58.3506101 -0400 EDT")
    const isTokenExpired = () => {
        if (!expiresAt) return true
        // Extract the date part before the timezone information
        const datePart = expiresAt.split(' ')[0] + ' ' + expiresAt.split(' ')[1]
        const expirationTime = new Date(datePart).getTime()
        const currentTime = new Date().getTime()
        return currentTime >= expirationTime
    }

    // If trying to access protected route without token, redirect to login
    if (isProtectedRoute && (!token || isTokenExpired())) {
        console.log('Redirecting to login...')
        const response = NextResponse.redirect(new URL('/landing', request.url));

        // If token exists but is expired, remove it from cookies
        if (token && isTokenExpired()) {
            response.cookies.delete('accessToken');
            response.cookies.delete('expires_at');
            console.log('Expired token removed from cookies');
        }

        return response;
    }

    // Allow the request to continue
    console.log('Allowing request to continue')
    return NextResponse.next()
}

// Configure which routes should be handled by this middleware
export const config = {
    matcher: [
        '/profile',
        '/profile/:path*',
        '/home',
        '/home/:path*'
    ]
}