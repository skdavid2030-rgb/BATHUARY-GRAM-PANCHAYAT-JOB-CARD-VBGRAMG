import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Key, 
  Trash2, 
  History, 
  CheckCircle2, 
  Phone, 
  Mail,
  Search,
  Sparkles,
  BadgeCheck,
  Building2,
  Lock
} from 'lucide-react';
import { AppUser, AuditLog } from '../types';

interface UserManagementProps {
  users: AppUser[];
  auditLogs: AuditLog[];
  onAddUser: (user: Partial<AppUser>) => Promise<boolean>;
  onDeleteUser: (mobile: string) => Promise<boolean>;
  language: 'bn' | 'en';
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  auditLogs,
  onAddUser,
  onDeleteUser,
  language
}) => {
  const isBn = language === 'bn';

  const [showAddModal, setShowAddModal] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');
  const [newUser, setNewUser] = useState<Partial<AppUser>>({
    name: '',
    mobile: '',
    role: 'SAHAYAK',
    designation: 'Sahayak',
    email: '',
    assignedVillages: 'HATBAINCHA'
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.mobile) return;
    const success = await onAddUser(newUser);
    if (success) {
      setShowAddModal(false);
      setNewUser({
        name: '',
        mobile: '',
        role: 'SAHAYAK',
        designation: 'Sahayak',
        email: '',
        assignedVillages: 'HATBAINCHA'
      });
    }
  };

  const filteredLogs = useMemo(() => {
    if (!auditSearch.trim()) return auditLogs;
    const q = auditSearch.toLowerCase();
    return auditLogs.filter(log => 
      log.jobCardNumber.toLowerCase().includes(q) ||
      log.beneficiaryName.toLowerCase().includes(q) ||
      log.updatedBy.toLowerCase().includes(q)
    );
  }, [auditLogs, auditSearch]);

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'SECRETARY':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300';
      case 'GRS':
        return 'bg-teal-100 text-teal-950 border-teal-300';
      case 'VLE':
        return 'bg-sky-100 text-sky-950 border-sky-300';
      default:
        return 'bg-amber-100 text-amber-950 border-amber-300';
    }
  };

  const getAvatarGradient = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'from-purple-600 to-indigo-700';
      case 'SECRETARY':
        return 'from-emerald-600 to-teal-700';
      case 'GRS':
        return 'from-teal-600 to-cyan-700';
      case 'VLE':
        return 'from-sky-600 to-blue-700';
      default:
        return 'from-amber-500 to-orange-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Gradient Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 absolute top-0 left-0" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Officer & Staff Management (RBAC)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider">
                  256-Bit SSL
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium max-w-xl">
                Role-Based Access Control and authenticated field accounts for Bathuary Gram Panchayat NREGA administration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer hover:shadow-xl active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Staff Account</span>
            </button>
          </div>
        </div>

        {/* Quick RBAC stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Officers</span>
            <span className="text-sm font-black text-emerald-400 font-mono">{users.length} Active</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Audited Edits</span>
            <span className="text-sm font-black text-teal-300 font-mono">{auditLogs.length} Events</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Security Protocol</span>
            <span className="text-sm font-black text-indigo-300 font-mono">Role Verification</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">GP Office</span>
            <span className="text-sm font-black text-amber-300 font-mono">Hatbaincha HQ</span>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {users.map(u => (
          <div
            key={u.mobile}
            className="p-6 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-emerald-50/20 border-2 border-slate-200/80 hover:border-emerald-500 shadow-sm hover:shadow-xl relative group transition-all duration-300 overflow-hidden"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500 absolute top-0 left-0" />
            
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getAvatarGradient(u.role)} text-white font-black text-base flex items-center justify-center shadow-md shadow-slate-900/10`}>
                {(u.name || 'U').charAt(0)}
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border shadow-2xs ${getRoleBadge(u.role)}`}>
                  {u.role}
                </span>
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3 text-emerald-600" />
                  Verified Officer
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-black text-slate-900 text-base truncate group-hover:text-emerald-700 transition-colors">
                {u.name}
              </h4>
              <p className="text-xs font-bold text-slate-600 mt-0.5">{u.designation || 'Gram Panchayat Staff'}</p>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-200/80 space-y-2 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-mono font-bold text-slate-900">{u.mobile}</span>
              </div>
              {u.email && (
                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="truncate font-semibold text-slate-800">{u.email}</span>
                </div>
              )}
            </div>

            {u.mobile !== '9002736997' && (
              <div className="mt-4 pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onDeleteUser(u.mobile)}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:shadow-xs"
                  title="Revoke access"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Revoke</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Audit Log Trail */}
      <div className="rounded-3xl bg-white border-2 border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                System Audit Trail & Update History
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Immutable chronological log of all beneficiary updates, KYC entries, and staff actions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter logs by Job Card or Staff..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all w-64 shadow-2xs"
              />
            </div>
            <span className="text-xs font-black text-indigo-950 bg-indigo-100 px-3 py-1.5 rounded-full border border-indigo-300 shadow-2xs font-mono">
              {filteredLogs.length} Events
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-black border-b-2 border-slate-200">
              <tr>
                <th className="py-3 px-3.5">Timestamp</th>
                <th className="py-3 px-3.5">Job Card No</th>
                <th className="py-3 px-3.5">Beneficiary Name</th>
                <th className="py-3 px-3.5">Updated By (Staff)</th>
                <th className="py-3 px-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-medium italic">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3.5 font-mono text-slate-500 font-bold">{log.timestamp}</td>
                    <td className="py-3 px-3.5 font-mono font-black text-indigo-700">
                      <span className="bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {log.jobCardNumber}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 font-black text-slate-900">{log.beneficiaryName}</td>
                    <td className="py-3 px-3.5 text-slate-700 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {log.updatedBy}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        SUCCESS
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="rounded-3xl bg-white border-2 border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200 relative overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500 absolute top-0 left-0" />
            
            <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  Add Officer / Staff Account
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Grant secure field access for Bathuary GP
                </p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-800 font-black block mb-1.5">Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUBRATA JANA"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 border-2 border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white shadow-2xs"
                />
              </div>

              <div>
                <label className="text-slate-800 font-black block mb-1.5">Mobile Number (Login ID / Phone):</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="10 digit mobile"
                  value={newUser.mobile}
                  onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 font-mono font-bold rounded-xl px-3.5 py-2.5 border-2 border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white shadow-2xs"
                />
              </div>

              <div>
                <label className="text-slate-800 font-black block mb-1.5">Designation & Role:</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  className="w-full bg-slate-50 text-slate-900 font-bold rounded-xl px-3.5 py-2.5 border-2 border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white shadow-2xs cursor-pointer"
                >
                  <option value="SECRETARY">SECRETARY (Panchayat Secretary)</option>
                  <option value="GRS">GRS (Gram Rozgar Sahayak)</option>
                  <option value="VLE">VLE (Village Level Entrepreneur)</option>
                  <option value="SAHAYAK">SAHAYAK (Assistant)</option>
                  <option value="ADMIN">ADMINISTRATOR</option>
                </select>
              </div>

              <div>
                <label className="text-slate-800 font-black block mb-1.5">Email Address (Optional):</label>
                <input
                  type="email"
                  placeholder="staff@bathuarygp.gov.in"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 font-medium rounded-xl px-3.5 py-2.5 border-2 border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white shadow-2xs"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl shadow-md cursor-pointer transition-all shadow-emerald-600/20 active:scale-95"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
