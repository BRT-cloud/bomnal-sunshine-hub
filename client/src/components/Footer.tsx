/**
 * 봄날의 햇살 - 푸터 컴포넌트
 */

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50 bg-cream-dark/30">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Brand */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg
              viewBox="0 0 64 64"
              className="w-6 h-6 opacity-50"
              aria-hidden="true"
            >
              <circle cx="32" cy="32" r="8" fill="#D89B39" />
              <g stroke="#D89B39" strokeWidth="2" strokeLinecap="round" opacity="0.5">
                <line x1="32" y1="12" x2="32" y2="18" />
                <line x1="32" y1="46" x2="32" y2="52" />
                <line x1="12" y1="32" x2="18" y2="32" />
                <line x1="46" y1="32" x2="52" y2="32" />
              </g>
            </svg>
            <span>봄날의 햇살</span>
          </div>

          {/* Center: Description */}
          <p className="text-xs text-muted-foreground/70 text-center">
            교육 현장에서 자주 쓰는 웹앱을 한 곳에 모아, 필요한 순간 바로 꺼내
            쓰는 교사용 링크 허브입니다.
          </p>

          {/* Right: Info */}
          <p className="text-xs text-muted-foreground/50">
            데이터는 브라우저에 저장됩니다
          </p>
        </div>
      </div>
    </footer>
  );
}
