import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { routes } from "@/process/technology/technology-site";
import { IconLogout, IconUserCircle, IconHome, IconUsers, IconShield, IconKey, IconSettings } from "@tabler/icons-react";
import { toast } from "sonner";
import { config } from "@/config/technology-config";

interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  token?: string | null;
  user?: User | null;
};

export function AppSidebar({ token, user, ...props }: AppSidebarProps) {
  const shownUser = {
    name: user?.name ?? "Invitado",
    email: user?.email ?? "—",
    avatar: user?.avatar ?? `${routes.base}9440461.webp`,
    token: token ?? "token_invalido"
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token")

      // Llamar al API para cerrar sesión en el backend
      await fetch(`${config.apiUrl}${config.endpoints.auth.logout}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      // Limpiar localStorage independientemente de la respuesta
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      toast.success("Sesión cerrada", {
        description: "Has cerrado sesión exitosamente",
      });

      setTimeout(() => {
        window.location.href = routes.general.login;
      }, 1000);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Even if API call fails, clear local session
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = routes.general.login;
    }
  };

  const handleGoToProfile = () => {
    window.location.href = routes.admin.profile;
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href={routes.dashboard.index} title="Dashboard" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md">
                  <span><img src="/LOGOTIPO_1024x1024.svg" alt="Logotipo Incadev" title="Logotipo Incadev"/></span>
                </div>
                <span className="text-xl font-bold">INCADEV</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href={routes.dashboard.index}>
                    <IconHome className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Gestión de Acceso</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href={routes.admin.users}>
                    <IconUsers className="h-4 w-4" />
                    <span>Usuarios</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href={routes.admin.roles}>
                    <IconShield className="h-4 w-4" />
                    <span>Roles</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href={routes.admin.permissions}>
                    <IconKey className="h-4 w-4" />
                    <span>Permisos</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 border-t space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-medium">{shownUser.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{shownUser.name}</p>
              <p className="text-xs text-muted-foreground truncate">{shownUser.email}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleGoToProfile}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
              title="Ver perfil"
            >
              <IconUserCircle className="h-4 w-4" />
              <span>Perfil</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Cerrar sesión"
            >
              <IconLogout className="h-4 w-4" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
