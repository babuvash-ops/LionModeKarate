import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  CreditCard,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HeroBanner from "@/components/shared/HeroBanner";
import GoldButton from "@/components/shared/GoldButton";
import StatCard from "@/components/shared/StatCard";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function InvoicesPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    student_name: "",
    description: "Monthly Tuition - Lion Mode Karate",
    amount: "850",
    due_date: "2026-07-15"
  });

  const { data: invoices = [], refetch } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => base44.entities.Invoice.list("-date", 50),
  });

  const totalCollected = invoices
    .filter((i: any) => i.status === "paid")
    .reduce((sum: number, i: any) => sum + (Number(i.amount) || 0), 0);

  const pendingTotal = invoices
    .filter((i: any) => i.status === "pending")
    .reduce((sum: number, i: any) => sum + (Number(i.amount) || 0), 0);

  const overdueCount = invoices.filter((i: any) => i.status === "overdue").length;

  const filtered = invoices.filter((i: any) => {
    const matchesStatus = filter === "all" || i.status === filter;
    const matchesSearch = 
      (i.student_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (i.invoice_number || "").toLowerCase().includes(search.toLowerCase()) ||
      (i.description || "").toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.student_name || !newInvoice.amount) {
      toast.error("Please enter student name and amount");
      return;
    }

    const created = {
      invoice_number: `INV-2026-0${invoices.length + 10}`,
      student_name: newInvoice.student_name,
      description: newInvoice.description,
      amount: Number(newInvoice.amount),
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      due_date: newInvoice.due_date,
      payment_method: "EFT / Card"
    };

    await base44.entities.Invoice.create(created);
    toast.success(`Invoice ${created.invoice_number} generated for ${newInvoice.student_name}`);
    setShowCreateModal(false);
    refetch();
  };

  const handleDownload = (inv: any) => {
    toast.success(`Receipt for ${inv.invoice_number} (${inv.student_name}) downloaded.`);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-32">
      <HeroBanner
        title="Dojo Billing & Invoicing"
        subtitle="Manage student membership tuition, tournament fees, Pro Shop orders, and automated payment receipts."
        image="https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1600&q=80"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`R ${totalCollected.toLocaleString()}`}
            trend="+14% this term"
          />
          <StatCard
            icon={Clock}
            label="Pending Invoices"
            value={`R ${pendingTotal.toLocaleString()}`}
          />
          <StatCard
            icon={CheckCircle2}
            label="Collection Rate"
            value={`${Math.round((totalCollected / (totalCollected + pendingTotal || 1)) * 100)}%`}
          />
          <StatCard
            icon={AlertCircle}
            label="Overdue Notices"
            value={overdueCount}
          />
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search student or invoice #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] font-body"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/10">
              {["all", "paid", "pending", "overdue"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-heading uppercase tracking-wider transition-all cursor-pointer ${
                    filter === st
                      ? "bg-[#D4AF37] text-black font-bold"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <GoldButton onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Generate Invoice
            </GoldButton>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-heading uppercase tracking-widest text-white/50 bg-white/[0.02]">
                  <th className="p-4 pl-6">Invoice #</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-body text-white/80">
                {filtered.map((inv: any) => {
                  const isPaid = inv.status === "paid";
                  const isPending = inv.status === "pending";
                  const isOverdue = inv.status === "overdue";

                  return (
                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 pl-6 font-mono font-semibold text-white">
                        {inv.invoice_number || `INV-${inv.id}`}
                      </td>
                      <td className="p-4 font-heading text-sm font-bold text-white uppercase">
                        {inv.student_name}
                      </td>
                      <td className="p-4 text-white/70 max-w-xs truncate">
                        {inv.description}
                      </td>
                      <td className="p-4 font-heading text-sm font-bold text-[#D4AF37]">
                        R {Number(inv.amount).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-heading uppercase tracking-wider font-bold ${
                            isPaid
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : isPending
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-4 text-white/50">
                        {inv.payment_method || "EFT / Card"}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleDownload(inv)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                          title="Download Invoice PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Invoice Dialog */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md bg-[#0A0A0A] border border-white/10 text-white rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold uppercase text-white">
              Create New Invoice
            </DialogTitle>
            <DialogDescription className="text-white/60 font-body text-xs">
              Issue a new tuition, grading, or uniform invoice to a registered student.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/60">Student Name</label>
              <input
                type="text"
                placeholder="e.g. Liam Naidoo"
                value={newInvoice.student_name}
                onChange={(e) => setNewInvoice({ ...newInvoice, student_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading uppercase tracking-wider text-white/60">Description</label>
              <input
                type="text"
                value={newInvoice.description}
                onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-heading uppercase tracking-wider text-white/60">Amount (ZAR)</label>
                <input
                  type="number"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-heading uppercase tracking-wider text-white/60">Due Date</label>
                <input
                  type="date"
                  value={newInvoice.due_date}
                  onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
            </div>

            <GoldButton type="submit" className="w-full mt-2">
              Issue Invoice
            </GoldButton>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
