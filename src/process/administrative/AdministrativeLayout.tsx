import { AppSidebar } from "@/process/administrative/components/app-sidebar";
import { SiteHeader } from "@/process/administrative/components/main-content/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useAdministrativeAuth } from "@/process/administrative/hooks/useAdministrativeAuth";


// IMPORTAR NavItems dinámicos
import { adminNavItems } from "@/process/administrative/administrative-site";

interface AdministrativeLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdministrativeLayout({
  children,
  title = "Dashboard: Administrativo",
}: AdministrativeLayoutProps) {

  const { token, user, mounted } = useAdministrativeAuth();

  if (!mounted) return <></>;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        token={token}
        user={user}
        navItems={adminNavItems}
      />

      <SidebarInset>
        <SiteHeader title={title} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
