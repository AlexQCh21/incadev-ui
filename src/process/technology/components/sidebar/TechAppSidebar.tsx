"use client"

import * as React from "react"
import {
  Shield,
  Users,
  LifeBuoy,
  Server,
  AlertTriangle,
  BarChart,
  Code,
  Settings,
} from "lucide-react"

import { NavMain } from "./NavMain"
import { NavUser } from "./NavUser"
import { TeamSwitcher } from "./TeamSwitcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Obtener datos del usuario del localStorage
const getUserData = () => {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("user")
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

// Configuración de navegación por rol
const getNavigationByRole = (role: string) => {
  const baseNavigation = {
    admin: [
      {
        title: "Administración",
        url: "#",
        icon: Shield,
        isActive: true,
        items: [
          {
            title: "Usuarios",
            url: "/tecnologico/admin/users",
          },
          {
            title: "Roles",
            url: "/tecnologico/admin/roles",
          },
          {
            title: "Permisos",
            url: "/tecnologico/admin/permissions",
          },
        ],
      },
      {
        title: "Configuración",
        url: "#",
        icon: Settings,
        items: [
          {
            title: "General",
            url: "/tecnologico/admin/settings",
          },
          {
            title: "Perfil",
            url: "/tecnologico/admin/perfil",
          },
        ],
      },
    ],
    support: [
      {
        title: "Soporte",
        url: "#",
        icon: LifeBuoy,
        isActive: true,
        items: [
          {
            title: "Tickets",
            url: "/tecnologico/support/tickets",
          },
        ],
      },
      {
        title: "Configuración",
        url: "#",
        icon: Settings,
        items: [
          {
            title: "Perfil",
            url: "/tecnologico/support/perfil",
          },
        ],
      },
    ],
    infrastructure: [
      {
        title: "Infraestructura",
        url: "#",
        icon: Server,
        isActive: true,
        items: [
          {
            title: "Servidores",
            url: "/tecnologico/infrastructure/servidores",
          },
        ],
      },
      {
        title: "Configuración",
        url: "#",
        icon: Settings,
        items: [
          {
            title: "Perfil",
            url: "/tecnologico/infrastructure/perfil",
          },
        ],
      },
    ],
    security: [
      {
        title: "Seguridad",
        url: "#",
        icon: AlertTriangle,
        isActive: true,
        items: [
          {
            title: "Incidentes",
            url: "/tecnologico/security/incidentes",
          },
        ],
      },
      {
        title: "Configuración",
        url: "#",
        icon: Settings,
        items: [
          {
            title: "Perfil",
            url: "/tecnologico/security/perfil",
          },
        ],
      },
    ],
    academic_analyst: [
      {
        title: "Análisis Académico",
        url: "#",
        icon: BarChart,
        isActive: true,
        items: [
          {
            title: "Reportes",
            url: "/tecnologico/academic_analyst/reportes",
          },
        ],
      },
      {
        title: "Configuración",
        url: "#",
        icon: Settings,
        items: [
          {
            title: "Perfil",
            url: "/tecnologico/academic_analyst/perfil",
          },
        ],
      },
    ],
    web: [
      {
        title: "Desarrollo Web",
        url: "#",
        icon: Code,
        isActive: true,
        items: [
          {
            title: "Proyectos",
            url: "/tecnologico/web/proyectos",
          },
        ],
      },
      {
        title: "Configuración",
        url: "#",
        icon: Settings,
        items: [
          {
            title: "Perfil",
            url: "/tecnologico/web/perfil",
          },
        ],
      },
    ],
  }

  return baseNavigation[role as keyof typeof baseNavigation] || baseNavigation.admin
}

const data = {
  teams: [
    {
      name: "INCADEV Tecnológico",
      logo: Shield,
      plan: "Sistema de Gestión",
    },
  ],
}

export function TechAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = React.useState<any>(null)
  const [navigation, setNavigation] = React.useState<any[]>([])

  React.useEffect(() => {
    const user = getUserData()
    setUserData(user)
    if (user?.role) {
      setNavigation(getNavigationByRole(user.role))
    }
  }, [])

  const user = userData
    ? {
        name: userData.name || "Usuario",
        email: userData.email || "usuario@incadev.com",
        avatar: "/avatars/default.jpg",
      }
    : {
        name: "Usuario",
        email: "usuario@incadev.com",
        avatar: "/avatars/default.jpg",
      }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
