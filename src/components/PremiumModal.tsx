import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Check,
  Copy,
  Mail,
  ShieldCheck,
  Sparkles,
  Zap,
  Crown,
  RotateCcw,
} from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetQuota?: () => Promise<void>;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  onResetQuota,
}) => {
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [refreshed, setRefreshed] = useState<boolean>(false);

  const SUPPORT_EMAIL = 'support@vibecast.studio';

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch (e) {
      console.warn('Copy Email failed', e);
    }
  };

  const handleInstantRefresh = async () => {
    if (onResetQuota) {
      await onResetQuota();
    }
    setRefreshed(true);
    setTimeout(() => setRefreshed(false), 2500);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="VibeCast Studio Pro & Allowance"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 overflow-y-auto overscroll-contain"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#101914]/[0.98] rounded-2xl sm:rounded-[28px] shadow-[0_24px_70px_rgba(0,0,0,0.85)] overflow-hidden max-h-[90dvh] flex flex-col border border-white/20 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-black/45 text-white px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#E14B5A] text-white flex items-center justify-center shadow-md border border-white/20 flex-shrink-0">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-[#F0C05A] fill-[#F0C05A]" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-bold-italic text-xl sm:text-2xl tracking-tight text-white">VibeCast</span>
                <span className="font-syne font-black text-[10px] uppercase tracking-widest text-[#F0C05A]">
                  · STUDIO PRO
                </span>
              </div>
              <p className="text-xs text-white/65 truncate">
                24kHz Voice Synthesis Allowance &amp; Studio Support
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-8 overflow-y-auto overscroll-contain flex-1 min-h-0 space-y-5 sm:space-y-6">
          {/* Studio Perks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Zap className="w-4 h-4 text-[#F0C05A] flex-shrink-0" />
                <span>Daily Quota</span>
              </div>
              <p className="text-[11px] text-white/65 leading-relaxed">
                Refresh your 2,000 daily character allowance anytime for testing.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>24kHz Master Audio</span>
              </div>
              <p className="text-[11px] text-white/65 leading-relaxed">
                Export lossless WAV, MP3, OGG, and AAC takes with zero watermarks.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-[#FF8A98] flex-shrink-0" />
                <span>Voice Lock</span>
              </div>
              <p className="text-[11px] text-white/65 leading-relaxed">
                Keep consistent vocal identity across Hindi, Hinglish, and English scripts.
              </p>
            </div>
          </div>

          {/* Instant Studio Allowance Refresh */}
          <div className="bg-black/35 border border-white/12 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-sm font-bold font-fraunces text-white">
                  Instant Daily Allowance Refill
                </h4>
                <p className="text-xs text-white/65 mt-0.5">
                  Need more characters right now? Refill your daily studio character quota immediately.
                </p>
              </div>
              <button
                type="button"
                onClick={handleInstantRefresh}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#2E4E3B] hover:bg-[#254030] border border-emerald-400/35 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 touch-manipulation"
              >
                {refreshed ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Quota Refilled</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 text-emerald-300" />
                    <span>Refill 2,000 Chars</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Contact & Support Box */}
          <div className="bg-white/[0.03] border border-white/12 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#FF8A98] flex-shrink-0" />
              <h4 className="text-sm font-bold font-fraunces text-white">
                Studio Support &amp; Custom Voice Inquiries
              </h4>
            </div>

            <p className="text-xs text-white/65 leading-relaxed">
              For enterprise voiceover pipelines, custom voice calibration, or studio feedback, reach out to the VibeCast team.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl bg-black/35 border border-white/10">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#E14B5A]/20 text-[#FF8A98] border border-[#E14B5A]/30 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  @
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-white/50 block">
                    Studio Contact
                  </span>
                  <span className="font-mono-numbers font-bold text-xs sm:text-sm text-white break-all">
                    {SUPPORT_EMAIL}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/12 flex items-center gap-1.5 transition-colors cursor-pointer touch-manipulation"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-black/45 px-4 sm:px-8 py-3.5 border-t border-white/10 flex items-center justify-between gap-2 text-xs text-white/60 flex-shrink-0">
          <span className="font-mono-numbers truncate">
            VibeCast Studio · 24kHz Audio Workstation
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-[#FF8A98] hover:text-white transition-colors cursor-pointer px-2 py-1 touch-manipulation flex-shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
