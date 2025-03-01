import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import CommandPalette from "@/components/CommandPalette";

interface HomeProps {
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
}

const Home = ({
  isDarkMode = false,
  onThemeToggle = () => console.log("theme toggle clicked"),
}: HomeProps) => {
  const location = useLocation();

  return (
    <div className="bg-background min-h-screen flex">
      <Sidebar
        isDarkMode={isDarkMode}
        onThemeToggle={onThemeToggle}
        currentPath={location.pathname}
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
