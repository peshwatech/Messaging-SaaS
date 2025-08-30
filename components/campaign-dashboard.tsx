"use client"

import { useState, useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { app } from "@/lib/firebase" 
import { Sidebar } from "@/components/sidebar" 
import { SearchAndFilters } from "@/components/search-and-filters" 
import { CampaignTable } from "@/components/campaign-table" 
import { DashboardOverview } from "@/components/dashboard-overview" 
import { ContactsPage } from "@/components/contacts-page" 
import { AnalyticsPage } from "@/components/analytics-page" 
import { ReportsPage } from "@/components/reports-page" 
import { SettingsPage } from "@/components/settings-page" 
import { Card } from "@/components/ui/card" 

export default function CampaignDashboard() {
  const [currentPage, setCurrentPage] = useState("Dashboard")
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // DEBUG LOG 1: Check if the auth state change is detected
      console.log("Auth state changed. User object:", user);

      if (user) {
        try {
          const token = await user.getIdToken();
          // DEBUG LOG 2: Confirm the token is being generated
          console.log("Successfully generated auth token.");

          const response = await fetch('/api/campaigns/list', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch campaigns');
          }

          const data = await response.json();
          setCampaigns(data);
        } catch (err: any) {
          // DEBUG LOG 3: Log any errors during the fetch process
          console.error("Error fetching data inside onAuthStateChanged:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        // Handle case where user is not logged in
        console.log("User is not authenticated.");
        setLoading(false);
        setError("You are not logged in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const renderCurrentPage = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading campaign data...</p>
        </div>
      );
    }
    
    if (error) {
       return (
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error: {error}</p>
        </div>
      );
    }

    if (!loading && campaigns.length === 0 && !error) {
      // This is the "zero state" when there are no campaigns to show.
    }
    
    switch (currentPage) {
      case "Dashboard":
        return <DashboardOverview campaigns={campaigns} />
      case "Contacts":
        return <ContactsPage />
      case "Analytics":
        return <AnalyticsPage campaigns={campaigns} />
      case "Reports":
        return <ReportsPage />
      case "Settings":
        return <SettingsPage />
      case "Campaigns":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Campaign Management</h1>
            </div>
            <Card className="p-6">
              <SearchAndFilters />
            </Card>
            <Card className="p-6">
              <CampaignTable campaigns={campaigns} />
            </Card>
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Page under construction</p>
          </div>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">{renderCurrentPage()}</div>
      </main>
    </div>
  )
}

