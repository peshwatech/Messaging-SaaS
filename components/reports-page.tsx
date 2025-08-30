"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar, FileText, TrendingUp, Users, Mail } from "lucide-react"

const reportTemplates = [
  {
    id: 1,
    name: "Campaign Performance Report",
    description: "Detailed analysis of campaign metrics and engagement rates",
    type: "Campaign",
    frequency: "Weekly",
    lastGenerated: "2024-01-15",
    status: "Ready",
  },
  {
    id: 2,
    name: "Subscriber Growth Report",
    description: "Track subscriber acquisition, retention, and churn rates",
    type: "Audience",
    frequency: "Monthly",
    lastGenerated: "2024-01-01",
    status: "Ready",
  },
  {
    id: 3,
    name: "Revenue Attribution Report",
    description: "Connect email campaigns to revenue and conversion metrics",
    type: "Revenue",
    frequency: "Monthly",
    lastGenerated: "2024-01-10",
    status: "Processing",
  },
  {
    id: 4,
    name: "A/B Test Results",
    description: "Compare performance between different campaign variations",
    type: "Testing",
    frequency: "On-demand",
    lastGenerated: "2024-01-12",
    status: "Ready",
  },
  {
    id: 5,
    name: "Deliverability Report",
    description: "Monitor email delivery rates and reputation metrics",
    type: "Technical",
    frequency: "Daily",
    lastGenerated: "2024-01-16",
    status: "Ready",
  },
]

const recentReports = [
  {
    name: "Q4 2023 Campaign Summary",
    type: "Quarterly",
    generatedDate: "2024-01-02",
    size: "2.4 MB",
  },
  {
    name: "December Subscriber Report",
    type: "Monthly",
    generatedDate: "2024-01-01",
    size: "1.8 MB",
  },
  {
    name: "Holiday Campaign Analysis",
    type: "Campaign",
    generatedDate: "2023-12-28",
    size: "3.1 MB",
  },
  {
    name: "Year-End Performance Review",
    type: "Annual",
    generatedDate: "2023-12-31",
    size: "5.2 MB",
  },
]

export function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("last30days")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last90days">Last 90 Days</option>
            <option value="lastyear">Last Year</option>
          </select>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Create Custom Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Reports Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-emerald-600">+12 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg. Open Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26.8%</div>
            <p className="text-xs text-emerald-600">+2.1% vs last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11,203</div>
            <p className="text-xs text-emerald-600">+156 new</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduled Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Auto-generated</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Report Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>Generate reports from predefined templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {template.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.frequency}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Last: {new Date(template.lastGenerated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={template.status === "Ready" ? "default" : "secondary"}>{template.status}</Badge>
                    <Button variant="outline" size="sm" disabled={template.status === "Processing"}>
                      <Download className="h-3 w-3 mr-1" />
                      Generate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Download previously generated reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium">{report.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {report.type}
                      </Badge>
                      <span>Generated: {new Date(report.generatedDate).toLocaleDateString()}</span>
                      <span>Size: {report.size}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
          <CardDescription>Manage automated report generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="space-y-1">
                <h3 className="font-medium">Weekly Performance Summary</h3>
                <p className="text-sm text-muted-foreground">Every Monday at 9:00 AM</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Active</Badge>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="space-y-1">
                <h3 className="font-medium">Monthly Subscriber Report</h3>
                <p className="text-sm text-muted-foreground">First day of each month at 8:00 AM</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Active</Badge>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="space-y-1">
                <h3 className="font-medium">Quarterly Business Review</h3>
                <p className="text-sm text-muted-foreground">End of each quarter</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Paused</Badge>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
