/**
 * 봄날의 햇살 - 히어로 섹션
 * 
 * - 빛을 사방으로 내보내는 귀여운 사계절 햇님 캐릭터 (SunCharacter)
 * - 3~5월 봄, 6~8월 여름, 9~11월 가을, 12~2월 겨울 계절 테마 반영
 * - 사계절 미리보기 및 자동 계절 전환 뱃지
 */
import { motion } from "framer-motion";
import type { Category } from "../data/links";
import type { Season } from "../lib/season";
import { SEASONS } from "../lib/season";
import SunCharacter from "./motion/SunCharacter";

interface HeroSectionProps {
  categories?: Category[];
  season: Season;
  onSelectCategory?: (id: string) => void;
  onSelectSeason?: (season: Season) => void;
}

export default function HeroSection({
  categories,
  season,
  onSelectCategory,
  onSelectSeason,
}: HeroSectionProps) {
  const currentSeason = SEASONS[season];

  return (
    <section className="relative overflow-hidden py-10 md:py-16" id="hero">
      {/* 부드러운 햇살 배경 레이어 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-16 right-[-5%] w-[480px] h-[480px] md:w-[680px] md:h-[680px] rounded-full"
          style={{
            background:
              season === "winter"
                ? "radial-gradient(circle, rgba(224, 242, 254, 0.45) 0%, rgba(253, 248, 240, 0.1) 70%, transparent 100%)"
                : season === "summer"
                ? "radial-gradient(circle, rgba(254, 249, 195, 0.45) 0%, rgba(253, 248, 240, 0.1) 70%, transparent 100%)"
                : season === "autumn"
                ? "radial-gradient(circle, rgba(254, 215, 170, 0.45) 0%, rgba(253, 248, 240, 0.1) 70%, transparent 100%)"
                : "radial-gradient(circle, rgba(254, 235, 179, 0.45) 0%, rgba(253, 248, 240, 0.1) 70%, transparent 100%)",
          }}
        />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* 좌측: 타이틀 및 계절 안내 문구 */}
          <div className="md:col-span-7 lg:col-span-8 space-y-4">
            {/* 상단: 사계절 뱃지 & 계절 선택 버튼 */}
            <div className="flex flex-wrap items-center gap-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${currentSeason.badgeBg} ${currentSeason.badgeText}`}
              >
                <span>{currentSeason.icon}</span>
                <span className="text-hand text-base font-bold tracking-wide">
                  지금은 {currentSeason.name}의 계절 ({currentSeason.months})
                </span>
              </motion.div>

              {/* 사계절 변경 버튼 그룹 */}
              {onSelectSeason && (
                <div className="inline-flex items-center gap-1 bg-card/80 p-0.5 rounded-full border border-border/70 text-xs">
                  {(["spring", "summer", "autumn", "winter"] as Season[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => onSelectSeason(s)}
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                        season === s
                          ? "bg-amber-600 text-white shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title={`${SEASONS[s].name} (${SEASONS[s].months})`}
                    >
                      {SEASONS[s].icon} {SEASONS[s].name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 메인 헤드라인 */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="heading-display text-ink"
            >
              오늘 필요한 도구를,
              <br />
              따스한{" "}
              <span className="text-amber-600 relative inline-block">
                햇살
                <svg
                  className="absolute -bottom-1 left-0 w-full h-2 text-amber-400"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M 2 8 Q 50 1, 98 6"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              처럼 가까이.
            </motion.h2>

            {/* 계절별 서브 설명 */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-base md:text-lg text-ink-light leading-relaxed max-w-xl"
            >
              <span className="font-semibold text-foreground">
                {currentSeason.greeting}
              </span>
              <br />
              {currentSeason.subtitle}
            </motion.p>

            {/* 5개 카테고리 퀵 뱃지들 */}
            {categories && categories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.3 }}
                className="flex flex-wrap items-center gap-2.5 pt-2"
              >
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory?.(cat.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-semibold
                               bg-card/90 border border-border hover:border-amber-400 hover:bg-amber-50/50 
                               text-ink transition-all shadow-xs hover:shadow-sm"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* 우측: 빛을 뿜어내는 사계절 맞춤 햇님 캐릭터 (모션 그래픽) */}
          <div className="md:col-span-5 lg:col-span-4 flex justify-center md:justify-end">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 140,
                damping: 15,
                delay: 0.15,
              }}
              className="relative p-4"
            >
              <SunCharacter size="lg" season={season} />

              {/* 귀여운 손글씨 말풍선 */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-2 md:bottom-2 left-1/2 -translate-x-1/2 bg-white/95 px-3.5 py-1 rounded-full border border-amber-300 shadow-sm text-center whitespace-nowrap"
              >
                <span className="text-hand text-sm md:text-base font-bold text-amber-900">
                  {season === "spring" && "화사한 봄 햇살 가득! 🌸"}
                  {season === "summer" && "시원하고 반짝이는 여름! ☀️"}
                  {season === "autumn" && "따스하고 포근한 가을! 🍁"}
                  {season === "winter" && "하얗게 설레는 겨울날! ❄️"}
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 하단 잔잔한 경계선 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
    </section>
  );
}
