import { useEffect, useState } from "react";
import { AppSidebar } from "@/process/academic/components/app-sidebar"
import { ChartAreaInteractive } from "@/process/academic/dasboard/components/chart-area-interactive"
import { DataTable } from "@/process/academic/dasboard/components/data-table"
import { SectionCards } from "@/process/academic/dasboard/components/section-cards"
import { SiteHeader } from "@/process/academic/dasboard/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "@/process/academic/dasboard/data.json"

export default function DashboardICV() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
      return match ? decodeURIComponent(match[2]) : null
    }

    const authDataStr = getCookie('auth_data')
    console.log("authDataStr", authDataStr)
    if (authDataStr) {
      const authData = JSON.parse(authDataStr)
      console.log("authData", authData)
      localStorage.setItem('token', JSON.stringify(authData.token))
      localStorage.setItem('user', JSON.stringify(authData.user))
      document.cookie = "auth_data=; path=/; max-age=0"
    }

    const t = window.localStorage.getItem("token")
    const u = window.localStorage.getItem("user")
    setToken(t ?? null)
    try { setUser(u ? JSON.parse(u) : null) } catch { setUser(null) }
    setMounted(true)
  }, [])


  if (!mounted) return null;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" token={token} user={user}/>
      <SidebarInset>
        <SiteHeader title="Dashboard: Procesos Académicos"/>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
