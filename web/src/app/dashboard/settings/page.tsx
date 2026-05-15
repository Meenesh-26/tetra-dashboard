"use client";
import { useEffect, useState } from "react";
import { Shield, User } from "lucide-react";

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

export default function SettingsPage() {
  const [role, setRole] = useState<string>("Loading...");
  const [orgId, setOrgId] = useState<string>("...");
  const [userId, setUserId] = useState<string>("...");

  useEffect(() => {
    const token = localStorage.getItem("tetra_token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setRole(decoded.role || "Unknown");
        setOrgId(decoded.orgId?.toString() || "Unknown");
        setUserId(decoded.userId?.toString() || "Unknown");
      }
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your account and organization preferences.</p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl overflow-hidden">
        <div className="border-b border-zinc-800 p-6 flex items-center gap-3">
          <User className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">Your Profile</h2>
        </div>
        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-zinc-500 mb-1">User ID</p>
              <p className="text-white font-medium">{userId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 mb-1">Organization ID</p>
              <p className="text-white font-medium">{orgId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 mb-1">Assigned Role</p>
              <div className="flex items-center gap-2">
                {role === "ADMIN" ? (
                  <Shield className="h-4 w-4 text-indigo-400" />
                ) : (
                  <User className="h-4 w-4 text-zinc-400" />
                )}
                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                  {role}
                </span>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-zinc-800">
            <p className="text-zinc-400 text-sm">
              More settings (like password changes and notification preferences) will be available in a future update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
