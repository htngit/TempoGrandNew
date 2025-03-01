import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  DollarSign,
  Target,
  Briefcase,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, icon }: StatCardProps) => {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-muted rounded-lg">{icon}</div>
          <div
            className={`flex items-center ${isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {isPositive ? (
              <ArrowUpRight size={20} />
            ) : (
              <ArrowDownRight size={20} />
            )}
            <span className="ml-1 text-sm font-medium">
              {Math.abs(change)}%
            </span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

interface StatsOverviewProps {
  stats?: {
    totalLeads: number;
    revenue: number;
    conversionRate: number;
    activeDeals: number;
  };
}

const StatsOverview = ({
  stats = {
    totalLeads: 2547,
    revenue: 45600,
    conversionRate: 15.3,
    activeDeals: 124,
  },
}: StatsOverviewProps) => {
  return (
    <div className="bg-background p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-6">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads.toLocaleString()}
          change={12.5}
          icon={<Users size={24} className="text-blue-600" />}
        />
        <StatCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          change={8.2}
          icon={<DollarSign size={24} className="text-green-600" />}
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          change={-2.4}
          icon={<Target size={24} className="text-purple-600" />}
        />
        <StatCard
          title="Active Deals"
          value={stats.activeDeals.toString()}
          change={5.7}
          icon={<Briefcase size={24} className="text-orange-600" />}
        />
      </div>
    </div>
  );
};

export default StatsOverview;
