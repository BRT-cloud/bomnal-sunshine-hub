/**
 * 봄날의 햇살 - 카테고리 탭 컴포넌트
 * 책갈피를 넘기듯 명확하게 전환
 */
import { CATEGORIES, type CategoryId } from "../data/links";

interface CategoryTabsProps {
  activeCategory: CategoryId | "all";
  onChange: (cat: CategoryId | "all") => void;
  counts: Record<string, number>;
}

export default function CategoryTabs({
  activeCategory,
  onChange,
  counts,
}: CategoryTabsProps) {
  return (
    <nav
      className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
      id="category-tabs"
      aria-label="카테고리 선택"
    >
      {/* All tab */}
      <button
        id="tab-all"
        onClick={() => onChange("all")}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                    transition-all duration-180 whitespace-nowrap
                    ${
                      activeCategory === "all"
                        ? "bg-ink text-cream shadow-sm"
                        : "bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
      >
        <span>전체</span>
        <span
          className={`text-xs px-1.5 py-0.5 rounded-md ${
            activeCategory === "all"
              ? "bg-white/20 text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {Object.values(counts).reduce((a, b) => a + b, 0)}
        </span>
      </button>

      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          id={`tab-${cat.id}`}
          onClick={() => onChange(cat.id)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                      transition-all duration-180 whitespace-nowrap
                      ${
                        activeCategory === cat.id
                          ? "bg-ink text-cream shadow-sm"
                          : "bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded-md ${
              activeCategory === cat.id
                ? "bg-white/20 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {counts[cat.id] || 0}
          </span>
        </button>
      ))}
    </nav>
  );
}
