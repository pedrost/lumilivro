"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Contact {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  subject: string;
  orderNumber: string | null;
  message: string;
  archived: boolean;
}

export default function ContatosPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showArchived, setShowArchived] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dialogContact, setDialogContact] = useState<Contact | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        archived: showArchived.toString(),
      });

      const res = await fetch(`/api/contacts?${params}`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts);
        setTotalPages(data.pages);
        setTotal(data.total);
      }
    } catch (err) {
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
    }
  }, [page, showArchived]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Contacts</h1>
          <p className="text-neutral-400 text-sm mt-1">
            {total} message{total !== 1 ? "s" : ""}{" "}
            {showArchived ? "(archived)" : ""}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setShowArchived(!showArchived);
            setPage(1);
          }}
          className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800"
        >
          {showArchived ? "Show active" : "Show archived"}
        </Button>
      </div>

      {/* Table */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            <Mail className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p>No contacts found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="text-neutral-400 w-8" />
                <TableHead className="text-neutral-400">Date</TableHead>
                <TableHead className="text-neutral-400">Name</TableHead>
                <TableHead className="text-neutral-400">Email</TableHead>
                <TableHead className="text-neutral-400">Subject</TableHead>
                <TableHead className="text-neutral-400">Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <>
                  <TableRow
                    key={contact.id}
                    className="border-neutral-800 hover:bg-neutral-800/50 cursor-pointer"
                    onClick={() => toggleExpand(contact.id)}
                  >
                    <TableCell className="w-8">
                      {expandedId === contact.id ? (
                        <ChevronUp className="h-4 w-4 text-neutral-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-neutral-500" />
                      )}
                    </TableCell>
                    <TableCell className="text-neutral-300 whitespace-nowrap">
                      {new Date(contact.createdAt).toLocaleDateString("en-US")}
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {contact.name}
                    </TableCell>
                    <TableCell className="text-neutral-300">
                      <a
                        href={`mailto:${contact.email}`}
                        className="hover:text-amber-500 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {contact.email}
                      </a>
                    </TableCell>
                    <TableCell className="text-neutral-300">
                      {contact.subject}
                    </TableCell>
                    <TableCell className="text-neutral-400 font-mono text-sm">
                      {contact.orderNumber || "—"}
                    </TableCell>
                  </TableRow>
                  {expandedId === contact.id && (
                    <TableRow
                      key={`${contact.id}-expanded`}
                      className="border-neutral-800 bg-neutral-800/30"
                    >
                      <TableCell colSpan={6}>
                        <div className="py-2 px-4">
                          <p className="text-sm text-neutral-400 mb-2 font-medium">
                            Message:
                          </p>
                          <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">
                            {contact.message}
                          </p>
                          <div className="mt-3 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDialogContact(contact);
                              }}
                              className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs"
                            >
                              View full screen
                            </Button>
                            <a
                              href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs"
                              >
                                <Mail className="h-3 w-3 mr-1" />
                                Reply
                              </Button>
                            </a>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800">
            <p className="text-sm text-neutral-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Full-screen dialog for message */}
      <Dialog
        open={!!dialogContact}
        onOpenChange={(o) => !o && setDialogContact(null)}
      >
        {dialogContact && (
          <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">
                {dialogContact.subject}
              </DialogTitle>
              <DialogDescription className="text-neutral-400">
                From {dialogContact.name} ({dialogContact.email}) on{" "}
                {new Date(dialogContact.createdAt).toLocaleString("en-US")}
                {dialogContact.orderNumber && (
                  <>
                    {" "}
                    — Order #{dialogContact.orderNumber}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">
                {dialogContact.message}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <a
                href={`mailto:${dialogContact.email}?subject=Re: ${dialogContact.subject}`}
              >
                <Button className="bg-amber-500 hover:bg-amber-600 text-black font-medium">
                  <Mail className="h-4 w-4 mr-1" />
                  Reply by Email
                </Button>
              </a>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
