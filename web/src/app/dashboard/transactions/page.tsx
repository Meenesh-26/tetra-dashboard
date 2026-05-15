"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ArrowDownRight, ArrowUpRight, Receipt, Trash2 } from "lucide-react";
import { format } from "date-fns";

type Transaction = {
  id: number;
  amount: string;
  type: "income" | "expense";
  category: string;
  date: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">All Transactions</h1>
          <p className="text-zinc-400 mt-1">A complete history of your organization's income and expenses.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-transparent px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-all active:scale-[0.98]"
        >
          Export CSV
        </button>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl overflow-hidden">
        <div className="p-0">
          {loading ? (
            <div className="p-8 text-center text-zinc-500">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">
              <Receipt className="mx-auto h-12 w-12 text-zinc-700 mb-4" />
              <p>No transactions found.</p>
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
    </div>
  );
}
