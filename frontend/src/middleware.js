import { NextResponse } from 'next/server'

export function middleware(request) {

    // Get the token from cookies
    const token = request.cookies.get('accessToken')?.value
    console.log('Token found:', token)

    // Define protected routes
    const protectedRoutes = ['/profile', '/home']
    const currentPath = request.nextUrl.pathname

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route =>
        currentPath.startsWith(route)
    )
    console.log('Is protected route:', isProtectedRoute)

    // If trying to access protected route without token, redirect to login
    if (isProtectedRoute && !token) {
        console.log('Redirecting to login...')
        return NextResponse.redirect(new URL('/landing', request.url))
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
