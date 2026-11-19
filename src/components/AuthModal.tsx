import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  Loader2,
  AlertCircle,
  Zap,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    user,
    signInWithGoogle,
    signInAsGuest,
  } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isGuestSession = user?.uid === 'local-studio-creator';

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg(null);
    setIsLoading(false);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      const code = err?.code || '';
      const msg = err?.message || '';

      if (code === 'auth/popup-closed-by-user' || msg.includes('popup-closed-by-user')) {
        setIsLoading(false);
        return;
      }

      if (code === 'auth/popup-blocked' || msg.includes('popup-blocked')) {
        setErrorMsg(
          'Your browser blocked the Google sign-in popup. Please allow popups for this site and tap "Sign In with Google" again.'
        );
      } else if (code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
        setErrorMsg(
          'Google sign-in popup is restricted on this preview domain. You can continue using Instant Studio Pass or test Google OAuth on an authorized domain.'
        );
      } else {
        setErrorMsg('Could not complete Google sign-in. Please allow popups and try again, or continue with Instant Studio Pass.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await signInAsGuest();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Could not start studio session.');
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="VibeCast Studio Account and Google Cloud Sync"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 overflow-y-auto overscroll-contain"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md max-h-[90dvh] bg-[#101914]/[0.98] border border-white/20 rounded-2xl sm:rounded-[28px] shadow-[0_24px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col text-white my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-black/45 text-white px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#E14B5A] text-white flex items-center justify-center shadow-md border border-white/20 shrink-0">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-bold-italic text-lg sm:text-xl text-white">VibeCast</span>
                <span className="text-[10px] uppercase font-mono-numbers font-bold text-[#F0C05A]">
                  · {isGuestSession ? 'CLOUD SYNC' : 'STUDIO ACCESS'}
                </span>
              </div>
              <p className="text-xs text-white/65 truncate">
                {isGuestSession
                  ? 'Link your Google account to sync your Local Vault'
                  : 'Start your voice synthesis session'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Quota Banner */}
        <div className="bg-white/[0.04] px-4 sm:px-6 py-2.5 sm:py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <span className="flex items-center gap-1.5 font-semibold text-white/90">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8A98] shrink-0" />
            <span>2,000 Daily Characters · 24kHz Audio</span>
          </span>
          <span className="font-mono-numbers text-[11px] text-emerald-300 font-bold">
            Free Tier
          </span>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto overscroll-contain flex-1 min-h-0">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-400/35 text-xs text-rose-100 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {isGuestSession ? (
            <>
              {/* Prominent Google OAuth CTA when linking from Local Vault / Guest Pass */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#2E4E3B] hover:bg-[#254030] border border-emerald-400/45 text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer active:scale-[0.99] touch-manipulation"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                )}
                <span>Sign In with Google (Auto-Merge Studio Vault)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/85 font-semibold text-xs flex items-center justify-center gap-2 border border-white/15 transition-all cursor-pointer touch-manipulation"
              >
                <Zap className="w-4 h-4 text-[#F0C05A] shrink-0" />
                <span>Continue with Local Studio Vault</span>
              </button>
            </>
          ) : (
            <>
              {/* Primary 1-Click Studio Pass */}
              <button
                type="button"
                onClick={handleGuestSignIn}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#2E4E3B] hover:bg-[#254030] border border-emerald-400/35 text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer active:scale-[0.99] touch-manipulation"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Zap className="w-4 h-4 text-[#F0C05A] fill-[#F0C05A] shrink-0" />
                )}
                <span>Activate Instant Studio Pass (2,000 Free Chars)</span>
              </button>

              <div className="relative flex items-center justify-center my-2 gap-3">
                <div className="border-t border-white/10 flex-1" />
                <span className="text-[10px] text-white/50 font-medium uppercase font-mono-numbers">
                  Or sync takes across devices
                </span>
                <div className="border-t border-white/10 flex-1" />
              </div>

              {/* Official Firebase Google OAuth Popup */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-white/[0.07] hover:bg-white/[0.14] text-white font-semibold text-xs flex items-center justify-center gap-2.5 border border-white/15 transition-all cursor-pointer active:scale-[0.99] touch-manipulation"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                )}
                <span>Sign In with Google (Auto-Merge Studio Vault)</span>
              </button>
            </>
          )}

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/25 text-[11px] text-emerald-100/90 leading-relaxed space-y-1">
            <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Zero-Loss Hybrid Audio Vault</span>
            </p>
            <p className="text-white/70">
              All generated takes &amp; scripts are permanently stored in your browser&apos;s IndexedDB Vault and automatically merge into your Google Cloud account when you sign in.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
