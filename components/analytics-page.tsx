"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Mail, Users, MousePointer, Eye, Download } from "lucide-react"
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
} from "recharts"

interface Campaign {
  contactCount: number;
  stats?: {
    delivered: number;
    read: number;
  };
  createdAt: string;
  templateName: string;
}

// This component now accepts campaigns as a prop
export function AnalyticsPage({ campaigns = [] }: { campaigns: Campaign[] }) {
  const [timeRange, setTimeRange] = useState("6months")

  // useMemo will re-calculate the data only when the 'campaigns' prop changes.
  // This is much more efficient than re-calculating on every render.
  const { analyticsStats, performanceData, topCampaigns } = useMemo(() => {
    if (!campaigns || campaigns.length === 0) {
      // Return default empty state if there's no data
      return { analyticsStats: [], performanceData: [], topCampaigns: [] };
    }

    // 1. Calculate Key Metrics
    const totalSent = campaigns.reduce((acc, c) => acc + c.contactCount, 0);
    const totalDelivered = campaigns.reduce((acc, c) => acc + (c.stats?.delivered || 0), 0);
    const totalRead = campaigns.reduce((acc, c) => acc + (c.stats?.read || 0), 0);
    
    const avgOpenRate = totalSent > 0 ? ((totalRead / totalSent) * 100).toFixed(1) : "0.0";
    const avgClickRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : "0.0"; // Note: Click rate isn't tracked yet, using delivered as a placeholder

    const calculatedStats = [
      { title: "Total Messages Sent", value: totalSent.toLocaleString(), icon: Mail },
      { title: "Average Open Rate", value: `${avgOpenRate}%`, icon: Eye },
      { title: "Average Delivery Rate", value: `${avgClickRate}%`, icon: MousePointer },
      { title: "Total Campaigns", value: campaigns.length, icon: Users },
    ];

    // 2. Calculate Performance Trends (Group by Month)
    const monthlyData = campaigns.reduce((acc, campaign) => {
      const month = new Date(campaign.createdAt).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { month, sent: 0, delivered: 0, read: 0 };
      }
      acc[month].sent += campaign.contactCount;
      acc[month].delivered += campaign.stats?.delivered || 0;
      acc[month].read += campaign.stats?.read || 0;
      return acc;
    }, {});
    const perfData = Object.values(monthlyData).reverse(); // Show most recent months first

    // 3. Calculate Top Performing Campaigns
    const topData = [...campaigns]
      .sort((a, b) => {
        const rateA = a.contactCount > 0 ? (a.stats?.read || 0) / a.contactCount : 0;
        const rateB = b.contactCount > 0 ? (b.stats?.read || 0) / b.contactCount : 0;
        return rateB - rateA;
      })
      .slice(0, 5)
      .map(c => ({
        name: c.templateName,
        sent: c.contactCount,
        opened: c.stats?.read || 0,
        clicked: c.stats?.delivered || 0, // Placeholder
        rate: c.contactCount > 0 ? `${((c.stats?.read || 0) / c.contactCount * 100).toFixed(1)}%` : '0.0%'
      }));

    return { analyticsStats: calculatedStats, performanceData: perfData, topCampaigns: topData };

  }, [campaigns]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
        {/* This UI part remains the same */}
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
                {/* Change indicator can be added later based on comparing time periods */}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Performance Charts */}
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
              <Line type="monotone" dataKey="delivered" stroke="#06b6d4" strokeWidth={2} name="Delivered" />
              <Line type="monotone" dataKey="read" stroke="#10b981" strokeWidth={2} name="Read" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Engagement Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Engagement</CardTitle>
          <CardDescription>Delivered vs. Read messages by month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="delivered" fill="#06b6d4" name="Delivered" />
              <Bar dataKey="read" fill="#10b981" name="Read" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performing Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Campaigns</CardTitle>
          <CardDescription>Best campaigns by open rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCampaigns.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium">{campaign.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{campaign.sent.toLocaleString()} sent</span>
                    <span>{campaign.opened.toLocaleString()} read</span>
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
