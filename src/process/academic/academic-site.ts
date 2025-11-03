import {
  type LucideIcon,
} from "lucide-react"
import {
  IconDatabase,
  IconReport,
  IconHelp,
  IconSearch,
  IconSettings,
  type Icon
} from "@tabler/icons-react"

export const routes = {
  base: "/academico/",
  general: {
    login: "/academico/login",
    register: "/academico/register",
  },
  dashboard:{
    index: "/academico/dashboard",
    account: "/academico/account"
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
  name: "INSTITUTO DE CAPACITACIÓN VIRTUAL EN EL PERÚ - PROCESOS ACADÉMICOS",
  description: "Instituto de Capacitación Virtual en el Perú - Procesos Académicos es un servicio que brinda la Universidad Nacional del Santa",
};

export const navMainCollapse: NavItem[] = [];

export const navSimpleMain: NavSimpleItem[] = [
  {
    title: "Mis Cursos",
    url: "/academico/dashboard/catalogo",
    icon: IconDatabase,
  },
];

export const navMainOptions: NavSimpleItem[] = [
   {
    title: "Configuración",
    url: "/academico/configuracion",
    icon: IconSettings,
    type: 'link'
  },
  {
    title: "Ayuda", 
    url: "/academico/ayuda",
    icon: IconHelp,
    type: 'link'
  },
  {
    title: "Search",
    url: "#",
    icon: IconSearch,
  },
];