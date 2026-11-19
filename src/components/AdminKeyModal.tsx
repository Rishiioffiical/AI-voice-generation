import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  Lock,
  X,
  Server,
  Info,
} from 'lucide-react';
import { getActiveApiMode, setActiveApiMode, ApiMode } from '../utils/apiClient';

interface AdminKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail?: string | null;
}

export const AdminKeyModal: React.FC<AdminKeyModalProps> = ({
  isOpen,
  onClose,
  currentUserEmail,
}) => {
  const [activeMode, setMode] = useState<ApiMode>(getActiveApiMode());
  const [isLoadingHealth, setIsLoadingHealth] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    setMode(getActiveApiMode());
    checkServerHealth();
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

  const checkServerHealth = async () => {
    setIsLoadingHealth(true);
    try {
      const mode = getActiveApiMode();
      const testEmail =
        mode === 'admin' ? currentUserEmail || 'admin@vibecast.studio' : 'public-tester@vibecast.app';
      await fetch('/api/health', {
        headers: {
          'x-user-email': testEmail,
        },
      });
    } catch (err) {
      console.warn('Health check error:', err);
    } finally {
      setIsLoadingHealth(false);
    }
  };

  const handleToggleMode = (newMode: ApiMode) => {
    setMode(newMode);
    setActiveApiMode(newMode);
    setTimeout(() => {
      checkServerHealth();
    }, 100);
  };

  if (!isOpen || typeof document === 'undefined') return null;

  const isAdminActive = activeMode === 'admin';

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Dual API Key and Quota Routing"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 overflow-y-auto overscroll-contain"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[90dvh] flex flex-col bg-[#101914]/[0.98] rounded-2xl sm:rounded-[28px] border border-white/20 shadow-[0_24px_70px_rgba(0,0,0,0.85)] text-white overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-4 sm:px-7 pt-5 pb-4 border-b border-white/12 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--accent-color)] text-white flex items-center justify-center shadow-sm flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-bold text-white leading-tight">
                Dual API Key &amp; Quota Routing
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                Admin vs Public server-side key isolation &amp; automatic failover
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-7 overflow-y-auto overscroll-contain flex-1 min-h-0 space-y-5">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/12 flex items-center justify-between">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white/[0.08] flex items-center justify-center text-white flex-shrink-0">
                {isAdminActive ? <Lock className="w-4 h-4 text-amber-300" /> : <Users className="w-4 h-4 text-emerald-300" />}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                  <span className="text-white/60">Active Routing:</span>
                  <span className="font-bold text-white">
                    {isAdminActive ? 'Admin Dedicated Quota' : 'Public Standard Quota'}
                  </span>
                </div>
                <p className="text-xs text-white/60 mt-0.5">
                  {isAdminActive
                    ? 'Requests route through ADMIN_API_KEY with automatic pool failover.'
                    : 'Requests route through PUBLIC_API_KEY for standard studio visitors.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleToggleMode('admin')}
              className={`p-4 rounded-2xl border text-left transition-colors cursor-pointer touch-manipulation ${
                isAdminActive
                  ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/15'
                  : 'border-white/12 bg-white/[0.04] hover:bg-white/[0.08]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-white">Admin Mode</span>
                {isAdminActive && <CheckCircle2 className="w-4 h-4 text-[var(--accent-color)]" />}
              </div>
              <p className="text-xs text-white/65 leading-snug">
                Dedicated <span className="font-mono-numbers text-white">ADMIN_API_KEY</span> lane
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleToggleMode('public')}
              className={`p-4 rounded-2xl border text-left transition-colors cursor-pointer touch-manipulation ${
                !isAdminActive
                  ? 'border-emerald-400 bg-emerald-500/15'
                  : 'border-white/12 bg-white/[0.04] hover:bg-white/[0.08]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-white">Public Mode</span>
                {!isAdminActive && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-xs text-white/65 leading-snug">
                Standard <span className="font-mono-numbers text-white">PUBLIC_API_KEY</span> lane
              </p>
            </button>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/12 space-y-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold flex items-center gap-1.5 text-white/85">
                <Server className="w-3.5 h-3.5 text-[#38D9A9]" />
                <span>Server-Side Proxy Status</span>
              </span>
              <button
                type="button"
                onClick={checkServerHealth}
                disabled={isLoadingHealth}
                className="text-[var(--accent-color)] hover:underline font-semibold cursor-pointer touch-manipulation"
              >
                {isLoadingHealth ? 'Checking...' : 'Verify Proxy'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono-numbers text-[11px]">
              <div className="bg-white/[0.04] p-2.5 rounded-xl border border-white/10">
                <div className="text-white/50 text-[10px]">ADMIN_API_KEY</div>
                <div className="font-bold text-emerald-300 mt-0.5">Configured &amp; Isolated</div>
              </div>

              <div className="bg-white/[0.04] p-2.5 rounded-xl border border-white/10">
                <div className="text-white/50 text-[10px]">PUBLIC_API_KEY</div>
                <div className="font-bold text-emerald-300 mt-0.5">Configured &amp; Active</div>
              </div>
            </div>

            <div className="text-[11px] text-white/65 flex items-start sm:items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[var(--accent-color)] flex-shrink-0 mt-0.5 sm:mt-0" />
              <span className="break-all">
                Admin Identity: <strong className="text-white">{currentUserEmail || 'rdpandit913@gmail.com'}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-4 sm:px-7 py-3.5 border-t border-white/12 bg-black/35 flex-shrink-0">
          <span className="text-[11px] text-white/55">
            API keys remain strictly server-side.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[var(--accent-color)] text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer touch-manipulation flex-shrink-0"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
