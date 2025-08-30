"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Shield, CreditCard, Globe, Mail, Smartphone, Save, Check, X, Plus } from "lucide-react"

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corp",
    timezone: "America/New_York",
  })

  const [notifications, setNotifications] = useState({
    emailReports: true,
    campaignUpdates: true,
    systemAlerts: false,
    weeklyDigest: true,
    smsNotifications: false,
  })

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    loginAlerts: true,
  })

  const [billing, setBilling] = useState({
    plan: "Professional",
    price: 49,
    nextBilling: "2024-02-15",
    paymentMethod: "**** **** **** 4242",
    billingEmail: "john.doe@company.com",
  })

  const [integrations, setIntegrations] = useState([
    { id: 1, name: "Mailchimp", status: "connected", type: "Email Marketing" },
    { id: 2, name: "Salesforce", status: "connected", type: "CRM" },
    { id: 3, name: "Google Analytics", status: "disconnected", type: "Analytics" },
    { id: 4, name: "Slack", status: "connected", type: "Communication" },
  ])

  const navigationItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "integrations", label: "Integrations", icon: Globe },
  ]

  const renderProfileSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
        <CardDescription>Update your personal information and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <select
            id="timezone"
            value={profile.timezone}
            onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
            className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
          </select>
        </div>
      </CardContent>
    </Card>
  )

  const renderNotificationsSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>Choose how you want to be notified about updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label>Email Reports</Label>
            </div>
            <p className="text-sm text-muted-foreground">Receive daily and weekly email reports</p>
          </div>
          <Switch
            checked={notifications.emailReports}
            onCheckedChange={(checked) => setNotifications({ ...notifications, emailReports: checked })}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Campaign Updates</Label>
            <p className="text-sm text-muted-foreground">Get notified when campaigns complete</p>
          </div>
          <Switch
            checked={notifications.campaignUpdates}
            onCheckedChange={(checked) => setNotifications({ ...notifications, campaignUpdates: checked })}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>System Alerts</Label>
            <p className="text-sm text-muted-foreground">Important system notifications and maintenance</p>
          </div>
          <Switch
            checked={notifications.systemAlerts}
            onCheckedChange={(checked) => setNotifications({ ...notifications, systemAlerts: checked })}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Weekly Digest</Label>
            <p className="text-sm text-muted-foreground">Summary of your account activity</p>
          </div>
          <Switch
            checked={notifications.weeklyDigest}
            onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <Label>SMS Notifications</Label>
            </div>
            <p className="text-sm text-muted-foreground">Urgent alerts via text message</p>
          </div>
          <Switch
            checked={notifications.smsNotifications}
            onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
          />
        </div>
      </CardContent>
    </Card>
  )

  const renderSecuritySection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security & Privacy
        </CardTitle>
        <CardDescription>Manage your account security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Two-Factor Authentication</Label>
            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={security.twoFactorAuth ? "default" : "secondary"}>
              {security.twoFactorAuth ? "Enabled" : "Disabled"}
            </Badge>
            <Switch
              checked={security.twoFactorAuth}
              onCheckedChange={(checked) => setSecurity({ ...security, twoFactorAuth: checked })}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
          <select
            id="sessionTimeout"
            value={security.sessionTimeout}
            onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
            className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="480">8 hours</option>
          </select>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Login Alerts</Label>
            <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
          </div>
          <Switch
            checked={security.loginAlerts}
            onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <Button variant="outline" className="w-full bg-transparent">
            Change Password
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            Download Account Data
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderBillingSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Plan
          </CardTitle>
          <CardDescription>Manage your subscription and billing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h3 className="font-medium">{billing.plan} Plan</h3>
              <p className="text-sm text-muted-foreground">Up to 50,000 contacts • Advanced analytics</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${billing.price}</div>
              <div className="text-sm text-muted-foreground">per month</div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1 bg-transparent">
              Change Plan
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Billing History
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your payment information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div>
                <p className="font-medium">{billing.paymentMethod}</p>
                <p className="text-sm text-muted-foreground">Expires 12/2027</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingEmail">Billing Email</Label>
            <Input
              id="billingEmail"
              type="email"
              value={billing.billingEmail}
              onChange={(e) => setBilling({ ...billing, billingEmail: e.target.value })}
            />
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Next billing date:</span>
              <span className="font-medium">{billing.nextBilling}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderIntegrationsSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Integrations
        </CardTitle>
        <CardDescription>Connect your favorite tools and services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {integrations.map((integration) => (
          <div key={integration.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <Globe className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium">{integration.name}</h3>
                <p className="text-sm text-muted-foreground">{integration.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={integration.status === "connected" ? "default" : "secondary"}>
                {integration.status === "connected" ? (
                  <Check className="h-3 w-3 mr-1" />
                ) : (
                  <X className="h-3 w-3 mr-1" />
                )}
                {integration.status}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newStatus = integration.status === "connected" ? "disconnected" : "connected"
                  setIntegrations(
                    integrations.map((int) => (int.id === integration.id ? { ...int, status: newStatus } : int)),
                  )
                }}
              >
                {integration.status === "connected" ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Add New Integration
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Settings Navigation */}
        <div className="space-y-2">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === "profile" && renderProfileSection()}
          {activeTab === "notifications" && renderNotificationsSection()}
          {activeTab === "security" && renderSecuritySection()}
          {activeTab === "billing" && renderBillingSection()}
          {activeTab === "integrations" && renderIntegrationsSection()}
        </div>
      </div>
    </div>
  )
}
