"use client"

import { BarChart3, CameraIcon as Campaign, Settings, Users, FileText, Home } from "lucide-react"
import { cn } from "@/components/lib/utils"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "#", icon: Home, current: false },
  { name: "Campaigns", href: "#", icon: Campaign, current: true },
  { name: "Analytics", href: "#", icon: BarChart3, current: false },
  { name: "Contacts", href: "#", icon: Users, current: false },
  { name: "Reports", href: "#", icon: FileText, current: false },
  { name: "Settings", href: "#", icon: Settings, current: false },
]

interface SidebarProps {
  currentPage?: string
  onPageChange?: (page: string) => void
}

export function Sidebar({ currentPage = "Campaigns", onPageChange }: SidebarProps) {
  const [currentItem, setCurrentItem] = useState(currentPage)

  const handleItemClick = (itemName: string) => {
    setCurrentItem(itemName)
    onPageChange?.(itemName)
  }

  return (
    <div className="flex flex-col w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
        <h2 className="text-xl font-bold text-sidebar-foreground">CampaignPro</h2>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = item.name === currentItem

          return (
            <button
              key={item.name}
              onClick={() => handleItemClick(item.name)}
              className={cn(
                "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
