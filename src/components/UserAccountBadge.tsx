import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  User,
  LogOut,
  Crown,
  ChevronDown,
  Zap,
  ShieldCheck,
  Key,
  Database,
  Download,
  Upload,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserAccountBadgeProps {
  onOpenAuth: () => void;
  onOpenPremium: () => void;
  onOpenAdminKey?: () => void;
  vaultCount?: number;
  onExportVault?: () => void;
  onImportVault?: () => void;
}

export const UserAccountBadge: React.FC<UserAccountBadgeProps> = ({
  onOpenAuth,
  onOpenPremium,
  onOpenAdminKey,
  vaultCount = 0,
  onExportVault,
  onImportVault,
}) => {
  const { user, userProfile, signOut, resetDailyQuotaManually } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number }>({ top: 68, right: 12 });
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const updateMenuPosition = useCallback(() => {
    if (!triggerRef.current || typeof window === 'undefined') return;
    const rect = triggerRef.current.getBoundingClientRect();
    const top = Math.min(Math.max(56, rect.bottom + 8), window.innerHeight - 160);
    const right = Math.max(12, window.innerWidth - rect.right);
    setMenuPos({ top, right });
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;

    updateMenuPosition();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    const handleViewportChange = () => updateMenuPosition();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleViewportChange, { passive: true });
    window.addEventListener('scroll', handleViewportChange, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange);
    };
  }, [dropdownOpen, updateMenuPosition]);

  if (!user || !userProfile) {
    return (
      <button
        type="button"
        onClick={onOpenAuth}
        className="inline-flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 px-2.5 sm:px-4 rounded-xl bg-[var(--accent-color)] hover:opacity-95 text-white text-[11px] sm:text-xs font-semibold transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0 touch-manipulation"
      >
        <User className="w-3.5 h-3.5 text-white shrink-0" />
        <span className="sm:hidden">Studio Pass</span>
        <span className="hidden sm:inline">Studio Pass · 2,000 Chars</span>
      </button>
    );
  }

  const userEmail = (user.email || '').trim().toLowerCase();
  const isGuest = user.uid === 'local-studio-creator';
  const isAdmin = ['rdpandit913@gmail.com', 'dubeyrishi135@gmail.com'].includes(userEmail);
  const charLimit = 2000;
  const remainingChars = Math.max(0, userProfile.credits);
  const percentUsed = Math.min(100, Math.round(((charLimit - remainingChars) / charLimit) * 100));

  const dropdownPortal =
    dropdownOpen && typeof document !== 'undefined'
      ? createPortal(
          <>
            {/* Transparent/subtle backdrop guarantees click-outside dismissal without touch/click race conditions */}
            <div
              aria-hidden="true"
              className="fixed inset-0 z-[90] bg-black/45 sm:bg-transparent"
              onClick={() => setDropdownOpen(false)}
            />

            <div
              role="menu"
              style={{
                top: `${menuPos.top}px`,
                right: `${menuPos.right}px`,
                maxHeight: `calc(100dvh - ${menuPos.top + 16}px)`,
              }}
              className="fixed w-[min(19rem,calc(100vw-1.5rem))] sm:w-72 overflow-y-auto overscroll-contain bg-[#101914]/[0.98] border border-white/20 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.85)] p-4 z-[95] space-y-3 text-white pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pb-2.5 border-b border-white/12 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-white truncate">
                    {userProfile.displayName}
                  </p>
                  {isAdmin ? (
                    <span className="text-[11px] font-mono-numbers text-amber-300 font-semibold shrink-0">
                      Admin
                    </span>
                  ) : isGuest ? (
                    <span className="text-[10px] font-mono-numbers text-emerald-300 font-semibold shrink-0">
                      Local Vault
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono-numbers text-emerald-300 font-semibold shrink-0">
                      Cloud Synced
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-white/65 font-mono-numbers truncate">
                  {userProfile.email}
                </p>
              </div>

              {isGuest && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#2E4E3B] hover:bg-[#254030] active:scale-[0.99] border border-emerald-400/45 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer touch-manipulation shadow-md"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span>Link Google Account &amp; Cloud Sync</span>
                </button>
              )}

              {/* Zero-Loss Audio Vault Status */}
              <div className="p-2.5 rounded-xl bg-emerald-950/75 border border-emerald-400/25 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
                    <Database className="w-3.5 h-3.5 shrink-0" />
                    <span>Audio Vault Secured</span>
                  </span>
                  <span className="font-mono-numbers font-bold text-white">
                    {vaultCount} Takes
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {onExportVault && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpen(false);
                        onExportVault();
                      }}
                      className="py-2 px-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-[11px] font-semibold text-white flex items-center justify-center gap-1 border border-white/10 cursor-pointer touch-manipulation"
                    >
                      <Download className="w-3 h-3 text-emerald-300 shrink-0" />
                      <span>Backup JSON</span>
                    </button>
                  )}
                  {onImportVault && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpen(false);
                        onImportVault();
                      }}
                      className="py-2 px-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-[11px] font-semibold text-white flex items-center justify-center gap-1 border border-white/10 cursor-pointer touch-manipulation"
                    >
                      <Upload className="w-3 h-3 text-amber-300 shrink-0" />
                      <span>Restore JSON</span>
                    </button>
                  )}
                </div>
              </div>

              {!isAdmin && !userProfile.isPremium ? (
                <div className="p-3 rounded-xl bg-black/45 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-[11px] gap-2">
                    <span className="text-white/65">Daily Allowance</span>
                    <span className="font-mono-numbers font-bold text-white">
                      {remainingChars.toLocaleString()} / 2,000
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/12 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent-color)] rounded-full transition-all"
                      style={{ width: `${percentUsed}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-white/60 pt-0.5 gap-2">
                    <span>Resets daily at 12:00 AM</span>
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await resetDailyQuotaManually();
                      }}
                      className="text-[var(--accent-color)] hover:underline font-semibold cursor-pointer touch-manipulation"
                    >
                      Sync Now
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-xs text-emerald-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                  <span className="font-semibold text-[11px]">
                    {isAdmin ? 'Admin Dedicated Master Quota' : 'Premium Unlimited Member'}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] uppercase text-white/55 block font-mono-numbers">
                    Saved Takes
                  </span>
                  <span className="font-mono-numbers font-bold text-xs text-white">
                    {Math.max(vaultCount, userProfile.totalTakes || 0)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] uppercase text-white/55 block font-mono-numbers">
                    Chars Used
                  </span>
                  <span className="font-mono-numbers font-bold text-xs text-white">
                    {(userProfile.totalGeneratedChars || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {isAdmin && onOpenAdminKey && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(false);
                    onOpenAdminKey();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/12 text-white text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer touch-manipulation"
                >
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>API Keys &amp; Routing</span>
                  </span>
                  <span className="text-[10px] text-white/60">Configure</span>
                </button>
              )}

              {!userProfile.isPremium && !isAdmin && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(false);
                    onOpenPremium();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[var(--accent-color)] hover:opacity-90 text-white text-xs font-semibold flex items-center justify-between transition-opacity cursor-pointer touch-manipulation"
                >
                  <span className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                    <span>Studio Quota &amp; Pro Info</span>
                  </span>
                  <span className="text-[10px] font-mono-numbers">Refill</span>
                </button>
              )}

              <button
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  setDropdownOpen(false);
                  await signOut();
                }}
                className="w-full py-2.5 px-3 rounded-xl hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-white/10 touch-manipulation"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>Sign Out (Keep Local Vault)</span>
              </button>
            </div>
          </>,
          document.body
        )
      : null;

  return (
    <div ref={triggerRef} className="relative z-40">
      <div className="flex items-center gap-1 sm:gap-1.5 bg-white/[0.06] p-0.5 sm:p-1 rounded-xl border border-white/12 text-white">
        <button
          type="button"
          onClick={isAdmin ? onOpenAdminKey : onOpenPremium}
          className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1 rounded-lg hover:bg-white/[0.08] text-white text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 touch-manipulation"
          title={isAdmin ? 'Admin Dedicated API Key' : 'Character Allowance'}
        >
          <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--accent-color)] shrink-0" />
          <span className="font-mono-numbers font-bold text-white">
            {isAdmin || userProfile.isPremium ? (
              <>
                <span className="sm:hidden">Pro</span>
                <span className="hidden sm:inline">Unlimited</span>
              </>
            ) : (
              <>
                <span className="sm:hidden">{remainingChars.toLocaleString()}</span>
                <span className="hidden sm:inline">{remainingChars.toLocaleString()} Chars</span>
              </>
            )}
          </span>
        </button>

        <button
          type="button"
          aria-expanded={dropdownOpen}
          aria-haspopup="menu"
          aria-label="Open account menu"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:pl-2 sm:pr-2.5 py-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white text-[11px] sm:text-xs font-semibold border border-white/10 transition-colors cursor-pointer whitespace-nowrap shrink-0 touch-manipulation"
        >
          <div className="w-5 h-5 rounded-md bg-[var(--accent-color)] text-white flex items-center justify-center text-[10px] uppercase font-bold shrink-0">
            {isAdmin ? 'A' : userProfile.displayName ? userProfile.displayName.charAt(0) : 'U'}
          </div>
          <span className="hidden sm:inline truncate max-w-[96px] text-xs">
            {isAdmin ? 'Admin' : userProfile.displayName || 'Creator'}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-white/60 shrink-0 transition-transform ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {dropdownPortal}
    </div>
  );
};
