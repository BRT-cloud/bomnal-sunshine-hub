/**
 * 봄날의 햇살 - 헤더 컴포넌트
 * 브랜드 로고와 심볼, 링크 추가 버튼 포함
 */
import { useState } from "react";
import AddLinkModal from "./AddLinkModal";

export default function Header() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-cream/90 border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
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
              <h1
                className="text-lg leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                봄날의 햇살
              </h1>
              <p className="text-[0.65rem] text-muted-foreground tracking-wider font-medium">
                교사용 교육 도구 허브
              </p>
            </div>
          </div>

          {/* Actions */}
          <button
            id="add-link-button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                       bg-sunbeam text-white
                       hover:bg-sunbeam-dark active:scale-[0.97]
                       transition-all duration-150 shadow-sm hover:shadow-md"
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
              <line x1="8" y1="3" x2="8" y2="13" />
              <line x1="3" y1="8" x2="13" y2="8" />
            </svg>
            도구 추가
          </button>
        </div>
      </header>

      {showAdd && <AddLinkModal onClose={() => setShowAdd(false)} />}
    </>
  );
}
