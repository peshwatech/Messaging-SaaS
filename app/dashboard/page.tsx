// File Location: /app/dashboard/page.tsx
// This file is the new entry point for the /dashboard route in the App Router.

"use client"; // Add this directive for client-side hooks like useEffect and useState

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase'; // Corrected relative path
import CampaignDashboard from '../../components/campaign-dashboard'; // Corrected relative path

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // In the App Router, navigation is handled by the useRouter hook
        // For simplicity here, we'll stick with window.location
        window.location.href = '/';
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading Dashboard...</p>
      </div>
    );
  }

  return <CampaignDashboard />;
}
