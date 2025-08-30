"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Mail, TrendingUp, Calendar, CheckCircle } from "lucide-react"

const stats = [
  {
    title: "Total Campaigns",
    value: "24",
    change: "+12%",
    changeType: "positive" as const,
    icon: Mail,
  },
  {
    title: "Active Contacts",
    value: "12,847",
    change: "+8%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Open Rate",
    value: "24.3%",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    title: "Completed",
    value: "18",
    change: "+5",
    changeType: "positive" as const,
    icon: CheckCircle,
  },
]

const recentCampaigns = [
  { name: "Summer Sale 2024", status: "Sent", contacts: 2847, date: "2024-01-15" },
  { name: "Product Launch", status: "In Progress", contacts: 1523, date: "2024-01-14" },
  { name: "Newsletter #47", status: "Sent", contacts: 5621, date: "2024-01-13" },
  { name: "Welcome Series", status: "Sent", contacts: 892, date: "2024-01-12" },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-emerald-600">{stat.change} from last month</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Your latest campaign activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCampaigns.map((campaign, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground">{campaign.contacts.toLocaleString()} contacts</p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === "Sent" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {campaign.status}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(campaign.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Delivery Rate</span>
                <span className="text-sm font-medium">98.2%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "98.2%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Click Rate</span>
                <span className="text-sm font-medium">12.7%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "12.7%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Unsubscribe Rate</span>
                <span className="text-sm font-medium">0.8%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: "0.8%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
