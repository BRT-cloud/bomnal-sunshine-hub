/**
 * 봄날의 햇살 - 관리자 로그인 모달
 * 비밀번호: 0301
 */
import { useState, useRef, useEffect } from "react";
import { loginAdmin } from "../lib/admin";
import { toast } from "sonner";

interface AdminLoginModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AdminLoginModal({
  onClose,
  onSuccess,
}: AdminLoginModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError(true);
      toast.error("비밀번호를 입력해주세요.");
      return;
    }

    const success = loginAdmin(password);
    if (success) {
      toast.success("관리자 모드로 전환되었습니다! 👑", {
        description: "도구 추가/삭제/수정 및 목차 편집이 가능합니다.",
      });
      onSuccess?.();
      onClose();
    } else {
      setError(true);
      toast.error("비밀번호가 일치하지 않습니다.", {
        description: "관리자 비밀번호를 다시 확인해주세요.",
      });
      setPassword("");
      inputRef.current?.focus();
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 backdrop-blur-sm animate-fadeIn"
      id="admin-login-modal"
    >
      <div className="w-full max-w-sm mx-4 bg-card rounded-2xl shadow-2xl p-6 relative border border-border animate-fadeInUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center
                     text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="닫기"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="4" y1="4" x2="12" y2="12" />
            <line x1="12" y1="4" x2="4" y2="12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-sunbeam/15 text-sunbeam-dark flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner">
            🔐
          </div>
          <h3
            className="text-lg font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            관리자 모드
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            도구 및 목차를 관리하려면 비밀번호를 입력해주세요.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="비밀번호 입력"
                className={`w-full h-11 px-4 pr-10 rounded-xl border text-sm bg-background transition-all
                           focus:outline-none focus:ring-2 focus:ring-sunbeam/40
                           ${
                             error
                               ? "border-destructive text-destructive focus:ring-destructive/30"
                               : "border-input text-foreground"
                           }`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground text-xs font-medium"
              >
                {showPassword ? "숨김" : "표시"}
              </button>
            </div>
            {error && (
              <p className="text-[0.75rem] text-destructive mt-1.5 ml-1">
                비밀번호가 올바르지 않습니다.
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-border text-sm font-medium
                         text-muted-foreground hover:bg-muted/60 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 h-10 rounded-xl bg-sunbeam text-white text-sm font-semibold
                         hover:bg-sunbeam-dark active:scale-[0.98] transition-all shadow-sm"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
