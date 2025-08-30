"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Mail, Users, MousePointer, Eye, Download } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const performanceData = [
  { month: "Jan", sent: 12400, opened: 3200, clicked: 890, unsubscribed: 45 },
  { month: "Feb", sent: 15600, opened: 4100, clicked: 1200, unsubscribed: 52 },
  { month: "Mar", sent: 18200, opened: 4800, clicked: 1450, unsubscribed: 38 },
  { month: "Apr", sent: 16800, opened: 4200, clicked: 1180, unsubscribed: 41 },
  { month: "May", sent: 19500, opened: 5200, clicked: 1680, unsubscribed: 35 },
  { month: "Jun", sent: 21300, opened: 5800, clicked: 1920, unsubscribed: 48 },
]

const campaignTypeData = [
  { name: "Newsletter", value: 45, color: "#8b5cf6" },
  { name: "Promotional", value: 30, color: "#06b6d4" },
  { name: "Welcome Series", value: 15, color: "#10b981" },
  { name: "Product Updates", value: 10, color: "#f59e0b" },
]

const topCampaigns = [
  { name: "Summer Sale 2024", sent: 5200, opened: 1456, clicked: 423, rate: "28.0%" },
  { name: "Product Launch", sent: 3800, opened: 1102, clicked: 287, rate: "29.0%" },
  { name: "Newsletter #47", sent: 6100, opened: 1525, clicked: 398, rate: "25.0%" },
  { name: "Welcome Series", sent: 2400, opened: 720, clicked: 216, rate: "30.0%" },
  { name: "Holiday Special", sent: 4500, opened: 1215, clicked: 364, rate: "27.0%" },
]

const analyticsStats = [
  {
    title: "Total Emails Sent",
    value: "104,800",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Mail,
  },
  {
    title: "Average Open Rate",
    value: "26.8%",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: Eye,
  },
  {
    title: "Average Click Rate",
    value: "8.2%",
    change: "+0.8%",
    changeType: "positive" as const,
    icon: MousePointer,
  },
  {
    title: "Subscriber Growth",
    value: "+1,247",
    change: "+18.3%",
    changeType: "positive" as const,
    icon: Users,
  },
]

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs">
                  {stat.changeType === "positive" ? (
                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={stat.changeType === "positive" ? "text-emerald-600" : "text-red-600"}>
                    {stat.change} from last period
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Performance Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Email Performance Trends</CardTitle>
            <CardDescription>Monthly email metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sent" stroke="#8b5cf6" strokeWidth={2} name="Sent" />
                <Line type="monotone" dataKey="opened" stroke="#06b6d4" strokeWidth={2} name="Opened" />
                <Line type="monotone" dataKey="clicked" stroke="#10b981" strokeWidth={2} name="Clicked" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Types Distribution</CardTitle>
            <CardDescription>Breakdown by campaign category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={campaignTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {campaignTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {campaignTypeData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Engagement Rates</CardTitle>
          <CardDescription>Open and click rates by month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="opened" fill="#06b6d4" name="Opened" />
              <Bar dataKey="clicked" fill="#10b981" name="Clicked" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performing Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Campaigns</CardTitle>
          <CardDescription>Best campaigns by engagement rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCampaigns.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium">{campaign.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{campaign.sent.toLocaleString()} sent</span>
                    <span>{campaign.opened.toLocaleString()} opened</span>
                    <span>{campaign.clicked.toLocaleString()} clicked</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-sm font-medium">
                    {campaign.rate} open rate
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
