import {
  LayoutDashboard, Monitor, ShieldCheck, FileText, Bell, Building2, FileCode2, FilePlus, Users,
  Settings, UserCog, Key, Package, ClipboardCheck, BadgeCheck
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, iconClass: "icon-bg-blue" },
  { title: "Agents", url: "/agents", icon: Monitor, iconClass: "icon-bg-cyan" },
  { title: "Certificates", url: "/certificates", icon: ShieldCheck, iconClass: "icon-bg-green" },
  { title: "Issued Certificates", url: "/issued-certificates", icon: FileText, iconClass: "icon-bg-purple" },
  { title: "Alerts", url: "/alerts", icon: Bell, iconClass: "icon-bg-orange" },
];

const caItems = [
  { title: "Certificate Authority", url: "/ca-management", icon: Building2, iconClass: "icon-bg-pink" },
  { title: "Templates", url: "/templates", icon: FileCode2, iconClass: "icon-bg-yellow" },
  { title: "Request Certificate", url: "/request-certificate", icon: FilePlus, iconClass: "icon-bg-green" },
  { title: "Authorization", url: "/authorization", icon: Users, iconClass: "icon-bg-red" },
];

const settingsItems = [
  { title: "Settings", url: "/settings", icon: Settings, iconClass: "icon-bg-blue" },
  { title: "Agent Management", url: "/settings/agents", icon: UserCog, iconClass: "icon-bg-cyan" },
  { title: "Enrollment Keys", url: "/settings/enrollment-keys", icon: Key, iconClass: "icon-bg-yellow" },
  { title: "MSI Packages", url: "/settings/msi", icon: Package, iconClass: "icon-bg-purple" },
  { title: "Compliance", url: "/settings/compliance", icon: ClipboardCheck, iconClass: "icon-bg-green" },
];

function NavGroup({ label, items }: { label: string; items: typeof mainItems }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

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
                  <item.icon className={`h-4 w-4 shrink-0 ${item.iconClass}`} />
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
