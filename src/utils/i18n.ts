export type AppLanguage = 'bn' | 'en';

export interface Translations {
  // Brand & Header
  govtOfWb: string;
  deptName: string;
  panchayatName: string;
  blockDistrict: string;
  portalSubtitle: string;
  livePortal: string;
  liveSheetSync: string;
  syncBtn: string;
  syncingBtn: string;
  logoutBtn: string;
  loggedInAs: string;

  // Tabs / Navigation
  dashboardTab: string;
  dashboardSub: string;
  searchTab: string;
  searchSub: string;
  dataFormTab: string;
  dataFormSub: string;
  reportsTab: string;
  reportsSub: string;
  aiTab: string;
  aiSub: string;
  deployTab: string;
  deploySub: string;
  securityTab: string;
  securitySub: string;

  // Login Page
  loginTitle: string;
  loginSubtitle: string;
  loginGateway: string;
  usernameLabel: string;
  usernamePlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  rememberMe: string;
  loginSubmit: string;
  loginVerifying: string;
  changePasswordLink: string;
  changePasswordTitle: string;
  currentPasswordLabel: string;
  newPasswordLabel: string;
  confirmPasswordLabel: string;
  saveNewPassword: string;
  cancelBtn: string;
  invalidCredentialsMsg: string;
  loginSuccessMsg: string;
  sessionTimeoutMsg: string;

  // Common UI
  searchPlaceholder: string;
  totalBeneficiaries: string;
  totalJobCards: string;
  kycDone: string;
  kycPending: string;
  abpsActive: string;
  allVillages: string;
  allSansads: string;
  filterByVillage: string;
  filterBySansad: string;
  actionPrintSlip: string;
  actionUpdate: string;
  statusActive: string;
  statusPending: string;
  exportPdf: string;
  exportExcel: string;
  printReceipt: string;
  languageToggle: string;
}

