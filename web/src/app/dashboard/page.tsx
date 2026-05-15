"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ArrowDownRight, ArrowUpRight, Plus, Trash2, Wallet, Receipt } from "lucide-react";
import { format } from "date-fns";

type Transaction = {
  id: number;
  amount: string;
  type: "income" | "expense";
  category: string;
  date: string;
};

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/transactions", {
        amount: parseFloat(amount),
        type,
        category,
      });
      setShowModal(false);
      setAmount("");
      setCategory("");
      fetchTransactions();
    } catch (err) {
      console.error("Failed to create transaction");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error("Failed to delete");
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get("/transactions/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to export CSV");
    }
  };

  const totalBalance = transactions.reduce((acc, curr) => {
    const val = parseFloat(curr.amount);
    return curr.type === "income" ? acc + val : acc - val;
  }, 0);

  const totalIncome = transactions.filter(t => t.type === "income").reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-zinc-400 mt-1">Here's an overview of your organization's finances.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-transparent px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-all active:scale-[0.98]"
          >
            Export CSV
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-400">Total Balance</p>
            <Wallet className="h-5 w-5 text-zinc-400" />
          </div>
          <p className="mt-4 text-3xl font-bold text-white">${totalBalance.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-400">Total Income</p>
            <ArrowUpRight className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="mt-4 text-3xl font-bold text-emerald-400">+${totalIncome.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-400">Total Expenses</p>
            <ArrowDownRight className="h-5 w-5 text-red-400" />
          </div>
          <p className="mt-4 text-3xl font-bold text-red-400">-${totalExpense.toFixed(2)}</p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl overflow-hidden">
        <div className="border-b border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
        </div>
        <div className="p-0">
          {loading ? (
            <div className="p-8 text-center text-zinc-500">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">
              <Receipt className="mx-auto h-12 w-12 text-zinc-700 mb-4" />
              <p>No transactions found.</p>
              <p className="text-sm mt-1">Add your first transaction to see it here.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 sm:p-6 hover:bg-zinc-800/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {tx.type === 'income' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-zinc-200">{tx.category || "Uncategorized"}</p>
                      <p className="text-sm text-zinc-500">{format(new Date(tx.date), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-semibold ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}${parseFloat(tx.amount).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => handleDelete(tx.id)}
                      className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">New Transaction</h3>
            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType("expense")}
                    className={`rounded-lg py-2 text-sm font-medium transition-colors border ${type === "expense" ? "bg-red-500/10 border-red-500/50 text-red-400" : "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:text-white"}`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("income")}
                    className={`rounded-lg py-2 text-sm font-medium transition-colors border ${type === "income" ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" : "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:text-white"}`}
                  >
                    Income
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Category</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Software Subscriptions"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-zinc-700 bg-transparent px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 transition-colors"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
