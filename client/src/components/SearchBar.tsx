/**
 * 봄날의 햇살 - 검색바 컴포넌트
 */

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative" id="search-bar">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="도구 검색..."
        className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card text-sm
                   focus:outline-none focus:ring-2 focus:ring-sunbeam/30 focus:border-sunbeam/50
                   placeholder:text-muted-foreground/50
                   transition-all duration-200"
        id="search-input"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full
                     bg-muted flex items-center justify-center
                     text-muted-foreground hover:bg-muted-foreground/20 transition-colors"
          aria-label="검색 지우기"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="3" x2="9" y2="9" />
            <line x1="9" y1="3" x2="3" y2="9" />
          </svg>
        </button>
      )}
    </div>
  );
}
