import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserRole } from '@/types';
import { Search, ShieldCheck, User as UserIcon, Store, Ban, CheckCircle2 } from 'lucide-react';

const INITIAL_USERS = [
  { id: 'usr-1', name: 'Parth Shandilya', email: 'parth@bazaario.in', phone: '9876543210', role: 'admin' as UserRole, isBlocked: false },
  { id: 'usr-2', name: 'Vandana Patel', email: 'vandana@suratcreations.com', phone: '9822334455', role: 'seller' as UserRole, isBlocked: false },
  { id: 'usr-3', name: 'Rohan Mehta', email: 'rohan.mehta@gmail.com', phone: '9811223344', role: 'customer' as UserRole, isBlocked: false },
  { id: 'usr-4', name: 'Sunita Sharma', email: 'sunita.s@gmail.com', phone: '9833445566', role: 'customer' as UserRole, isBlocked: false },
  { id: 'usr-5', name: 'Aakash Verma', email: 'aakash@gmail.com', phone: '9844556677', role: 'customer' as UserRole, isBlocked: true },
];

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');

  const toggleBlock = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, isBlocked: !u.isBlocked } : u)));
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">Marketplace Users</h1>
        <p className="text-xs text-text-muted mt-0.5">
          Manage buyer profiles, supplier accounts, and administrative roles
        </p>
      </div>

      <div className="bg-surface p-4 rounded-card border border-border shadow-card flex items-center max-w-sm">
        <Search className="h-4 w-4 text-text-muted mr-2" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 text-xs border-none focus-visible:ring-0 p-0"
        />
      </div>

      <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="text-[11px] font-bold text-text-muted uppercase bg-background border-b border-border">
              <th className="p-4">User</th>
              <th className="p-4">Mobile</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-background/40">
                <td className="p-4">
                  <p className="font-extrabold text-text-primary">{u.name}</p>
                  <span className="text-[11px] text-text-muted">{u.email}</span>
                </td>
                <td className="p-4 font-mono text-text-muted">+91 {u.phone}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-pill text-[10px] font-bold uppercase ${
                      u.role === 'admin'
                        ? 'bg-accent/15 text-accent'
                        : u.role === 'seller'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-border text-text-muted'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  {u.isBlocked ? (
                    <span className="text-danger font-bold flex items-center gap-1">
                      <Ban className="h-3 w-3" /> Blocked
                    </span>
                  ) : (
                    <span className="text-success font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Active
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <button
                    type="button"
                    onClick={() => toggleBlock(u.id)}
                    className={`px-3 py-1 rounded-input font-bold text-xs ${
                      u.isBlocked
                        ? 'bg-success/15 text-success hover:bg-success hover:text-surface'
                        : 'bg-danger/10 text-danger hover:bg-danger hover:text-surface'
                    }`}
                  >
                    {u.isBlocked ? 'Unblock' : 'Block User'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
