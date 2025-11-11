import type { LucideIcon } from "lucide-react"
import {
  IconDatabase,
  IconReport,
  IconHelp,
  IconSearch,
  IconSettings,
  IconUsers,
  IconShieldLock,
  IconKey,
  type Icon
} from "@tabler/icons-react"

export const routes = {
  base: "/tecnologico/",
  general: {
    login: "/tecnologico/login",
  },
  dashboard: {
    index: "/tecnologico/admin/dashboard",
  },
  admin: {
    users: "/tecnologico/admin/usuarios",
    roles: "/tecnologico/admin/roles",
    permissions: "/tecnologico/admin/permisos",
    profile: "/tecnologico/admin/perfil",
  }
};

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
    adminOnly?: boolean;
  }[];
  adminOnly?: boolean;
}

export interface NavSimpleItem {
  title: string;
  url: string;
  icon: Icon;
  adminOnly?: boolean;
  type?: 'link' | 'search';
}

export const siteConfig = {
  name: "PROCESOS TECNOLÓGICOS - ADMINISTRACIÓN",
  description: "Sistema de gestión de procesos tecnológicos para la Universidad Nacional del Santa",
};

export const navMainCollapse: NavItem[] = [];

export const navSimpleMain: NavSimpleItem[] = [
  {
    title: "Usuarios",
    url: "/tecnologico/admin/usuarios",
    icon: IconUsers,
  },
  {
    title: "Roles",
    url: "/tecnologico/admin/roles",
    icon: IconShieldLock,
  },
  {
    title: "Permisos",
    url: "/tecnologico/admin/permisos",
    icon: IconKey,
  },
];

export const navMainOptions: NavSimpleItem[] = [
  {
    title: "Configuración",
    url: "/tecnologico/admin/configuracion",
    icon: IconSettings,
    type: 'link'
  },
  {
    title: "Ayuda",
    url: "/tecnologico/admin/ayuda",
    icon: IconHelp,
    type: 'link'
  },
  {
    title: "Search",
    url: "#",
    icon: IconSearch,
  },
];
