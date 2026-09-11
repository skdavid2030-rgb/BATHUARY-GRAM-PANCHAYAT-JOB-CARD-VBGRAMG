import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText, Mail, Building, KeyRound, Database, CheckCircle2, ShieldAlert } from 'lucide-react';

interface PolicyAndSecurityProps {
  language?: 'bn' | 'en';
}

export const PolicyAndSecurity: React.FC<PolicyAndSecurityProps> = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 absolute top-0 left-0" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                  Data Security & Privacy Policy
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider">
                  UIDAI & NIC Compliant
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium max-w-2xl">
                Official data protection protocols, Aadhaar Section 29 compliance, and institutional governance for Bathuary Gram Panchayat.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Compliance Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Aadhaar Protection</span>
            <span className="text-sm font-black text-emerald-400">8-Digit Masking</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Encryption Standard</span>
            <span className="text-sm font-black text-teal-300">AES-256 / TLS 1.3</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Audit Protocol</span>
            <span className="text-sm font-black text-indigo-300">Zero-Tamper Log</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Jurisdiction</span>
            <span className="text-sm font-black text-amber-300">Egra-II Development Block, WB</span>
          </div>
        </div>
      </div>

      {/* Security Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 border-2 border-slate-200/80 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500 absolute top-0 left-0" />
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 mb-3 group-hover:scale-105 transition-transform">
            <EyeOff className="w-6 h-6" />
          </div>
          <h4 className="font-black text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
            Aadhaar Privacy & Masking
          </h4>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
            In strict compliance with Section 29 of the Aadhaar Act, the first 8 digits of Aadhaar are securely masked (<span className="font-mono text-emerald-800 font-bold">XXXX-XXXX-1234</span>) across all public screens.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 border-2 border-slate-200/80 hover:border-indigo-500 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-blue-500 absolute top-0 left-0" />
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 mb-3 group-hover:scale-105 transition-transform">
            <Lock className="w-6 h-6" />
          </div>
          <h4 className="font-black text-slate-900 text-sm group-hover:text-indigo-700 transition-colors">
            Role-Based Access Control
          </h4>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
            Strict granular privileges: only verified GP officers (Secretary, GRS, VLE) hold editing capabilities protected by cryptographic phone/session validation.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-purple-50/30 border-2 border-slate-200/80 hover:border-purple-500 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
          <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-pink-500 absolute top-0 left-0" />
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 mb-3 group-hover:scale-105 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="font-black text-slate-900 text-sm group-hover:text-purple-700 transition-colors">
            Tamper-Proof Audit Trail
          </h4>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
            Every record modification, mobile update, and status change generates an immutable log entry with precise timestamp and staff attribution.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-teal-50/30 border-2 border-slate-200/80 hover:border-teal-500 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
          <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-cyan-500 absolute top-0 left-0" />
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20 mb-3 group-hover:scale-105 transition-transform">
            <Database className="w-6 h-6" />
          </div>
          <h4 className="font-black text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
            Offline Cache & Safe Sync
          </h4>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
            Data updates are held safely in indexed local storage during village field surveys and cleanly reconciled once network connectivity resumes.
          </p>
        </div>
      </div>

      {/* Official Office Contact Box */}
      <div className="rounded-3xl bg-white border-2 border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Official Gram Panchayat Office & Redressal
            </h3>
            <p className="text-xs text-slate-500 font-medium">Institutional contact point for administrative or data inquiries</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50/80 rounded-2xl border-2 border-slate-200/80 flex items-center gap-3 hover:border-sky-400 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Official Inquiries & Support:</span>
              <a href="mailto:bathuarygp@gmail.com" className="font-black text-slate-900 hover:text-sky-700 text-sm">
                bathuarygp@gmail.com
              </a>
            </div>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-2xl border-2 border-slate-200/80 flex items-center gap-3 hover:border-amber-400 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Field Headquarters:</span>
              <span className="font-black text-slate-900 text-sm block">
                Hatbaincha, Egra-II Development Block, Purba Medinipur
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-center text-xs text-slate-500">
          <p className="font-black text-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            © 2026 Bathuary Gram Panchayat, Govt. of West Bengal. All Rights Reserved.
          </p>
          <p className="text-[11px] text-slate-500 font-mono font-bold bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            NREGA Field Automation Portal v3.2
          </p>
        </div>
      </div>
    </div>
  );
};
