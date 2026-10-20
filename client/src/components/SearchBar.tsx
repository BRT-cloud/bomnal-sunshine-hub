/**
 * 봄날의 햇살 - 검색바 컴포넌트
 */
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative" id="search-bar">
      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="도구 이름, 설명 또는 URL 검색..."
        className="w-full h-11 pl-10 pr-9 rounded-xl border border-border bg-card text-sm
                   focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60
                   placeholder:text-muted-foreground/60 transition-all duration-200"
        id="search-input"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full
                     bg-muted flex items-center justify-center
                     text-muted-foreground hover:bg-muted-foreground/20 transition-colors"
          aria-label="검색어 지우기"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
