/**
 * 봄날의 햇살 - 사계절 맞춤 햇님 캐릭터 (SunCharacter)
 * 
 * - 계절별 코스튬:
 *   - 봄(3~5월): 화사한 벚꽃 머리핀
 *   - 여름(6~8월): 멋쟁이 선글라스
 *   - 가을(9~11월): 아기자기한 붉은 단풍잎
 *   - 겨울(12~2월): 포근한 겨울 털 귀마개
 * - 부드럽게 회전하는 햇살 광선 및 퍼져나가는 햇살 파동
 * - 깜빡이는 눈과 발그레한 볼터치
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Season } from "../../lib/season";

interface SunCharacterProps {
  size?: "sm" | "md" | "lg";
  season?: Season;
  className?: string;
}

export default function SunCharacter({
  size = "lg",
  season = "spring",
  className = "",
}: SunCharacterProps) {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 4200);

    return () => clearInterval(blinkInterval);
  }, []);

  const sizeStyles = {
    sm: "w-16 h-16",
    md: "w-28 h-28",
    lg: "w-44 h-44 md:w-56 md:h-56",
  }[size];

  return (
    <div
      className={`relative flex items-center justify-center select-none ${sizeStyles} ${className}`}
      aria-label="사계절 맞춤 봄날의 햇님 캐릭터"
    >
      {/* 1. 은은하게 사방으로 퍼져나가는 햇살 파동 (Sunbeam Pulse Waves) */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            season === "winter"
              ? "radial-gradient(circle, rgba(186, 230, 253, 0.45) 0%, rgba(216, 155, 57, 0.1) 60%, transparent 80%)"
              : season === "summer"
              ? "radial-gradient(circle, rgba(254, 240, 138, 0.55) 0%, rgba(245, 158, 11, 0.15) 60%, transparent 80%)"
              : season === "autumn"
              ? "radial-gradient(circle, rgba(254, 215, 170, 0.5) 0%, rgba(217, 119, 6, 0.15) 60%, transparent 80%)"
              : "radial-gradient(circle, rgba(254, 215, 102, 0.45) 0%, rgba(216, 155, 57, 0.12) 60%, transparent 80%)",
        }}
        animate={{
          scale: [1, 1.45, 1],
          opacity: [0.5, 0.85, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -inset-4 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 236, 168, 0.35) 0%, rgba(245, 195, 68, 0.08) 70%, transparent 85%)",
        }}
        animate={{
          scale: [1.1, 1.6, 1.1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* 2. 회전하는 햇살 꽃잎 광선 */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <defs>
          <linearGradient id="sunRayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#D89B39" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
          (angle) => (
            <g key={angle} transform={`rotate(${angle} 100 100)`}>
              <path
                d="M 94,18 C 94,8 106,8 106,18 L 104,42 C 104,46 96,46 96,42 Z"
                fill="url(#sunRayGrad)"
              />
              <circle cx="100" cy="8" r="2.5" fill="#F59E0B" opacity="0.75" />
            </g>
          ),
        )}
      </motion.svg>

      {/* 3. 살짝 다른 속도로 반대 회전하는 보조 광선 */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
        animate={{ rotate: -360 }}
        transition={{
          duration: 44,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[15, 75, 135, 195, 255, 315].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 100 100)`}>
            <circle cx="100" cy="22" r="4.5" fill="#FBBF24" opacity="0.6" />
          </g>
        ))}
      </motion.svg>

      {/* 4. 햇님 얼굴 본체 */}
      <motion.div
        className="relative w-[72%] h-[72%] rounded-full cursor-pointer shadow-lg"
        style={{
          background: "linear-gradient(145deg, #FFF176 0%, #FBC02D 55%, #F57F17 100%)",
          boxShadow:
            "0 8px 24px -2px rgba(216, 155, 57, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.8)",
        }}
        whileHover={{
          scale: 1.08,
          rotate: [-1, 2, -1],
          transition: { duration: 0.4 },
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* 얼굴 하이라이트 광택 */}
        <div className="absolute top-2 left-3 w-8 h-4 rounded-full bg-white/40 -rotate-25 blur-[1px]" />

        {/* ── 계절별 머리 장식 코스튬 ────────────────────────────── */}
        {/* 봄: 벚꽃 핀 */}
        {season === "spring" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1 text-lg z-20 drop-shadow-xs"
            title="화사한 봄 벚꽃"
          >
            🌸
          </motion.div>
        )}

        {/* 가을: 붉은 단풍잎 */}
        {season === "autumn" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-1.5 text-xl z-20 drop-shadow-xs rotate-12"
            title="풍요로운 가을 단풍"
          >
            🍁
          </motion.div>
        )}

        {/* 겨울: 포근한 하늘빛 털 귀마개 */}
        {season === "winter" && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* 귀마개 밴드 */}
            <svg viewBox="0 0 100 100" className="absolute -top-3 left-0 w-full h-full">
              <path
                d="M 12 40 C 12 5, 88 5, 88 40"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            {/* 왼쪽 귀 패드 */}
            <div className="absolute top-[28%] -left-2.5 w-6 h-7 rounded-full bg-sky-300 border-2 border-white shadow-xs" />
            {/* 오른쪽 귀 패드 */}
            <div className="absolute top-[28%] -right-2.5 w-6 h-7 rounded-full bg-sky-300 border-2 border-white shadow-xs" />
          </div>
        )}

        {/* ── 눈 (또는 여름 선글라스) ─────────────────────────────── */}
        {season === "summer" ? (
          /* 여름: 귀여운 선글라스 착용 */
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 z-15 flex items-center justify-center">
            <svg width="68" height="26" viewBox="0 0 68 26" fill="none">
              {/* 왼쪽 렌즈 */}
              <rect x="2" y="2" width="28" height="20" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <path d="M 6 6 L 16 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              {/* 오른쪽 렌즈 */}
              <rect x="38" y="2" width="28" height="20" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              <path d="M 42 6 L 52 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              {/* 안경 다리 연결선 */}
              <path d="M 30 11 L 38 11" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        ) : (
          /* 봄, 가을, 겨울: 동글동글 눈 (깜빡임 애니메이션) */
          <div className="absolute top-[38%] left-0 right-0 flex justify-between px-[26%]">
            <div className="relative">
              {isBlinking ? (
                <div className="w-3.5 h-1 bg-[#3A2407] rounded-full mt-1.5" />
              ) : (
                <div className="w-3.5 h-4 bg-[#3A2407] rounded-full relative flex items-start justify-end p-0.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}
            </div>

            <div className="relative">
              {isBlinking ? (
                <div className="w-3.5 h-1 bg-[#3A2407] rounded-full mt-1.5" />
              ) : (
                <div className="w-3.5 h-4 bg-[#3A2407] rounded-full relative flex items-start justify-end p-0.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 볼터치 */}
        <div className="absolute top-[50%] left-[16%] w-4 h-2.5 rounded-full bg-[#FF6B6B] opacity-45 blur-[0.5px]" />
        <div className="absolute top-[50%] right-[16%] w-4 h-2.5 rounded-full bg-[#FF6B6B] opacity-45 blur-[0.5px]" />

        {/* 웃는 입 */}
        <div className="absolute top-[56%] left-1/2 -translate-x-1/2">
          <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
            <path
              d="M2 2 C7 11, 15 11, 20 2"
              stroke="#4E2C00"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
