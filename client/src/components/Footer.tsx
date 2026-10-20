/**
 * 봄날의 햇살 - 푸터 컴포넌트
 */
import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-cream-dark/40 relative z-10">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Brand */}
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <span className="text-amber-500">☀️</span>
            <span style={{ fontFamily: "var(--font-display)" }}>봄날의 햇살</span>
            <span className="text-xs font-normal text-muted-foreground ml-1">
              — 교사용 교육 도구 허브
            </span>
          </div>

          {/* Center: Description */}
          <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
            <span>배래쌤이 운영하는 도구 허브입니다</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
          </p>

          {/* Right: Info */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>어떤 브라우저에서도 그대로 이어집니다</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
