import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import UserProfileDropdown from "./UserProfileDropdown";
import {
  LayoutDashboard,
  Users,
  Contact,
  Settings,
  Package,
  FileText,
  Calendar,
  Mail,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  isDarkMode?: boolean;
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

const Sidebar = ({
  className,
  isDarkMode = false,
  currentPath = "/dashboard",
  onNavigate = (path) => console.log(`navigate to ${path}`),
}: SidebarProps) => {
  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: Users,
      label: "Leads",
      path: "/dashboard/leads",
    },
    {
      icon: Contact,
      label: "Contacts",
      path: "/dashboard/contacts",
    },
    {
      icon: Package,
      label: "Products",
      path: "/dashboard/products",
    },
    {
      icon: FileText,
      label: "Quotes",
      path: "/dashboard/quotes",
    },
    {
      icon: Calendar,
      label: "Activities",
      path: "/dashboard/activities",
    },
    {
      icon: Mail,
      label: "Mail",
      path: "/dashboard/mail",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/dashboard/settings",
    },
  ];

  return (
    <div
      className={cn(
        "fixed top-0 left-0 flex h-screen w-[280px] flex-col border-r bg-background z-10",
        className,
      )}
    >
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold">CRM Dashboard</h1>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => onNavigate(item.path)}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="p-4 mt-auto">
        <Separator className="mb-4" />
        <UserProfileDropdown />
      </div>
    </div>
  );
};

export default Sidebar;
