import React, { useState, useEffect } from "react";
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
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Add keyboard shortcut listener for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="bg-background min-h-screen flex">
      <Sidebar isDarkMode={isDarkMode} currentPath={location.pathname} />
      <div className="w-[280px]"></div>{" "}
      {/* Spacer to compensate for fixed sidebar */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      {showCommandPalette && (
        <CommandPalette
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
        />
      )}
    </div>
  );
};

export default Home;
