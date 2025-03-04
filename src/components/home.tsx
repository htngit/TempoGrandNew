import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import CommandPalette from "@/components/CommandPalette";

interface HomeProps {
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
  onLogout?: () => void;
}

const Home = ({
  isDarkMode = false,
  onThemeToggle = () => console.log("theme toggle clicked"),
  onLogout = () => console.log("logout clicked"),
}: HomeProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSettings = () => {
    navigate("/dashboard/settings");
  };

  const handleProfile = () => {
    // Navigate to profile page when implemented
    console.log("Navigate to profile");
  };

  return (
    <div className="bg-background min-h-screen flex">
      <Sidebar
        isDarkMode={isDarkMode}
        onThemeToggle={onThemeToggle}
        currentPath={location.pathname}
        onLogout={onLogout}
        onSettings={handleSettings}
        onProfile={handleProfile}
      />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <CommandPalette />
    </div>
  );
};

export default Home;
