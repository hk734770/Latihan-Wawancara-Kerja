import React from 'react';
import { X, Briefcase, Check, ArrowRight } from 'lucide-react';
import { AVAILABLE_ROLES } from '../data/mockQuestions';

interface RoleSelectorModalProps {
  isOpen: boolean;
  currentRoleTitle: string;
  onSelectRole: (role: typeof AVAILABLE_ROLES[0]) => void;
  onClose: () => void;
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({
  isOpen,
  currentRoleTitle,
  onSelectRole,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
              <Briefcase className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Pilih Posisi Wawancara</h3>
              <p className="text-xs text-slate-500">Bank simulasi pertanyaan FAANG & Unicorn</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {AVAILABLE_ROLES.map((role) => {
            const isSelected = role.title.toLowerCase().includes(currentRoleTitle.toLowerCase().split(' ')[0]);

            return (
              <div
                key={role.id}
                onClick={() => {
                  onSelectRole(role);
                  onClose();
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/40 ring-1 ring-sky-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{role.title}</span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {role.code}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-sky-600 shrink-0" />}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                  <span>Level: <strong className="text-slate-700">{role.level}</strong></span>
                  <span>·</span>
                  <span>Durasi: {role.duration}</span>
                  <span>·</span>
                  <span>{role.totalQuestions} Pertanyaan</span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {role.topics.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Semua simulasi menggunakan standar evaluasi STAR real-time.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#006194] text-white font-semibold hover:bg-[#004f7b] transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
