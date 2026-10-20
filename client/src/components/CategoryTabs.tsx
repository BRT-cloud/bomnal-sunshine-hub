/**
 * 봄날의 햇살 - 카테고리 탭 컴포넌트
 * 
 * - 5개 카테고리 탭 (수업 도구, 학급 관리, 교육과정, 행동지원, 기타)
 * - 활성화 탭 부드러운 전환 효과
 * - 관리자 전용 목차 편집 바로가기
 */
import { motion } from "framer-motion";
import { FolderTree } from "lucide-react";
import type { Category } from "../data/links";

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string | "all";
  onChange: (cat: string | "all") => void;
  counts: Record<string, number>;
  isAdmin?: boolean;
  onOpenManageCategories?: () => void;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onChange,
  counts,
  isAdmin,
  onOpenManageCategories,
}: CategoryTabsProps) {
  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <nav
        className="flex items-center gap-1.5 md:gap-2"
        id="category-tabs"
        aria-label="카테고리 선택"
      >
        {/* 전체 탭 */}
        <button
          id="tab-all"
          onClick={() => onChange("all")}
          className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold
                      transition-all whitespace-nowrap
                      ${
                        activeCategory === "all"
                          ? "bg-amber-600 text-white shadow-sm"
                          : "bg-card text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border"
                      }`}
        >
          <span>전체</span>
          <span
            className={`text-[11px] px-1.5 py-0.2 rounded-md font-semibold ${
              activeCategory === "all"
                ? "bg-white/25 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {totalCount}
          </span>
        </button>

        {/* 개별 카테고리 탭 */}
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = counts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              id={`tab-${cat.id}`}
              onClick={() => onChange(cat.id)}
              className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold
                          transition-all whitespace-nowrap
                          ${
                            isActive
                              ? "bg-amber-600 text-white shadow-sm"
                              : "bg-card text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border"
                          }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-md font-semibold ${
                  isActive
                    ? "bg-white/25 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* 관리자 전용 목차 편집 바로가기 */}
      {isAdmin && onOpenManageCategories && (
        <button
          onClick={onOpenManageCategories}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold
                     border border-dashed border-amber-500/70 text-amber-800 bg-amber-500/10 hover:bg-amber-500/20
                     whitespace-nowrap transition-all ml-1"
          title="상단 목차(카테고리) 추가 / 수정 / 삭제"
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>목차 편집</span>
        </button>
      )}
    </div>
  );
}
