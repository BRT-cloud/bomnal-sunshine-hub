/**
 * 봄날의 햇살 - 히어로 섹션
 * 비대칭 레이아웃, 종이 레이어 효과, 봄 분위기
 */

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24" id="hero">
      {/* Decorative background layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Warm gradient */}
        <div
          className="absolute top-0 right-0 w-[60%] h-[80%] rounded-bl-[100px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(216,155,57,0.08) 0%, rgba(245,223,168,0.12) 50%, transparent 100%)",
          }}
        />
        {/* Floating circles */}
        <div
          className="absolute top-12 right-[15%] w-32 h-32 rounded-full animate-float"
          style={{ background: "rgba(216,155,57,0.06)" }}
        />
        <div
          className="absolute bottom-8 right-[25%] w-20 h-20 rounded-full animate-float delay-3"
          style={{ background: "rgba(122,155,109,0.06)" }}
        />
        <div
          className="absolute top-[40%] left-[5%] w-16 h-16 rounded-full animate-float delay-5"
          style={{ background: "rgba(124,175,196,0.06)" }}
        />
      </div>

      <div className="container relative">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="animate-fadeInUp">
            <span className="eyebrow text-sunbeam-dark inline-flex items-center gap-2">
              <span
                className="inline-block w-8 h-[2px] rounded-full"
                style={{ background: "#D89B39" }}
              />
              교사를 위한 링크 책상
            </span>
          </div>

          {/* Headline */}
          <h2 className="heading-display mt-5 text-ink animate-fadeInUp delay-1">
            오늘 필요한 도구를,
            <br />
            <span className="text-sunbeam">햇살</span>처럼 가까이.
          </h2>

          {/* Sub text */}
          <p className="mt-6 text-lg text-ink-light leading-relaxed max-w-xl animate-fadeInUp delay-2">
            교육 현장에서 자주 쓰는 웹앱을 한 곳에 모았습니다.
            <br className="hidden md:block" />
            필요한 순간 바로 꺼내 쓰세요.
          </p>

          {/* Quick stats */}
          <div className="flex items-center gap-6 mt-8 animate-fadeInUp delay-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-sunbeam/10 text-sunbeam">
                📖
              </span>
              <span>수업 도구</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-sage/10 text-sage">
                📋
              </span>
              <span>학급 관리</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-coral/10 text-coral">
                🎨
              </span>
              <span>콘텐츠</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky/10 text-sky">
                💬
              </span>
              <span>커뮤니티</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
