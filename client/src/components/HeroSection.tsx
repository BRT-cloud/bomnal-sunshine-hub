/**
 * 봄날의 햇살 - 히어로 섹션
 * 
 * - 실시간 날짜 연동: 3~5월 봄, 6~8월 여름, 9~11월 가을, 12~2월 겨울 테마 100% 자동 반영
 * - 불필요한 수동 선택 버튼 없이 깔끔하게 날짜 기반 단일 뱃지만 노출
 * - 계절별 햇님 캐릭터 (SunCharacter: 단풍 머리핀, 선글라스, 벚꽃, 귀마개)
 */
import { motion } from "framer-motion";
import type { Season } from "../lib/season";
import { SEASONS, getCurrentDateInfo } from "../lib/season";
import SunCharacter from "./motion/SunCharacter";

interface HeroSectionProps {
  season: Season;
}

export default function HeroSection({ season }: HeroSectionProps) {
  const currentSeason = SEASONS[season];
  const dateInfo = getCurrentDateInfo();

  return (
    <section className="relative overflow-hidden py-8 md:py-14" id="hero">
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
            {/* 상단: 오늘 날짜에 자동 연동된 단일 심플 뱃지 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold ${currentSeason.badgeBg} ${currentSeason.badgeText}`}
            >
              <span className="text-sm">{currentSeason.icon}</span>
              <span className="text-hand text-base font-bold tracking-wide">
                {dateInfo.month}월, {currentSeason.name}의 햇살과 함께하는 도구 책상
              </span>
            </motion.div>

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
