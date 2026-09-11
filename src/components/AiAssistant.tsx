import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Search,
  Shuffle,
  Clock,
  ArrowRight,
  Database,
  Building,
  Check,
  AlertCircle
} from 'lucide-react';
import { BeneficiaryRow } from '../types';
import { CANONICAL_29_VILLAGES } from '../utils/villageNormalizer';
import { CANONICAL_16_SANSADS } from '../utils/sansadNormalizer';
import { BANK_MERGER_MAP } from '../data/bankMaster';

interface AiAssistantProps {
  beneficiaries: BeneficiaryRow[];
  activeAuditRow?: BeneficiaryRow | null;
  language?: 'bn' | 'en';
}

interface LocalAuditResult {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'Action Needed';
  summary: string;
  issues: string[];
  recommendations: string[];
  complianceItems: {
    label: string;
    status: 'pass' | 'fail' | 'warning';
    detail: string;
  }[];
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  beneficiaries,
  activeAuditRow
}) => {
  // Chat state
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: "নমস্কার! আমি বাথুয়ারী গ্রাম পঞ্চায়েত এআই ভেরিফায়ার অ্যাসিস্ট্যান্ট (Bathuary GP AI Assistant)। আপনার জব কার্ড (Job Card), আধার ই-কেওয়াইসি (e-KYC), এবিপিএস পেমেন্ট (ABPS) এবং ২৯টি গ্রাম ও ১৬টি সংসদ সম্পর্কিত যেকোনো প্রশ্নে আমি তাৎক্ষণিক সাহায্য করতে প্রস্তুত।",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  // AI Audit state
  const [auditTarget, setAuditTarget] = useState<BeneficiaryRow | null>(activeAuditRow || null);
  const [auditResult, setAuditResult] = useState<LocalAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [recordSearch, setRecordSearch] = useState('');

  // Keep auditTarget synced when beneficiaries or activeAuditRow changes
  useEffect(() => {
    if (activeAuditRow) {
      setAuditTarget(activeAuditRow);
      setAuditResult(null);
    } else if (!auditTarget && beneficiaries.length > 0) {
      setAuditTarget(beneficiaries[0]);
    }
  }, [activeAuditRow, beneficiaries]);

  // Fast filtered options for dropdown (capped at 50 for max UI responsiveness)
  const candidateBeneficiaries = useMemo(() => {
    if (!beneficiaries || beneficiaries.length === 0) return [];
    const term = recordSearch.trim().toLowerCase();
    if (!term) return beneficiaries.slice(0, 50);
    return beneficiaries
      .filter(b => 
        (b.colJ && b.colJ.toLowerCase().includes(term)) ||
        (b.colH && b.colH.toLowerCase().includes(term)) ||
        (b.colV && b.colV.toLowerCase().includes(term)) ||
        (b.colP && b.colP.includes(term))
      )
      .slice(0, 50);
  }, [beneficiaries, recordSearch]);

  // Robust Local Heuristic Engine for Job Card & e-KYC Compliance
  const evaluateLocalAudit = (b: BeneficiaryRow): LocalAuditResult => {
    const issues: string[] = [];
    const recommendations: string[] = [];
    const complianceItems: LocalAuditResult['complianceItems'] = [];
    let score = 100;

    // 1. Applicant Name & Job Card
    const hasName = Boolean(b.colJ && b.colJ.trim().length > 1);
    const hasJobCard = Boolean(b.colH && b.colH.trim().length > 3);
    if (!hasName) {
      score -= 25;
      issues.push("আবেদনকারীর নাম পাওয়া যায়নি বা অসম্পূর্ণ (Missing or invalid applicant name).");
    }
    if (!hasJobCard) {
      score -= 25;
      issues.push("জব কার্ড নম্বর অনুপস্থিত বা ভুল ফরম্যাট (Invalid or missing Job Card Number).");
    }
    complianceItems.push({
      label: "Job Card & Name",
      status: hasName && hasJobCard ? 'pass' : 'fail',
      detail: `${b.colJ || 'Unknown'} (${b.colH || 'Missing'})`
    });

    // 2. Aadhaar UID Verification
    const cleanAadhaar = (b.colP || '').replace(/\D/g, '');
    const is12DigitAadhaar = cleanAadhaar.length === 12;
    if (!cleanAadhaar) {
      score -= 20;
      issues.push("আধার নম্বর অনুপস্থিত (Aadhaar number is missing).");
      recommendations.push("অবিলম্বে নাগরিকের ১২ সংখ্যার আধার কার্ড সংগ্রহ করে তথ্য পোর্টালে হালনাগাদ করুন।");
      complianceItems.push({
        label: "Aadhaar UID",
        status: 'fail',
        detail: "নম্বর অনুপস্থিত (Missing)"
      });
    } else if (!is12DigitAadhaar) {
      score -= 15;
      issues.push(`আধার নম্বর ১২ সংখ্যার হতে হবে, বর্তমান দৈর্ঘ্য: ${cleanAadhaar.length} সংখ্যা।`);
      recommendations.push("আধার নম্বর পুনরায় স্ক্যান বা যাচাই করে সঠিক ১২ সংখ্যা এন্ট্রি করুন।");
      complianceItems.push({
        label: "Aadhaar UID",
        status: 'warning',
        detail: `ত্রুটিপূর্ণ দৈর্ঘ্য (${cleanAadhaar.length} digits)`
      });
    } else {
      complianceItems.push({
        label: "Aadhaar UID",
        status: 'pass',
        detail: `বৈধ ১২ সংখ্যা (•••• ${cleanAadhaar.slice(-4)})`
      });
    }

    // 3. e-KYC & ABPS Status
    const isEkycDone = (b.colR || '').toUpperCase() === 'YES' || (b.colR || '').toUpperCase() === 'Y';
    const isAbpsDone = (b.colO || '').toUpperCase() === 'YES' || (b.colO || '').toUpperCase() === 'Y';
    if (!isEkycDone) {
      score -= 15;
      issues.push("আধার ভিত্তিক ই-কেওয়াইসি (e-KYC) এখনো সম্পন্ন হয়নি (Pending).");
      recommendations.push("GRS অথবা বায়োমেট্রিক ক্যাম্পের মাধ্যমে আঙুলের ছাপ দিয়ে তাৎক্ষণিক e-KYC ভেরিফিকেশন সম্পন্ন করুন।");
      complianceItems.push({
        label: "e-KYC Status",
        status: 'warning',
        detail: "বাকি (Pending)"
      });
    } else {
      complianceItems.push({
        label: "e-KYC Status",
        status: 'pass',
        detail: "সম্পন্ন (Completed)"
      });
    }

    if (isEkycDone && !isAbpsDone) {
      score -= 10;
      issues.push("ই-কেওয়াইসি সফল হলেও NPCI ব্যাংকিং পোর্টালে ABPS লিঙ্কিং বাকি রয়েছে।");
      recommendations.push("আধার বেসড পেমেন্ট ব্রিজ (ABPS) চালু করার জন্য ব্যাংক শাখায় NPCI ম্যাপার ফর্ম জমা দিতে বলুন।");
      complianceItems.push({
        label: "ABPS Linkage",
        status: 'warning',
        detail: "NPCI ম্যাপিং প্রয়োজন"
      });
    } else if (isAbpsDone) {
      complianceItems.push({
        label: "ABPS Linkage",
        status: 'pass',
        detail: "সক্রিয় ও প্রস্তুত (Active)"
      });
    }

    // 4. Bank IFSC & Merger Check
    const ifsc = (b.colAP || '').toUpperCase().trim();
    const bankName = (b.colAO || '').toUpperCase().trim();
    if (ifsc) {
      const ifscPrefix4 = ifsc.slice(0, 4);
      if (BANK_MERGER_MAP[ifscPrefix4]) {
        const merger = BANK_MERGER_MAP[ifscPrefix4];
        score -= 5;
        issues.push(`পুরাতন মার্জড ব্যাংক IFSC কোড সনাক্ত হয়েছে: ${ifsc} (${merger.oldBank})। নতুন ব্যাংক: ${merger.newBank} (IFSC প্রেফিক্স: ${merger.newIfscPrefix})।`);
        recommendations.push(`ব্যাংক শাখা থেকে বর্তমান সক্রিয় IFSC কোড (${merger.newBank}) সংগ্রহ করে সিস্টেমে আপডেট করুন যাতে মজুরি পেমেন্ট আটকে না যায়।`);
        complianceItems.push({
          label: "Bank IFSC",
          status: 'warning',
          detail: `মার্জড পুরাতন কোড (${merger.oldBank} ➔ ${merger.newBank})`
        });
      } else if (ifsc.length === 11 && ifsc[4] === '0') {
        complianceItems.push({
          label: "Bank IFSC",
          status: 'pass',
          detail: `${ifsc} (${bankName || 'Valid Format'})`
        });
      } else {
        score -= 10;
        issues.push(`IFSC কোডের বিন্যাস সঠিক নয় (${ifsc})। ১১ অক্ষরের বৈধ RBI কোড হওয়া আবশ্যক।`);
        complianceItems.push({
          label: "Bank IFSC",
          status: 'warning',
          detail: `অস্বাভাবিক কোড: ${ifsc}`
        });
      }
    } else {
      score -= 15;
      issues.push("ব্যাংক IFSC কোড এন্ট্রি করা হয়নি।");
      complianceItems.push({
        label: "Bank IFSC",
        status: 'fail',
        detail: "অনুপস্থিত (Missing)"
      });
    }

    // 5. Village & Sansad Verification (29 Villages & 16 Sansads)
    const village = (b.colV || '').toUpperCase().trim();
    const sansad = (b.colB || '').toUpperCase().trim();
    const isCanonicalVillage = CANONICAL_29_VILLAGES.some(v => v.toUpperCase() === village);
    const isCanonicalSansad = CANONICAL_16_SANSADS.some(s => s.toUpperCase() === sansad);

    if (!isCanonicalVillage && village) {
      issues.push(`গ্রামের নাম '${village}' বাথুয়ারী জিপির ২৯টি মূল তালিকার সাথে মিলছে না। স্পেলিং সংশোধন প্রয়োজন।`);
      recommendations.push("গ্রামের তালিকা থেকে সঠিক ড্রপডাউন সিলেক্ট করুন (যেমন: HATBAINCHA, BATHUARY, CHUAKHIA ইত্যাদি)।");
    }
    if (!isCanonicalSansad && sansad) {
      issues.push(`সংসদের নাম '${sansad}' বাথুয়ারী ১ থেকে ১৬ সংসদীয় কাঠামোর মধ্যে সরাসরি সনাক্ত হয়নি।`);
    }

    complianceItems.push({
      label: "GP Location",
      status: isCanonicalVillage && isCanonicalSansad ? 'pass' : 'warning',
      detail: `${village || 'No Village'} | ${sansad || 'No Sansad'}`
    });

    // 6. Deceased / Status Flag
    const isDead = (b.colT || '').toLowerCase().includes('death') || (b.colT || '').toLowerCase().includes('expired');
    if (isDead) {
      score = Math.min(score, 30);
      issues.push("নাগরিক মৃত্যুবরণ করেছেন (Col T: Death/Expired Marked)। এই কার্ডের জন্য সক্রিয় মজুরি দাবি নিষিদ্ধ।");
      recommendations.push("NREGASoft-এ কার্ড নিষ্ক্রিয় (Deactivate) করার প্রক্রিয়া শুরু করুন।");
      complianceItems.push({
        label: "Life Status",
        status: 'fail',
        detail: "নাগরিক প্রয়াত (Deceased)"
      });
    }

    // Determine Grade
    score = Math.max(0, Math.min(100, score));
    let grade: LocalAuditResult['grade'] = 'Action Needed';
    if (score >= 90) grade = 'A+';
    else if (score >= 75) grade = 'A';
    else if (score >= 60) grade = 'B';
    else if (score >= 45) grade = 'C';

    const summary = score >= 80 
      ? `এই রেকর্ডটি অত্যন্ত নির্ভুল এবং DBT মজুরি স্থানান্তরের জন্য প্রায় শতভাগ প্রস্তুত। স্কোর: ${score}/১০০।`
      : `এই রেকর্ডে কিছু গুরুত্বপূর্ণ তথ্যের অসঙ্গতি রয়েছে যা সমাধান না করলে সরকারি পেমেন্ট অথবা অডিট আপত্তি দেখা দিতে পারে। স্কোর: ${score}/১০০।`;

    return {
      score,
      grade,
      summary,
      issues,
      recommendations,
      complianceItems
    };
  };

  // Run audit on selected record
  const handleRunAudit = async () => {
    if (!auditTarget || isAuditing) return;
    setIsAuditing(true);

    // 1. Generate guaranteed instant local audit result
    const localEval = evaluateLocalAudit(auditTarget);

    try {
      // 2. Try server-side Gemini audit for extra insights
      const res = await fetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ beneficiary: auditTarget })
      });
      const raw = await res.text();
      let serverData: any = null;
      if (raw.trim().startsWith('{')) {
        try {
          serverData = JSON.parse(raw);
        } catch {}
      }

      if (serverData && typeof serverData.score === 'number') {
        setAuditResult({
          score: Math.round((serverData.score + localEval.score) / 2),
          grade: localEval.grade,
          summary: serverData.summary || localEval.summary,
          issues: Array.from(new Set([...(serverData.issues || []), ...localEval.issues])),
          recommendations: Array.from(new Set([...(serverData.recommendations || []), ...localEval.recommendations])),
          complianceItems: localEval.complianceItems
        });
      } else {
        setAuditResult(localEval);
      }
    } catch {
      // If server is unavailable, seamlessly display the full local evaluation
      setAuditResult(localEval);
    } finally {
      setIsAuditing(false);
    }
  };

  // Fast select next pending record
  const handleSelectPending = () => {
    const pending = beneficiaries.find(b => {
      const isDone = (b.colR || '').toUpperCase() === 'YES' || (b.colR || '').toUpperCase() === 'Y';
      return !isDone;
    });
    if (pending) {
      setAuditTarget(pending);
      setAuditResult(null);
    }
  };

  // Fast select random record
  const handleSelectRandom = () => {
    if (beneficiaries.length === 0) return;
    const randomIndex = Math.floor(Math.random() * beneficiaries.length);
    setAuditTarget(beneficiaries[randomIndex]);
    setAuditResult(null);
  };

  // Smart local fallback responses for the virtual helpdesk with 100% verified GP facts
  const getSmartLocalAnswer = (q: string): string => {
    const lower = q.toLowerCase();
    const isBengali = /[\u0980-\u09FF]/.test(q) || lower.includes('ki') || lower.includes('koto') || lower.includes('gram') || lower.includes('sansad');
    
    const pendingCount = beneficiaries.filter(b => {
      const isDone = (b.colR || '').toUpperCase() === 'YES' || (b.colR || '').toUpperCase() === 'Y';
      return !isDone;
    }).length;
    const doneCount = beneficiaries.length - pendingCount;
    const pct = beneficiaries.length > 0 ? Math.round((doneCount / beneficiaries.length) * 100) : 0;
    const deadCount = beneficiaries.filter(b => (b.colT || '').toLowerCase().includes('death') || (b.colT || '').toLowerCase().includes('expired')).length;

    const canonicalVillages = [
      "ASTICHAK", "BAMUNIABAR", "BARABHAGIA", "BAR BATHUARY", "BATHUARY",
      "BHANDERBERIA", "DAKSHINBAR", "DAKSHIN CHOUMUKH", "DAKSHIN PADMA",
      "DARBARKHANBAR", "DHALGODA", "GAGNA", "GANGADHARBAR", "HATBAINCHA",
      "JAGANNATHKARBAR", "JAMUALACHHIMPUR", "KASHMILI", "KANTHGANJ",
      "KISMAT BATHUARY", "KOTBAR", "KUMBHADHARBAR", "MACHHALBAR", "NALBAR",
      "NARUBHUNIYACHAK", "PAIKBAR", "PIRIJKHANBAR", "RAMCHAK", "UTTARKUNRI",
      "UTTAR PADMA"
    ];

    if (lower.includes('kyc') || lower.includes('ই-কেওয়াইসি') || lower.includes('pending') || lower.includes('বাকি') || lower.includes('done')) {
      if (isBengali) {
        return `বাথুয়ারী গ্রাম পঞ্চায়েতের (এগরা-২ ডেভেলপমেন্ট ব্লক, পূর্ব মেদিনীপুর) বর্তমান লাইভ পরিসংখ্যান:\n• মোট উপভোক্তা: ${beneficiaries.length} জন\n• সম্পন্ন ই-কেওয়াইসি (Done): ${doneCount} জন (${pct}%)\n• এখনো বাকি (Pending): ${pendingCount} জন\n• প্রয়াত/নিষ্ক্রিয় চিহ্নিত: ${deadCount} জন\n\nবাকি নাগরিকদের আধার কার্ড ও ব্যাংক পাসবুক নিয়ে গ্রাম পঞ্চায়েত কার্যালয় বা সংসদের ভিএলই (VLE)/জিআরএস (GRS)-এর সাথে যোগাযোগ করার পরামর্শ দেওয়া হচ্ছে।`;
      }
      return `Bathuary Gram Panchayat (Egra-II Development Block, Purba Medinipur) Live Status:\n• Total Beneficiaries: ${beneficiaries.length}\n• e-KYC Done: ${doneCount} (${pct}%)\n• e-KYC Pending: ${pendingCount}\n• Flagged Deceased: ${deadCount}\n\nPlease advise pending beneficiaries to visit the GP office or their Sansad VLE/GRS with Aadhaar card and Bank passbook.`;
    }

    if (lower.includes('abps') || lower.includes('এবিপিএস') || lower.includes('payment') || lower.includes('মজুরি') || lower.includes('wage')) {
      if (isBengali) {
        return `ABPS (Aadhaar Based Payment System) সক্রিয় করার নির্দেশিকা:\n১. উপভোক্তার ১২ সংখ্যার আধার নম্বর জব কার্ডে সিড থাকতে হবে।\n২. উপভোক্তার ব্যাংক একাউন্টে আধার লিঙ্ক ও NPCI (National Payments Corporation of India) ম্যাপারে সক্রিয় (Active DBT) থাকতে হবে।\n৩. যদি ব্যাংকে আধার লিঙ্ক না থাকে, তবে অবিলম্বে ব্যাংক শাখায় 'Aadhaar NPCI Mapping Consent Form' জমা দিতে হবে যাতে ১০০ দিনের কাজের মজুরি সরাসরি অ্যাকাউন্টে জমা হতে পারে।`;
      }
      return `ABPS (Aadhaar Based Payment System) Guidelines:\n1. 12-digit Aadhaar UID must be seeded to the Job Card.\n2. Beneficiary bank account must have Aadhaar seeded and active on NPCI DBT Mapper.\n3. If not enabled, visit the bank branch with Aadhaar and passbook to submit the Aadhaar NPCI Mapping Consent Form.`;
    }

    if (lower.includes('ifsc') || lower.includes('আইএফএসসি') || lower.includes('bank') || lower.includes('ব্যাংক') || lower.includes('united') || lower.includes('allahabad') || lower.includes('pnb')) {
      if (isBengali) {
        return `গুরুত্বপূর্ণ ব্যাংক মার্জার ও নতুন IFSC কোড তথ্য:\n• United Bank of India (UTBI...) ➔ পাঞ্জাব ন্যাশনাল ব্যাংক (PUNB...), যেমন এগরা শাখা: PUNB0019020\n• Allahabad Bank (ALLA...) ➔ ইন্ডিয়ান ব্যাংক (IDIB...), যেমন এগরা শাখা: IDIB000E503\n• Syndicate Bank (SYNB...) ➔ কানারা ব্যাংক (CNRB...)\n• Oriental Bank of Commerce (ORBC...) ➔ পাঞ্জাব ন্যাশনাল ব্যাংক (PUNB...)\n• Andhra Bank / Corporation Bank ➔ ইউনিয়ন ব্যাংক অফ ইন্ডিয়া (UBIN...)\nউপভোক্তাদের ব্যাংকের নতুন ও সক্রিয় IFSC কোড পোর্টালে প্রদান করা বাধ্যতামূলক।`;
      }
      return `Bank Merger & Updated IFSC Guide:\n• United Bank of India (UTBI...) merged into Punjab National Bank (PUNB...), e.g., Egra Branch: PUNB0019020\n• Allahabad Bank (ALLA...) merged into Indian Bank (IDIB...), e.g., Egra Branch: IDIB000E503\n• Syndicate Bank (SYNB...) merged into Canara Bank (CNRB...)\n• Oriental Bank of Commerce (ORBC...) merged into Punjab National Bank (PUNB...)\n• Andhra Bank / Corporation Bank merged into Union Bank of India (UBIN...)\nBeneficiaries must provide the active new IFSC code to prevent wage transfer bounce.`;
    }

    if (lower.includes('গ্রাম') || lower.includes('village') || lower.includes('সংসদ') || lower.includes('sansad')) {
      if (isBengali) {
        return `বাথুয়ারী গ্রাম পঞ্চায়েতে (এগরা-২ ডেভেলপমেন্ট ব্লক, পূর্ব মেদিনীপুর) মোট **২৯টি গ্রাম** এবং **১৬টি সংসদ** (BATHUARY 1 থেকে BATHUARY 16) রয়েছে।\n\n২৯টি গ্রামের সম্পূর্ণ তালিকা:\n${canonicalVillages.join(', ')}।\n\n(উল্লেখ্য: বাথুয়ারী গ্রাম পঞ্চায়েত পূর্ব মেদিনীপুর জেলার এগরা মহকুমার অন্তর্গত)।`;
      }
      return `Bathuary Gram Panchayat (Egra-II Development Block, Purba Medinipur) comprises **29 Canonical Villages** and **16 Sansads** (BATHUARY 1 to BATHUARY 16).\n\nOfficial 29 Villages:\n${canonicalVillages.join(', ')}.`;
    }

    if (lower.includes('office') || lower.includes('অফিস') || lower.includes('contact') || lower.includes('যোগাযোগ') || lower.includes('সময়') || lower.includes('timing') || lower.includes('কোথায়') || lower.includes('where')) {
      if (isBengali) {
        return `Bathuary Gram Panchayat Office Information:\n• Address: Vill+PO - Hatbaincha , P.S. - Egra, Block - Egra-II Development Block, District - Purba Medinipur, West Bengal - 721422.\n• Email: bathuarygp@gmail.com\n• Working Hours: Monday to Friday, 10:30 AM to 5:00 PM (except Govt Holidays).\n• Key Officials: Pradhan(Pramila Bar), Secretary (Suprabhat Parua), Nirman Sahayak (Prasun Mandal), GRS (Manik Das), VLE (Sk David)।`;
      }
      return `Bathuary Gram Panchayat Office Information:\n• Address: Vill+PO - Hatbaincha , P.S. - Egra, Block - Egra-II Development Block, District - Purba Medinipur, West Bengal - 721422.\n• Email: bathuarygp@gmail.com\n• Working Hours: Monday to Friday, 10:30 AM to 5:00 PM (except Govt Holidays).\n• Key Officials: Pradhan(Pramila Bar), Secretary (Suprabhat Parua), Nirman Sahayak (Prasun Mandal), GRS (Manik Das), VLE (Sk David).`;
    }

    if (isBengali) {
      return `নমস্কার! আমি বাথুয়ারী গ্রাম পঞ্চায়েত (এগরা-২ ডেভেলপমেন্ট ব্লক, পূর্ব মেদিনীপুর) ভার্চুয়াল এআই হেল্পডেস্ক অ্যাসিস্ট্যান্ট।\nবর্তমানে পোর্টালে মোট ${beneficiaries.length} জন উপভোক্তার তথ্য সংরক্ষিত রয়েছে (ই-কেওয়াইসি সম্পন্ন: ${doneCount} জন, বাকি: ${pendingCount} জন)।\nআপনি ২৯টি গ্রাম, ১৬টি সংসদ, আধার ও মোবাইল নম্বর আপডেট, ব্যাংক IFSC মার্জার, এবিপিএস (ABPS) বা অফিস সময় সম্পর্কে যেকোনো প্রশ্ন করতে পারেন।`;
    }
    return `Hello! I am the Bathuary Gram Panchayat (Egra-II Development Block, Purba Medinipur) Virtual AI Helpdesk Assistant.\nCurrently ${beneficiaries.length} beneficiaries are registered (${doneCount} e-KYC Done, ${pendingCount} Pending).\nYou can ask about the 29 villages, 16 Sansads, Aadhaar & Mobile update, Bank IFSC merger, ABPS activation, or office details.`;
  };

  // Send question with live database stats to server Gemini API
  const handleSendQuestion = async (qText?: string) => {
    const q = (qText || inputQuestion).trim();
    if (!q || isAsking) return;

    const userMsg = {
      sender: 'user' as const,
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsAsking(true);

    const pendingCount = beneficiaries.filter(b => {
      const isDone = (b.colR || '').toUpperCase() === 'YES' || (b.colR || '').toUpperCase() === 'Y';
      return !isDone;
    }).length;
    const doneCount = beneficiaries.length - pendingCount;
    const deadCount = beneficiaries.filter(b => (b.colT || '').toLowerCase().includes('death') || (b.colT || '').toLowerCase().includes('expired')).length;
    const abpsCount = beneficiaries.filter(b => (b.colO || '').toUpperCase() === 'YES' || (b.colO || '').toUpperCase() === 'Y').length;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ 
          question: q,
          stats: {
            total: beneficiaries.length,
            done: doneCount,
            pending: pendingCount,
            dead: deadCount,
            abps: abpsCount,
            villages: 29,
            sansads: 16
          }
        })
      });
      const raw = await res.text();
      let reply = '';
      if (raw.trim().startsWith('{')) {
        try {
          const data = JSON.parse(raw);
          if (data && data.reply) {
            reply = data.reply;
          }
        } catch {}
      }

      if (!reply) {
        reply = getSmartLocalAnswer(q);
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai' as const,
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      // Offline or network fallback
      const reply = getSmartLocalAnswer(q);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai' as const,
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const sampleQuestions = [
    "আমার পঞ্চায়েতে মোট কতজনের ই-কেওয়াইসি বাকি আছে?",
    "How to enable ABPS for Job Card wage payment?",
    "Updated IFSC codes for United Bank & Allahabad Bank?",
    "বাথুয়ারী জিপির মোট ২৯টি গ্রাম ও ১৬টি সংসদ কি কি?",
    "Official contact & office timing for Bathuary GP?"
  ];

  return (
    <div className="space-y-6">
      {/* Top AI Intelligence Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-950 text-white p-6 sm:p-7 shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-teal-300 via-sky-400 to-indigo-400 absolute top-0 left-0" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Gram Panchayat AI Verifier & Intelligence Assistant
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider">
                  Active v3.0
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Deep analysis of NREGASoft records across 29 Villages & 16 Sansads, 12-digit Aadhaar UID conformity, RBI Bank merger IFSC resolution & instant bilingual citizen helpline.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-right">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Beneficiaries</span>
              <span className="text-base font-black text-emerald-400 font-mono">{beneficiaries.length}</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-right">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Villages / Sansads</span>
              <span className="text-xs font-black text-teal-300 font-mono mt-0.5 block">29 Vill / 16 San</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: AI Data Quality & Compliance Auditor */}
        <div className="rounded-3xl bg-gradient-to-br from-white via-slate-50 to-emerald-50/20 border-2 border-slate-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-emerald-500 absolute top-0 left-0" />
          
          <div>
            <div className="flex items-center justify-between gap-3 mb-5 border-b border-slate-200/80 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Smart AI Data Quality Auditor
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Automated rule & AI verification for Aadhaar UID, Bank IFSC, and ABPS linkage.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-black text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300">
                Live Engine
              </span>
            </div>

            {/* Quick Actions Selector Bar */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-black text-slate-800">Select Beneficiary:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleSelectPending}
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-all cursor-pointer flex items-center gap-1"
                  title="Next Pending e-KYC record"
                >
                  <Clock className="w-3 h-3" />
                  <span>Next Pending</span>
                </button>
                <button
                  type="button"
                  onClick={handleSelectRandom}
                  className="text-[11px] font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 transition-all cursor-pointer flex items-center gap-1"
                  title="Random beneficiary record"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>Random</span>
                </button>
              </div>
            </div>

            {/* Search filter for selecting beneficiary */}
            <div className="mb-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Type name, Job Card, village or Aadhaar to filter..."
                  value={recordSearch}
                  onChange={(e) => setRecordSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Record Selector Dropdown */}
            <div className="mb-4">
              <select
                value={auditTarget ? `${auditTarget.colH}-${auditTarget.colJ}` : ''}
                onChange={(e) => {
                  const match = beneficiaries.find(b => `${b.colH}-${b.colJ}` === e.target.value);
                  setAuditTarget(match || null);
                  setAuditResult(null);
                }}
                className="w-full bg-white text-slate-900 text-xs sm:text-sm font-bold rounded-xl px-3.5 py-2.5 border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-all cursor-pointer shadow-2xs"
              >
                {candidateBeneficiaries.map((b, i) => (
                  <option key={`${b.colH}-${i}`} value={`${b.colH}-${b.colJ}`}>
                    {b.colJ} ({b.colH}) - {b.colV} [e-KYC: {b.colR || 'NO'}]
                  </option>
                ))}
                {candidateBeneficiaries.length === 0 && (
                  <option value="">No matching beneficiary found</option>
                )}
              </select>
            </div>

            {/* Selected Beneficiary Summary Card */}
            {auditTarget && (
              <div className="p-4 rounded-2xl bg-white border-2 border-slate-200/80 text-xs space-y-2 mb-4 shadow-2xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">Applicant Name:</span>
                  <span className="font-black text-slate-900 text-sm">{auditTarget.colJ}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">Job Card Number:</span>
                  <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">{auditTarget.colH}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">Village & Sansad:</span>
                  <span className="font-bold text-slate-800">{auditTarget.colV || "—"} | {auditTarget.colB || "—"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">Aadhaar (Col P):</span>
                  <span className="font-mono font-bold text-slate-800">
                    {auditTarget.colP ? `${auditTarget.colP.slice(0, 4)} •••• ${auditTarget.colP.slice(-4)}` : "Not Provided ✕"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">Bank & IFSC:</span>
                  <span className="font-bold text-slate-800">{auditTarget.colAO || "—"} ({auditTarget.colAP || "—"})</span>
                </div>
              </div>
            )}

            {/* Audit Results Presentation */}
            {auditResult && (
              <div className="space-y-3 animate-in fade-in duration-300">
                {/* Score badge */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-6 h-6 text-emerald-700" />
                    <div>
                      <span className="text-xs font-black text-emerald-950 block">Compliance Index:</span>
                      <span className="text-[11px] text-emerald-800 font-medium">
                        {auditResult.score >= 80 ? 'Compliant for DBT Wage disbursement' : 'Action required before next muster roll'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-black font-mono ${auditResult.score >= 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {auditResult.score}/100
                    </span>
                    <span className={`block text-[10px] font-black uppercase ${auditResult.score >= 80 ? 'text-emerald-800' : 'text-amber-800'}`}>
                      Grade {auditResult.grade}
                    </span>
                  </div>
                </div>

                {/* Compliance checklist pills */}
                <div className="grid grid-cols-2 gap-2">
                  {auditResult.complianceItems?.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between shadow-2xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">{item.label}</span>
                        <span className="text-xs font-bold text-slate-800 truncate block max-w-[130px]">{item.detail}</span>
                      </div>
                      {item.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {item.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                      {item.status === 'fail' && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                    </div>
                  ))}
                </div>

                {auditResult.summary && (
                  <p className="text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200 font-medium leading-relaxed">
                    {auditResult.summary}
                  </p>
                )}

                {auditResult.issues && auditResult.issues.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-xs text-rose-900 space-y-1.5 shadow-2xs">
                    <div className="flex items-center gap-1.5 font-black text-rose-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Identified Issues & Inconsistencies:</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-xs font-medium">
                      {auditResult.issues.map((iss: string, idx: number) => (
                        <li key={idx}>{iss}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {auditResult.recommendations && auditResult.recommendations.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-xs text-emerald-900 space-y-1.5 shadow-2xs">
                    <div className="flex items-center gap-1.5 font-black text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Recommendations & Field Officer Actions:</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-xs font-medium">
                      {auditResult.recommendations.map((rec: string, idx: number) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleRunAudit}
            disabled={!auditTarget || isAuditing}
            className="w-full mt-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer hover:shadow-xl active:scale-[0.99]"
          >
            <Sparkles className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? "Verifying Record with AI..." : "Run AI Data Audit & Verification"}</span>
          </button>
        </div>

        {/* Panel 2: Interactive AI Assistant Chat */}
        <div className="rounded-3xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/20 border-2 border-slate-200 p-6 sm:p-7 shadow-sm flex flex-col h-[650px] relative overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-blue-500 absolute top-0 left-0" />
          
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-3.5 border-b border-slate-200/80 pb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Bathuary GP Virtual AI Helpdesk
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Instant answers & NREGA guideline assistance (বাংলা ও English)
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>

          {/* Sample Questions Chips */}
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {sampleQuestions.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSendQuestion(sq)}
                className="text-[11px] bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 px-3 py-1.5 rounded-full border border-slate-200 hover:border-indigo-300 transition-all font-semibold cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-tr-none'
                      : 'bg-white text-slate-800 border-2 border-slate-200/80 rounded-tl-none font-normal'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <span className={`block text-[9px] text-right mt-1.5 font-mono ${m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {m.time}
                  </span>
                </div>
                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {isAsking && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 text-indigo-700 text-xs font-bold animate-pulse shadow-2xs">
                <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
                <span>AI assistant is querying Bathuary records...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="pt-3.5 border-t border-slate-200/80 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask a question in বাংলা or English (e.g. how to enable ABPS)..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion()}
              className="flex-1 bg-white text-slate-900 text-xs sm:text-sm font-semibold rounded-full px-4 py-2.5 border-2 border-slate-200 focus:border-indigo-500 focus:outline-none shadow-2xs"
            />
            <button
              onClick={() => handleSendQuestion()}
              disabled={!inputQuestion.trim() || isAsking}
              className="p-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold transition-all disabled:opacity-50 cursor-pointer shadow-md hover:shadow-lg active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
