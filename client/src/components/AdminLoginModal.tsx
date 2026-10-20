/**
 * 봄날의 햇살 - 관리자 로그인 모달
 * 비밀번호: 0809 (구글 시트 연동 시 서버에서 안전하게 검증)
 */
import { useState, useRef, useEffect } from "react";
import { Lock, X, Eye, EyeOff, Loader2 } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";

    // Escape 키로 모달 닫기
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError(true);
      toast.error("비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const success = await loginAdmin(password.trim());
      if (success) {
        toast.success("관리자 모드로 전환되었습니다! ✨", {
          description: "도구 추가, 수정, 삭제 및 목차 관리가 가능합니다.",
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
    } catch {
      toast.error("인증 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn"
      id="admin-login-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
    >
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-2xl p-6 relative border border-border animate-fadeInUp">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center
                     text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="닫기"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h3
            id="admin-modal-title"
            className="text-lg font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            관리자 모드
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            도구를 추가하거나 목차를 수정하려면 비밀번호를 입력해주세요.
          </p>
        </div>

        {/* 폼 */}
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
                className={`w-full h-11 px-4 pr-11 rounded-xl border text-sm bg-background transition-all
                           focus:outline-none focus:ring-2 focus:ring-amber-500/40
                           ${
                             error
                               ? "border-destructive text-destructive focus:ring-destructive/30"
                               : "border-input text-foreground"
                           }`}
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
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
              disabled={isLoading}
              className="flex-1 h-10 rounded-xl border border-border text-sm font-semibold
                         text-muted-foreground hover:bg-muted/60 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-10 rounded-xl bg-amber-600 text-white text-sm font-bold
                         hover:bg-amber-700 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>확인</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
