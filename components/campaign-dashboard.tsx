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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

export default function CampaignDashboard() {
  const [currentPage, setCurrentPage] = useState("Dashboard")
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })

  const [templateName, setTemplateName] = useState("")
  const [contactNumbers, setContactNumbers] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [sendSuccess, setSendSuccess] = useState<string | null>(null)

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

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendError(null);
    setSendSuccess(null);
    
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated.");
      }
      const token = await user.getIdToken();

      const numbersArray = contactNumbers.split('\n').map(num => num.trim()).filter(num => num.length > 0);
      
      const response = await fetch('/api/campaigns/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          templateName,
          contactNumbers: numbersArray,
        }),
      });

      if (!response.ok) {
        // Handle non-JSON error responses from the server
        if (response.headers.get('content-type')?.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to send campaign.');
        } else {
          const errorText = await response.text();
          throw new Error(`Server responded with an error: ${response.status} ${response.statusText}. Response body: ${errorText}`);
        }
      }
      
      // Attempt to parse JSON. Some successful responses may not return JSON.
      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        console.log("Received a non-JSON success response, proceeding.");
      }
      
      setSendSuccess(data.message || 'Campaign sent successfully!');
      setTemplateName("");
      setContactNumbers("");
    } catch (err: any) {
      console.error("Error sending campaign:", err);
      setSendError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSending(false);
    }
  };

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
              <Button size="sm" onClick={() => setCurrentPage("CreateCampaign")}>
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>
            <Card className="p-6">
              <SearchAndFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </Card>
            <Card className="p-6">
              <CampaignTable
                campaigns={campaigns}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                dateRange={dateRange}
              />
            </Card>
          </div>
        )
      case "CreateCampaign":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Create a New Campaign</h1>
            <Card>
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>Use an existing template to send a personalized message to your contacts.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSendCampaign}>
                  <div className="space-y-2">
                    <Label htmlFor="templateName">Template Name</Label>
                    <Input
                      id="templateName"
                      placeholder="e.g., hello_world"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumbers">Contact Phone Numbers (one per line)</Label>
                    <Textarea
                      id="contactNumbers"
                      placeholder="e.g., 15551234567"
                      value={contactNumbers}
                      onChange={(e) => setContactNumbers(e.target.value)}
                      rows={5}
                      required
                    />
                  </div>
                  {sendError && <p className="text-sm text-red-500">{sendError}</p>}
                  {sendSuccess && <p className="text-sm text-green-500">{sendSuccess}</p>}
                  <Button type="submit" className="w-full" disabled={isSending}>
                    {isSending ? "Sending..." : "Send Campaign"}
                  </Button>
                </form>
              </CardContent>
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
