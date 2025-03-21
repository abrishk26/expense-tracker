import { NextRequest, NextResponse } from 'next/server'
// import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers'
 
// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']
 
export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
 
  // 3. Decrypt the session from the cookie
  const supabaseSession = (await cookies()).get('supabase_session')?.value
//   const cookie = 
//   const session = await decrypt(cookie)
 
  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !supabaseSession) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
 
  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    supabaseSession &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }
 
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export async function middleware(request: NextRequest) {
//   // Get the `supabase_session` cookie
//   const supabaseSession = request.cookies.get('supabase_session')?.value;

//   // Define protected routes
//   const protectedRoutes = ['/dashboard']; // Add more routes if needed

//   // Get the current path
//   const currentPath = request.nextUrl.pathname;

//   // Check if the user is trying to access a protected route
//   if (protectedRoutes.includes(currentPath)) {
//     // Redirect to / if the `supabase_session` cookie does not exist
//     if (!supabaseSession) {
//       return NextResponse.redirect(new URL('/', request.url));
//     }
//   }

//   // Allow the request to proceed if no redirection is needed
//   return NextResponse.next();
// }

// // Specify the routes to run the middleware on
// export const config = {
//   matcher: [
//     '/dashboard', // Protect the dashboard route
//     // Add more routes as needed
//   ],
// };