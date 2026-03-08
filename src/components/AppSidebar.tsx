import {
  LayoutDashboard, Monitor, ShieldCheck, FileText, Bell, Building2, FileCode2, FilePlus, Users,
  Settings, UserCog, Key, Package, ClipboardCheck
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Agents", url: "/agents", icon: Monitor },
  { title: "Certificates", url: "/certificates", icon: ShieldCheck },
  { title: "Issued Certificates", url: "/issued-certificates", icon: FileText },
  { title: "Alerts", url: "/alerts", icon: Bell },
];

const caItems = [
  { title: "Certificate Authority", url: "/ca-management", icon: Building2 },
  { title: "Templates", url: "/templates", icon: FileCode2 },
  { title: "Request Certificate", url: "/request-certificate", icon: FilePlus },
  { title: "Authorization", url: "/authorization", icon: Users },
];

const settingsItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Agent Management", url: "/settings/agents", icon: UserCog },
  { title: "Enrollment Keys", url: "/settings/enrollment-keys", icon: Key },
  { title: "MSI Packages", url: "/settings/msi", icon: Package },
  { title: "Compliance", url: "/settings/compliance", icon: ClipboardCheck },
];

function NavGroup({ label, items }: { label: string; items: typeof mainItems }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="hover:bg-sidebar-accent/50 transition-colors"
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-2">
        <NavGroup label="Main" items={mainItems} />
        <NavGroup label="CA" items={caItems} />
        <NavGroup label="Settings" items={settingsItems} />
      </SidebarContent>
    </Sidebar>
  );
}
