import React from 'react';
import { Languages } from 'lucide-react';
import { AppLanguage } from '../utils/i18n';

interface LanguageSwitchProps {
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  className?: string;
  variant?: 'header' | 'login' | 'sidebar';
}

export const LanguageSwitch: React.FC<LanguageSwitchProps> = ({
  language,
  onLanguageChange,
  className = '',
  variant = 'header'
}) => {
  const toggleLanguage = () => {
    onLanguageChange(language === 'bn' ? 'en' : 'bn');
  };

  if (variant === 'login') {
    return (
      <div className={`inline-flex items-center rounded-full bg-orange-100/80 p-1 border border-orange-300/80 shadow-xs backdrop-blur-xs ${className}`}>
        <button
          type="button"
          onClick={() => onLanguageChange('bn')}
          className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
            language === 'bn'
              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs'
              : 'text-amber-900 hover:text-orange-700'
          }`}
          title="বাংলা ভাষায় দেখুন"
          aria-pressed={language === 'bn'}
        >
          বাংলা (BN)
        </button>
        <button
          type="button"
          onClick={() => onLanguageChange('en')}
          className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
            language === 'en'
              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs'
              : 'text-amber-900 hover:text-orange-700'
          }`}
          title="Switch to English"
          aria-pressed={language === 'en'}
        >
          English (EN)
        </button>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 ${className}`}>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Languages className="w-4 h-4 text-emerald-400" />
          <span>ভাষা / Language</span>
        </div>
        <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-700">
          <button
            type="button"
            onClick={() => onLanguageChange('bn')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              language === 'bn'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            BN
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>
      </div>
    );
  }

  // Header variant (compact, vibrant, fits alongside sync buttons)
  return (
    <div
      className={`inline-flex items-center bg-slate-900/90 hover:bg-slate-900 border border-slate-700/90 p-0.5 rounded-xl shadow-xs transition-all ${className}`}
      title={language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
    >
      <div className="flex items-center pl-2 pr-1 text-slate-400 pointer-events-none">
        <Languages className="w-3.5 h-3.5 text-amber-400" />
      </div>
      <button
        type="button"
        id="lang-switch-bn"
        onClick={() => onLanguageChange('bn')}
        className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
          language === 'bn'
            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs scale-[1.02]'
            : 'text-slate-300 hover:text-white'
        }`}
        aria-pressed={language === 'bn'}
      >
        BN
      </button>
      <button
        type="button"
        id="lang-switch-en"
        onClick={() => onLanguageChange('en')}
        className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs scale-[1.02]'
            : 'text-slate-300 hover:text-white'
        }`}
        aria-pressed={language === 'en'}
      >
        EN
      </button>
    </div>
  );
};
