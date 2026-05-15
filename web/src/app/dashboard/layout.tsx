"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Receipt, Settings, LogOut, Activity } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("tetra_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  if (!mounted) return null;

  const handleLogout = () => {
    localStorage.removeItem("tetra_token");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-xl md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-zinc-800 px-6">
          <Activity className="h-6 w-6 text-indigo-500" />
          <span className="text-xl font-bold tracking-tight">Tetra Finance</span>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-lg bg-indigo-500/10 px-3 py-2 text-indigo-400 transition-colors">
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/dashboard/transactions" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-colors">
            <Receipt className="h-5 w-5" />
            <span className="font-medium">Transactions</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-colors">
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>

        <div className="border-t border-zinc-800 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 backdrop-blur-xl md:hidden">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-indigo-500" />
            <span className="text-xl font-bold">Tetra</span>
          </div>
          <button onClick={handleLogout} className="text-zinc-400 hover:text-white">
            <LogOut className="h-6 w-6" />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
