/**
 * 봄날의 햇살 - 헤더 컴포넌트
 * 브랜드 로고, 관리자 상태 표시, 목차 관리, 도구 추가, 로그인/로그아웃
 */
import { useAdmin } from "../lib/admin";
import { toast } from "sonner";

interface HeaderProps {
  onOpenAdd: () => void;
  onOpenManageCategories: () => void;
  onOpenLogin: () => void;
}

export default function Header({
  onOpenAdd,
  onOpenManageCategories,
  onOpenLogin,
}: HeaderProps) {
  const { isAdmin, logout } = useAdmin();

  const handleLogout = () => {
    logout();
    toast.info("관리자 모드에서 로그아웃되었습니다.");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-cream/90 border-b border-border/50">
      <div className="container flex items-center justify-between h-16 gap-2">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg
              viewBox="0 0 64 64"
              className="w-10 h-10"
              aria-hidden="true"
            >
              <circle cx="32" cy="32" r="14" fill="#D89B39" opacity="0.2" />
              <circle cx="32" cy="32" r="8" fill="#D89B39" />
              <g
                stroke="#D89B39"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.7"
              >
                <line x1="32" y1="8" x2="32" y2="16" />
                <line x1="32" y1="48" x2="32" y2="56" />
                <line x1="8" y1="32" x2="16" y2="32" />
                <line x1="48" y1="32" x2="56" y2="32" />
                <line x1="14.9" y1="14.9" x2="20.1" y2="20.1" />
                <line x1="43.9" y1="43.9" x2="49.1" y2="49.1" />
                <line x1="14.9" y1="49.1" x2="20.1" y2="43.9" />
                <line x1="43.9" y1="20.1" x2="49.1" y2="14.9" />
              </g>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1
                className="text-lg leading-tight font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                봄날의 햇살
              </h1>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded-full text-[0.68rem] font-bold bg-sunbeam text-white shadow-xs">
                  👑 관리자
                </span>
              )}
            </div>
            <p className="text-[0.65rem] text-muted-foreground tracking-wider font-medium">
              교사용 교육 도구 허브
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              {/* 목차 관리 버튼 */}
              <button
                onClick={onOpenManageCategories}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-medium
                           bg-secondary text-secondary-foreground hover:bg-muted active:scale-[0.97]
                           transition-all border border-border"
                title="상단 목차(카테고리) 추가 / 수정 / 삭제"
              >
                <span>📑</span>
                <span className="hidden sm:inline">목차 관리</span>
              </button>

              {/* 도구 추가 버튼 */}
              <button
                id="add-link-button"
                onClick={onOpenAdd}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold
                           bg-sunbeam text-white hover:bg-sunbeam-dark active:scale-[0.97]
                           transition-all shadow-sm hover:shadow-md"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <line x1="8" y1="3" x2="8" y2="13" />
                  <line x1="3" y1="8" x2="13" y2="8" />
                </svg>
                <span>도구 추가</span>
              </button>

              {/* 로그아웃 버튼 */}
              <button
                onClick={handleLogout}
                className="px-2.5 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="관리자 로그아웃"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              {/* 비관리자일 때: 관리자 모드 진입 버튼 */}
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-medium
                           bg-secondary text-secondary-foreground hover:bg-muted active:scale-[0.97]
                           transition-all border border-border"
                id="admin-login-button"
              >
                <span>🔒</span>
                <span>관리자 모드</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
