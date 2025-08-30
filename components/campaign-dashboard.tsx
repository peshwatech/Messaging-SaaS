"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { SearchAndFilters } from "@/components/search-and-filters"
import { CampaignTable } from "@/components/campaign-table"
import { DashboardOverview } from "@/components/dashboard-overview"
import { ContactsPage } from "@/components/contacts-page"
import { AnalyticsPage } from "@/components/analytics-page"
import { ReportsPage } from "@/components/reports-page"
import { SettingsPage } from "@/components/settings-page"
import { Card } from "@/components/ui/card"

// Change 'export function CampaignDashboard()' to 'export default function CampaignDashboard()'
export default function CampaignDashboard() { // <-- MODIFIED LINE
  const [currentPage, setCurrentPage] = useState("Dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "Dashboard":
        return <DashboardOverview />
      case "Contacts":
        return <ContactsPage />
      case "Analytics":
        return <AnalyticsPage />
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
              <CampaignTable searchTerm={searchTerm} statusFilter={statusFilter} dateRange={dateRange} />
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
