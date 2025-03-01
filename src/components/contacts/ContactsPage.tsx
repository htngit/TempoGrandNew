import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddContact from "./AddContact";
import EditContact from "./EditContact";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title?: string;
  notes?: string;
  status?: string;
}

const defaultContacts: Contact[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@company.com",
    phone: "+1 234 567 890",
    company: "Tech Corp",
    title: "CEO",
    status: "customer",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@startup.io",
    phone: "+1 234 567 891",
    company: "Startup.io",
    title: "Marketing Director",
    status: "lead",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@enterprise.com",
    phone: "+1 234 567 892",
    company: "Enterprise Ltd",
    title: "CTO",
    status: "partner",
  },
];

const ContactsPage = () => {
  const [contacts, setContacts] = React.useState<Contact[]>(defaultContacts);
  const [showAddContact, setShowAddContact] = React.useState(false);
  const [showEditContact, setShowEditContact] = React.useState(false);
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleAddContact = (newContact: Omit<Contact, "id">) => {
    const contact = {
      ...newContact,
      id: `${contacts.length + 1}`,
    };
    setContacts([...contacts, contact as Contact]);
    setShowAddContact(false);
  };

  const handleEditContact = (updatedContact: Contact) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === updatedContact.id ? updatedContact : contact,
      ),
    );
    setShowEditContact(false);
    setSelectedContact(null);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <Button onClick={() => setShowAddContact(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Contact
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedContact(contact);
                          setShowEditContact(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showAddContact && (
        <AddContact
          isOpen={showAddContact}
          onClose={() => setShowAddContact(false)}
          onSave={handleAddContact}
        />
      )}

      {showEditContact && selectedContact && (
        <EditContact
          isOpen={showEditContact}
          onClose={() => setShowEditContact(false)}
          onSave={handleEditContact}
          contact={selectedContact}
        />
      )}
    </div>
  );
};

export default ContactsPage;
