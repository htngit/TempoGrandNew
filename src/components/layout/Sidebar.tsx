import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import UserProfileDropdown from "./UserProfileDropdown";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Contact,
  Settings,
  Moon,
  Sun,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
  onSettings?: () => void;
  onProfile?: () => void;
}

const Sidebar = ({
  className,
  isDarkMode = false,
  onThemeToggle = () => console.log("theme toggle clicked"),
  currentPath = "/dashboard",
  onNavigate,
  onLogout = () => console.log("logout clicked"),
  onSettings = () => console.log("settings clicked"),
  onProfile = () => console.log("profile clicked"),
}: SidebarProps) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

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
      icon: Settings,
      label: "Settings",
      path: "/dashboard/settings",
    },
  ];

  return (
    <div
      className={cn(
        "flex h-screen w-[280px] flex-col border-r bg-background",
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
                onClick={() => handleNavigate(item.path)}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="p-4 mt-auto">
        <Button
          variant="ghost"
          size="icon"
          className="mb-4 w-full justify-start gap-2"
          onClick={onThemeToggle}
        >
          {isDarkMode ? (
            <>
              <Sun className="h-5 w-5" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-5 w-5" />
              <span>Dark Mode</span>
            </>
          )}
        </Button>
        <Separator className="my-4" />
        <UserProfileDropdown
          onLogout={onLogout}
          onSettings={onSettings}
          onProfile={onProfile}
        />
      </div>
    </div>
  );
};

export default Sidebar;
