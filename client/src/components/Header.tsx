/**
 * 봄날의 햇살 - 헤더 컴포넌트
 * 
 * - 햇살 로고 (호버 시 방긋 반짝이는 애니메이션)
 * - 관리자 모드 진입 (비밀번호: 0809)
 * - 관리자 전용: 도구 추가, 목차 관리, 로그아웃
 */
import { motion } from "framer-motion";
import { Plus, FolderTree, Lock, LogOut, ShieldCheck } from "lucide-react";
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
    <header className="sticky top-0 z-40 backdrop-blur-md bg-cream/90 border-b border-border/70 transition-colors">
      <div className="container flex items-center justify-between h-16 gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <motion.div
            className="relative w-10 h-10 flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.15, rotate: 12 }}
            whileTap={{ scale: 0.95 }}
            title="봄날의 햇살"
          >
            {/* 회전하는 햇살 레이어 */}
            <motion.svg
              viewBox="0 0 64 64"
              className="w-10 h-10"
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              aria-hidden="true"
            >
              <circle cx="32" cy="32" r="16" fill="#FDE047" opacity="0.3" />
              <g stroke="#D89B39" strokeWidth="2.5" strokeLinecap="round">
                <line x1="32" y1="6" x2="32" y2="15" />
                <line x1="32" y1="49" x2="32" y2="58" />
                <line x1="6" y1="32" x2="15" y2="32" />
                <line x1="49" y1="32" x2="58" y2="32" />
                <line x1="13.6" y1="13.6" x2="20" y2="20" />
                <line x1="44" y1="44" x2="50.4" y2="50.4" />
                <line x1="13.6" y1="50.4" x2="20" y2="44" />
                <line x1="44" y1="20" x2="50.4" y2="13.6" />
              </g>
            </motion.svg>
            {/* 중심 얼굴 */}
            <div className="absolute w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-xs">
              <span className="text-[10px]">☀️</span>
            </div>
          </motion.div>

          <div>
            <div className="flex items-center gap-2">
              <h1
                className="text-lg md:text-xl leading-tight font-bold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                봄날의 햇살
              </h1>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.7rem] font-bold bg-amber-500 text-white shadow-xs">
                  <ShieldCheck className="w-3 h-3" />
                  관리자
                </span>
              )}
            </div>
            <p className="text-[0.7rem] text-muted-foreground tracking-wide font-medium">
              나만의 교육 도구 허브
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
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs md:text-sm font-semibold
                           bg-secondary text-secondary-foreground hover:bg-muted active:scale-[0.97]
                           transition-all border border-border"
                title="상단 목차(카테고리) 추가 / 수정 / 삭제 / 순서변경"
              >
                <FolderTree className="w-4 h-4 text-muted-foreground" />
                <span className="hidden sm:inline">목차 관리</span>
              </button>

              {/* 도구 추가 버튼 */}
              <button
                id="add-link-button"
                onClick={onOpenAdd}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold
                           bg-amber-600 text-white hover:bg-amber-700 active:scale-[0.97]
                           transition-all shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>도구 추가</span>
              </button>

              {/* 로그아웃 버튼 */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-rose-50 transition-colors"
                title="관리자 로그아웃"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </>
          ) : (
            <>
              {/* 비관리자일 때: 관리자 모드 진입 버튼 */}
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs md:text-sm font-semibold
                           bg-card hover:bg-amber-50 text-foreground hover:text-amber-800 active:scale-[0.97]
                           transition-all border border-border hover:border-amber-400 shadow-xs"
                id="admin-login-button"
              >
                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                <span>관리자 모드</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
