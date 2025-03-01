import React from "react";
import StatsOverview from "./StatsOverview";
import LeadManagementTable from "../leads/LeadManagementTable";

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <StatsOverview />
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Leads</h2>
        <LeadManagementTable />
      </div>
    </div>
  );
};

export default DashboardHome;
