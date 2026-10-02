import React from 'react';
import { Check, Sparkles } from 'lucide-react';

interface FooterProps {
  onSelectRoleByName?: (roleName: string) => void;
  onNavigateSection?: (section: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectRoleByName, onNavigateSection }) => {
  return (
    <footer className="bg-white border-t border-slate-200/90 mt-16 pt-12 pb-10 text-slate-600">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-100">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#006194] flex items-center justify-center text-white shadow-xs">
                <Check className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                WawancaraAI
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Platform latihan simulasi wawancara kerja berbasis kecerdasan buatan terdepan.
              Evaluasi performa suara, ketepatan jawaban STAR, dan bangun kepercayaan diri sebelum
              menghadapi rekruter impian.
            </p>

            {/* Powered by Gemini Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Didukung Gemini AI</span>
            </div>
          </div>

          {/* Column 1: Eksplorasi */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Eksplorasi
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateSection?.('home')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('features')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Fitur Unggulan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('how-it-works')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Cara Kerja
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('start')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Mulai Simulasi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('pricing')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Paket Berlangganan
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Posisi Pekerjaan */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Posisi Pekerjaan
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectRoleByName?.('Software Engineer')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Software Engineer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRoleByName?.('Product Manager')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Product Manager
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRoleByName?.('UI/UX Designer')}
                  className="hover:text-slate-900 transition-colors"
                >
                  UI/UX Designer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRoleByName?.('Digital Marketing')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Digital Marketing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectRoleByName?.('Data Analyst')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Data Analyst
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Dukungan & Legal */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Dukungan & Legal
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateSection?.('faq')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Pusat Bantuan & FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Hubungi kami di support@wawancara.ai')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Hubungi Kami
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Kebijakan Privasi: Data suara diproses terenkripsi.')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Kebijakan Privasi
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Syarat & Ketentuan Layanan Simulasi AI.')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Syarat & Ketentuan
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Keamanan Data Suara: Sesuai standar ISO/IEC 27001.')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Keamanan Data Suara
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>&copy; {new Date().getFullYear()} WawancaraAI. Hak cipta dilindungi.</span>
          <div className="flex items-center gap-4">
            <span>Server: Asia-Southeast (Jakarta)</span>
            <span>·</span>
            <span>Versi AI: Gemini 3.8 Flash</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
