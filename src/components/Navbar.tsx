import React from 'react';
import { Check, ShieldCheck, User } from 'lucide-react';

interface NavbarProps {
  onOpenRoleSelector: () => void;
  onNavigateSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRoleSelector, onNavigateSection }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onNavigateSection('home')}>
          <div className="w-8 h-8 rounded-lg bg-[#006194] flex items-center justify-center text-white shadow-sm shadow-sky-600/20">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[17px] font-bold tracking-tight text-slate-900 leading-tight">
              WawancaraAI
            </span>
            <span className="text-[11px] font-normal text-slate-500 leading-none">
              Latihan Wawancara Pasti Sukses
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigateSection('home')}
            className="hover:text-slate-900 transition-colors"
          >
            Beranda
          </button>
          <button
            onClick={() => onNavigateSection('features')}
            className="hover:text-slate-900 transition-colors"
          >
            Fitur
          </button>
          <button
            onClick={() => onNavigateSection('how-it-works')}
            className="hover:text-slate-900 transition-colors"
          >
            Cara Kerja
          </button>
          <button
            onClick={() => onNavigateSection('testimonials')}
            className="hover:text-slate-900 transition-colors"
          >
            Testimoni
          </button>
          <button
            onClick={() => onNavigateSection('faq')}
            className="hover:text-slate-900 transition-colors"
          >
            FAQ
          </button>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Free Sessions Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50/80 border border-sky-200 text-sky-800 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Kuota Gratis: <strong className="font-bold text-sky-950">3 Sesi</strong></span>
          </div>

          {/* Login button */}
          <button
            onClick={() => alert('Fitur akun pengguna & sinkronisasi portofolio sesi wawancara.')}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors"
          >
            Masuk
          </button>

          {/* Start Simulation Primary Button */}
          <button
            onClick={onOpenRoleSelector}
            className="bg-[#006194] hover:bg-[#004f7b] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-sm active:scale-95"
          >
            Mulai Simulasi
          </button>

          {/* User Icon Circle */}
          <button
            onClick={() => alert('Profil Pengguna: Kandidat Premium (Lead Product Manager)')}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 transition-colors"
            title="Profil Pengguna"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
