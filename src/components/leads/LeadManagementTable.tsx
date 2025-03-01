import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, MoreHorizontal, ArrowUpDown } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  status: "new" | "contacted" | "qualified" | "lost";
  date: string;
}

interface LeadManagementTableProps {
  leads?: Lead[];
  onSort?: (column: string) => void;
  onFilter?: (value: string) => void;
  onLeadSelect?: (lead: Lead) => void;
}

const defaultLeads: Lead[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@company.com",
    company: "Tech Corp",
    status: "new",
    date: "2024-03-15",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@startup.io",
    company: "Startup.io",
    status: "contacted",
    date: "2024-03-14",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@enterprise.com",
    company: "Enterprise Ltd",
    status: "qualified",
    date: "2024-03-13",
  },
];

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-green-100 text-green-800",
  lost: "bg-red-100 text-red-800",
};

const LeadManagementTable = ({
  leads = defaultLeads,
  onSort = () => {},
  onFilter = () => {},
  onLeadSelect = () => {},
}: LeadManagementTableProps) => {
  return (
    <div className="bg-background w-full p-4 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Filter leads..."
          className="max-w-sm"
          onChange={(e) => onFilter(e.target.value)}
        />
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Button
                  variant="ghost"
                  onClick={() => onSort("name")}
                  className="hover:bg-transparent"
                >
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSort("email")}
                  className="hover:bg-transparent"
                >
                  Email
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSort("company")}
                  className="hover:bg-transparent"
                >
                  Company
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSort("status")}
                  className="hover:bg-transparent"
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => onSort("date")}
                  className="hover:bg-transparent"
                >
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow
                key={lead.id}
                onClick={() => onLeadSelect(lead)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusColors[lead.status]}
                  >
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell>{lead.date}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LeadManagementTable;
