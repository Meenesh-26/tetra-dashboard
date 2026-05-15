"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Shield, UserPlus, Users, Trash2 } from "lucide-react";
import { format } from "date-fns";

type User = {
  id: number;
  email: string;
  role: "ADMIN" | "USER";
};

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "USER">("USER");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
      setError("");
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError("You do not have permission to view this page. Admin access required.");
      } else {
        setError("Failed to fetch team members.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/users", {
        email,
        password,
        role,
      });
      setShowModal(false);
      setEmail("");
      setPassword("");
      setRole("USER");
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to add user");
    }
  };

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="mx-auto h-16 w-16 text-red-500/50" />
          <h2 className="text-2xl font-bold text-white">Access Denied</h2>
          <p className="text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Team Management</h1>
          <p className="text-zinc-400 mt-1">Manage users and roles in your organization.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 transition-all active:scale-[0.98]"
        >
          <UserPlus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl overflow-hidden">
        <div className="border-b border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-white">Team Members</h2>
        </div>
        <div className="p-0">
          {loading ? (
            <div className="p-8 text-center text-zinc-500">Loading members...</div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 sm:p-6 hover:bg-zinc-800/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${user.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-zinc-500/10 text-zinc-400'}`}>
                      {user.role === 'ADMIN' ? <Shield className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-zinc-200">{user.email}</p>
                      <p className="text-xs text-zinc-500 mt-1">ID: {user.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Add Team Member</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="user@acme.com"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Password</label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                  placeholder="Set a password for them"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("USER")}
                    className={`rounded-lg py-2 text-sm font-medium transition-colors border ${role === "USER" ? "bg-zinc-800 border-zinc-500 text-white" : "bg-zinc-800/30 border-zinc-700 text-zinc-500 hover:text-zinc-400"}`}
                  >
                    User
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("ADMIN")}
                    className={`rounded-lg py-2 text-sm font-medium transition-colors border ${role === "ADMIN" ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-400" : "bg-zinc-800/30 border-zinc-700 text-zinc-500 hover:text-zinc-400"}`}
                  >
                    Admin
                  </button>
                </div>
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
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