export const I18N_STRINGS: Record<AppLanguage, Translations> = {
  bn: {
    govtOfWb: 'পশ্চিমবঙ্গ সরকার',
    deptName: 'পঞ্চায়েত ও গ্রামোন্নয়ন দপ্তর',
    panchayatName: 'বাথুয়ারী গ্রাম পঞ্চায়েত',
    blockDistrict: 'এগ্রা-২ উন্নয়ন ব্লক • পূর্ব মেদিনীপুর',
    portalSubtitle: 'বাথুয়ারী গ্রাম পঞ্চায়েত • ১২৫ দিনের কাজ ও আধার e-KYC প্রশাসন পোর্টাল',
    livePortal: 'লাইভ পোর্টাল',
    liveSheetSync: 'লাইভ শিট অটো-সিঙ্ক',
    syncBtn: 'সিঙ্ক (SYNC)',
    syncingBtn: 'সিঙ্ক হচ্ছে...',
    logoutBtn: 'লগআউট',
    loggedInAs: 'লগইন আছেন:',

    dashboardTab: 'অ্যানালিটিক্স ড্যাশবোর্ড',
    dashboardSub: 'সারসংক্ষেপ ও ২৯টি গ্রাম',
    searchTab: 'নাগরিক অনুসন্ধান কর্নার',
    searchSub: 'জব কার্ড ও আধার অনুসন্ধান',
    dataFormTab: 'ডাটা আপডেট ফর্ম',
    dataFormSub: 'ফিল্ড অফিসার e-KYC এন্ট্রি',
    reportsTab: 'গ্রাম রিপোর্ট ও PDF',
    reportsSub: 'অফিসিয়াল স্লিপ ও তালিকা',
    aiTab: 'AI ভেরিফায়ার সহকারী',
    aiSub: 'অডিট ও যোগ্যতা যাচাই',
    deployTab: 'ডেপ্লয়মেন্ট গাইড',
    deploySub: 'হোস্টিং ও সার্ভার নির্দেশিকা',
    securityTab: 'নিরাপত্তা ও প্রাইভেসি',
    securitySub: 'আধার ও তথ্য সুরক্ষা',

    loginTitle: 'অফিসিয়াল অ্যাডমিন লগইন',
    loginSubtitle: 'বাথুয়ারী গ্রাম পঞ্চায়েত • ১২৫ দিনের কাজ ও আধার e-KYC প্রশাসন পোর্টাল',
    loginGateway: 'BATHUARY GRAM PANCHAYAT OFFICIAL GATEWAY',
    usernameLabel: 'অফিসিয়াল ইউজার আইডি (Username)',
    usernamePlaceholder: 'ইউজার আইডি লিখুন...',
    passwordLabel: 'পাসওয়ার্ড (Password)',
    passwordPlaceholder: 'পাসওয়ার্ড লিখুন...',
    rememberMe: 'আমার ইউজার আইডি মনে রাখুন (Remember Me)',
    loginSubmit: 'পোর্টালে লগইন করুন • LOGIN TO PORTAL',
    loginVerifying: 'যাচাই করা হচ্ছে (Verifying)...',
    changePasswordLink: 'পাসওয়ার্ড পরিবর্তন? (Change Password)',
    changePasswordTitle: 'পাসওয়ার্ড পরিবর্তন করুন',
    currentPasswordLabel: 'বর্তমান পাসওয়ার্ড',
    newPasswordLabel: 'নতুন পাসওয়ার্ড',
    confirmPasswordLabel: 'নতুন পাসওয়ার্ড নিশ্চিত করুন',
    saveNewPassword: 'পাসওয়ার্ড পরিবর্তন সংরক্ষণ করুন',
    cancelBtn: 'বাতিল',
    invalidCredentialsMsg: 'ভুল ইউজারনেম বা পাসওয়ার্ড! অনুগ্রহ করে সঠিক তথ্য দিন।',
    loginSuccessMsg: 'লগইন সফল হয়েছে! পোর্টালে প্রবেশ করা হচ্ছে...',
    sessionTimeoutMsg: 'নিরাপত্তা বিজ্ঞপ্তি: দীর্ঘক্ষণ নিষ্ক্রিয় থাকা বা ব্রাউজার বন্ধ করার কারণে সেশন শেষ হয়েছে। অনুগ্রহ করে পুনরায় লগইন করুন।',

    searchPlaceholder: 'নাম, জব কার্ড নম্বর, আধার শেষ ৪ সংখ্যা বা মোবাইল দিয়ে খুঁজুন...',
    totalBeneficiaries: 'মোট উপভোক্তা',
    totalJobCards: 'মোট জব কার্ড',
    kycDone: 'e-KYC সম্পন্ন',
    kycPending: 'e-KYC বাকি',
    abpsActive: 'ABPS সক্রিয়',
    allVillages: 'সকল ২৯টি গ্রাম',
    allSansads: 'সকল ১৬টি সংসদ',
    filterByVillage: 'গ্রাম অনুযায়ী ফিল্টার',
    filterBySansad: 'সংসদ অনুযায়ী ফিল্টার',
    actionPrintSlip: 'স্লিপ প্রিন্ট',
    actionUpdate: 'তথ্য আপডেট',
    statusActive: 'সক্রিয়',
    statusPending: 'বাকি',
    exportPdf: 'PDF ডাউনলোড',
    exportExcel: 'এক্সেল এক্সপোর্ট',
    printReceipt: 'রসিদ প্রিন্ট করুন',
    languageToggle: 'Language: বাংলা'
  },
  en: {
    govtOfWb: 'Govt. of West Bengal',
    deptName: 'Panchayats & Rural Development Dept.',
    panchayatName: 'Bathuary Gram Panchayat',
    blockDistrict: 'Egra-II Development Block • Purba Medinipur',
    portalSubtitle: 'Bathuary Gram Panchayat • 125-Day Work & Aadhaar e-KYC Portal',
    livePortal: 'Live Portal',
    liveSheetSync: 'Live Sheet Auto-Sync',
    syncBtn: 'SYNC',
    syncingBtn: 'Syncing...',
    logoutBtn: 'Logout',
    loggedInAs: 'Logged In:',

    dashboardTab: 'Analytics Dashboard',
    dashboardSub: 'Overview & 29 Villages',
    searchTab: 'Citizen Search Corner',
    searchSub: 'Job Card & Aadhaar Search',
    dataFormTab: 'Data Update Form',
    dataFormSub: 'Field Officer e-KYC Entry',
    reportsTab: 'Village Report & PDF',
    reportsSub: 'Official PDF Slips & Lists',
    aiTab: 'AI Verifier Assistant',
    aiSub: 'Audit & Eligibility Check',
    deployTab: 'Deployment Guide',
    deploySub: 'Hosting & Server Manual',
    securityTab: 'Security & Privacy',
    securitySub: 'Aadhaar & Data Protection',

    loginTitle: 'Official Admin Login',
    loginSubtitle: 'Bathuary Gram Panchayat • 125-Day Work & Aadhaar e-KYC Admin Portal',
    loginGateway: 'BATHUARY GRAM PANCHAYAT OFFICIAL GATEWAY',
    usernameLabel: 'Official User ID (Username)',
    usernamePlaceholder: 'Enter User ID...',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter Password...',
    rememberMe: 'Remember User ID on this device',
    loginSubmit: 'LOGIN TO PORTAL',
    loginVerifying: 'Verifying Credentials...',
    changePasswordLink: 'Change Password?',
    changePasswordTitle: 'Change Official Login Password',
    currentPasswordLabel: 'Current Password',
    newPasswordLabel: 'New Password',
    confirmPasswordLabel: 'Confirm New Password',
    saveNewPassword: 'Save New Password',
    cancelBtn: 'Cancel',
    invalidCredentialsMsg: 'Invalid Username or Password! Please provide correct credentials.',
    loginSuccessMsg: 'Login successful! Redirecting to portal...',
    sessionTimeoutMsg: 'Security Alert: Session timed out due to inactivity or tab closure. Please log in again.',

    searchPlaceholder: 'Search by Name, Job Card No, Aadhaar last 4 digits, or Mobile...',
    totalBeneficiaries: 'Total Beneficiaries',
    totalJobCards: 'Unique Job Cards',
    kycDone: 'e-KYC Completed',
    kycPending: 'e-KYC Pending',
    abpsActive: 'ABPS Active',
    allVillages: 'All 29 Villages',
    allSansads: 'All 16 Sansads',
    filterByVillage: 'Filter by Village',
    filterBySansad: 'Filter by Sansad',
    actionPrintSlip: 'Print Slip',
    actionUpdate: 'Update Data',
    statusActive: 'Active',
    statusPending: 'Pending',
    exportPdf: 'Download PDF',
    exportExcel: 'Export Excel',
    printReceipt: 'Print Official Receipt',
    languageToggle: 'Language: English'
  }
};
