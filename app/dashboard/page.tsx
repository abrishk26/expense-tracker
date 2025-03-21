"use client";
import DashboardContent from '@/components/DashboardContents'; // Adjust path

export default function DashboardPage() {
  return <DashboardContent />;
}

// app/dashboard/page.tsx
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// import DashboardContent  from "@/components/DashboardContents" // Adjust path
// import Sidebar from '@/components/Sidebar';

// /**
//  * Checks if the user is authorized by verifying the existence of a valid token.
//  * @returns {boolean} True if the token exists, false otherwise.
//  */
// async function checkAuthorization() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('supabase_session')?.value; // Get token from cookie

//   // If the token exists, the user is authorized
//   return !!token;
// }

// export default async function DashboardPage() {
//   const isAuthorized = await checkAuthorization();

//   // Redirect if unauthorized
//   if (!isAuthorized) {
//     redirect('/'); // Redirect to unauthorized page or login page
//   }

//   // Render the dashboard content if authorized
//   return <DashboardContent />;
// }