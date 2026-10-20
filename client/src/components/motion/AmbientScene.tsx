/**
 * 봄날의 햇살 - 사계절 맞춤 배경 모션 그래픽 (AmbientScene)
 * 
 * - 3, 4, 5월: 봄 (Spring) - 흩날리는 벚꽃 꽃잎, 나비, 맑은 봄 구름
 * - 6, 7, 8월: 여름 (Summer) - 싱그러운 초록 나뭇잎, 영롱한 방울, 푸른 여름 하늘
 * - 9, 10, 11월: 가을 (Autumn) - 바람에 나부끼는 붉은 단풍잎과 노란 은행잎
 * - 12, 1, 2월: 겨울 (Winter) - 소복소복 내리는 다양한 눈송이와 겨울 서리 반짝이
 * 
 * 사용자 요청: "컴퓨터에서만 보이도록 해줘." -> hidden md:block 유지
 */
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { Season } from "../../lib/season";

interface FallingParticle {
  id: number;
  startX: number;
  delay: number;
  duration: number;
  size: number;
  swayDistance: number;
  rotation: number;
  type?: number;
}

interface AmbientSceneProps {
  season?: Season;
}

export default function AmbientScene({ season = "spring" }: AmbientSceneProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  // 계절별 떨어지는 입자들 생성
  const particles: FallingParticle[] = useMemo(() => {
    const count = season === "winter" ? 18 : 14;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      startX: (i * (100 / count) + (i % 3) * 2) % 100,
      delay: i * 1.4,
      duration: season === "winter" ? 10 + (i % 6) * 2 : 12 + (i % 5) * 2.5,
      size: 14 + (i % 4) * 4,
      swayDistance: 30 + (i % 3) * 25,
      rotation: (i * 47) % 360,
      type: i % 2, // 0 또는 1 (단풍/은행잎, 꽃잎 크기 등 구분)
    }));
  }, [season]);

  if (!isDesktop) {
    return null; // 컴퓨터 화면에서만 표시
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 hidden md:block select-none"
      aria-hidden="true"
    >
      {/* ── 1. 공통: 부드럽게 흘러가는 구름 ─────────────────────────── */}
      <motion.div
        className="absolute top-10 text-white/70 filter drop-shadow-xs"
        initial={{ x: "-15vw" }}
        animate={{ x: "110vw" }}
        transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
      >
        <svg width="140" height="60" viewBox="0 0 140 60" fill="currentColor">
          <path d="M20 50 A 20 20 0 0 1 50 25 A 30 30 0 0 1 95 20 A 25 25 0 0 1 125 45 A 15 15 0 0 1 120 55 L 20 55 Z" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-48 text-white/45 filter drop-shadow-2xs"
        initial={{ x: "-20vw" }}
        animate={{ x: "115vw" }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear", delay: 25 }}
      >
        <svg width="180" height="70" viewBox="0 0 190 75" fill="currentColor">
          <path d="M25 60 A 25 25 0 0 1 65 30 A 40 40 0 0 1 125 22 A 32 32 0 0 1 168 52 A 20 20 0 0 1 160 65 L 25 65 Z" />
        </svg>
      </motion.div>

      {/* ── 2. 계절별 하늘을 나는 생물 / 장식 ──────────────────────── */}
      {/* 봄: 춤추는 나비 */}
      {season === "spring" && (
        <>
          <motion.div
            className="absolute top-[32%] left-[10%]"
            animate={{
              x: [0, 180, 320, 240, 60, 0],
              y: [0, -60, -30, 70, 40, 0],
              rotate: [0, 15, -10, 20, -15, 0],
            }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              animate={{ scaleX: [1, 0.25, 1] }}
              transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-6"
            >
              <svg viewBox="0 0 32 32" fill="none">
                <path d="M16 16 C8 6, 2 10, 4 18 C6 24, 14 20, 16 16 Z" fill="#FDE047" stroke="#D97706" strokeWidth="0.8" />
                <path d="M16 16 C24 6, 30 10, 28 18 C26 24, 18 20, 16 16 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
                <path d="M16 10 L16 22" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute top-[58%] right-[12%]"
            animate={{
              x: [0, -160, -280, -140, 40, 0],
              y: [0, 50, -40, -80, 20, 0],
              rotate: [0, -20, 15, -10, 25, 0],
            }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          >
            <motion.div
              animate={{ scaleX: [1, 0.3, 1] }}
              transition={{ duration: 0.38, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-5"
            >
              <svg viewBox="0 0 32 32" fill="none">
                <path d="M16 16 C8 6, 2 10, 4 18 C6 24, 14 20, 16 16 Z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="0.8" />
                <path d="M16 16 C24 6, 30 10, 28 18 C26 24, 18 20, 16 16 Z" fill="#7DD3FC" stroke="#0284C7" strokeWidth="0.8" />
                <path d="M16 10 L16 22" stroke="#0369A1" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </motion.div>
          </motion.div>
        </>
      )}

      {/* 여름: 날아다니는 고추잠자리 */}
      {season === "summer" && (
        <motion.div
          className="absolute top-[36%] left-[15%]"
          animate={{
            x: [0, 240, 480, 320, 100, 0],
            y: [0, -40, 20, -50, 30, 0],
            rotate: [0, 20, -15, 30, -20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-8 h-8 relative">
            <svg viewBox="0 0 40 40" fill="none">
              {/* 잠자리 날개 */}
              <ellipse cx="14" cy="16" rx="10" ry="3.5" fill="#E0F2FE" opacity="0.8" stroke="#0284C7" strokeWidth="0.6" transform="rotate(-20 14 16)" />
              <ellipse cx="26" cy="16" rx="10" ry="3.5" fill="#E0F2FE" opacity="0.8" stroke="#0284C7" strokeWidth="0.6" transform="rotate(20 26 16)" />
              <ellipse cx="15" cy="22" rx="8" ry="3" fill="#E0F2FE" opacity="0.7" stroke="#0284C7" strokeWidth="0.6" transform="rotate(-15 15 22)" />
              <ellipse cx="25" cy="22" rx="8" ry="3" fill="#E0F2FE" opacity="0.7" stroke="#0284C7" strokeWidth="0.6" transform="rotate(15 25 22)" />
              {/* 잠자리 몸통 */}
              <circle cx="20" cy="14" r="2.5" fill="#DC2626" />
              <path d="M20 16 L20 32" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </motion.div>
      )}

      {/* 가을: 고추잠자리 / 가을 나비 */}
      {season === "autumn" && (
        <motion.div
          className="absolute top-[42%] right-[16%]"
          animate={{
            x: [0, -220, -400, -260, 50, 0],
            y: [0, 60, -30, -70, 30, 0],
            rotate: [0, -15, 20, -10, 15, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ scaleX: [1, 0.35, 1] }}
            transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-6"
          >
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M16 16 C8 6, 2 10, 4 18 C6 24, 14 20, 16 16 Z" fill="#FB923C" stroke="#C2410C" strokeWidth="0.8" />
              <path d="M16 16 C24 6, 30 10, 28 18 C26 24, 18 20, 16 16 Z" fill="#F97316" stroke="#C2410C" strokeWidth="0.8" />
              <path d="M16 10 L16 22" stroke="#7C2D12" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        </motion.div>
      )}

      {/* ── 3. 계절별 떨어지는 입자들 ───────────────────────────────── */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.startX}vw`,
            top: "-45px",
            width: p.size,
            height: p.size * (season === "winter" ? 1 : 1.25),
          }}
          initial={{ y: -50, opacity: 0, rotate: p.rotation }}
          animate={{
            y: "108vh",
            x: [
              0,
              p.swayDistance,
              -p.swayDistance * 0.7,
              p.swayDistance * 0.8,
              0,
            ],
            rotate: [p.rotation, p.rotation + 180, p.rotation + 360],
            opacity: [0, 0.85, 0.9, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          {/* 봄: 벚꽃 꽃잎 */}
          {season === "spring" && (
            <svg viewBox="0 0 24 30" fill="none" className="w-full h-full drop-shadow-[0_2px_4px_rgba(255,182,193,0.35)]">
              <path
                d="M12 2 C18 6, 23 15, 18 24 C14 30, 10 30, 6 24 C1 15, 6 6, 12 2 Z"
                fill="url(#springPetalGrad)"
                opacity="0.9"
              />
            </svg>
          )}

          {/* 여름: 싱그러운 초록 나뭇잎 또는 비눗방울 */}
          {season === "summer" && (
            p.type === 0 ? (
              /* 초록 나뭇잎 */
              <svg viewBox="0 0 24 30" fill="none" className="w-full h-full drop-shadow-[0_2px_4px_rgba(34,197,94,0.25)]">
                <path
                  d="M12 2 C20 8, 22 22, 12 28 C2 22, 4 8, 12 2 Z"
                  fill="url(#summerLeafGrad)"
                  opacity="0.85"
                />
                <path d="M12 5 L12 26" stroke="#15803D" strokeWidth="0.8" opacity="0.6" />
              </svg>
            ) : (
              /* 영롱한 비눗방울 */
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <circle cx="12" cy="12" r="10" fill="url(#summerBubbleGrad)" opacity="0.65" stroke="#38BDF8" strokeWidth="0.8" />
                <ellipse cx="9" cy="8" rx="3" ry="1.5" fill="white" opacity="0.75" transform="rotate(-30 9 8)" />
              </svg>
            )
          )}

          {/* 가을: 붉은 단풍잎 또는 황금 은행잎 */}
          {season === "autumn" && (
            p.type === 0 ? (
              /* 붉은 단풍잎 (Maple Leaf) */
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full drop-shadow-[0_2px_4px_rgba(185,28,28,0.3)]">
                <path
                  d="M16 2 L18 8 L24 6 L22 12 L28 14 L24 18 L28 22 L20 22 L20 28 L16 24 L12 28 L12 22 L4 22 L8 18 L4 14 L10 12 L8 6 L14 8 Z"
                  fill="url(#autumnMapleGrad)"
                  opacity="0.9"
                />
                <path d="M16 12 L16 30" stroke="#7F1D1D" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            ) : (
              /* 노란 은행잎 (Ginkgo Leaf) */
              <svg viewBox="0 0 30 30" fill="none" className="w-full h-full drop-shadow-[0_2px_4px_rgba(234,179,8,0.3)]">
                <path
                  d="M15 28 C15 22, 8 16, 4 10 C8 4, 22 4, 26 10 C22 16, 15 22, 15 28 Z"
                  fill="url(#autumnGinkgoGrad)"
                  opacity="0.9"
                />
                <path d="M15 28 L15 12" stroke="#A16207" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            )
          )}

          {/* 겨울: 반짝이는 정교한 눈송이 (Snowflake) */}
          {season === "winter" && (
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-[0_2px_6px_rgba(56,189,248,0.4)]">
              {/* 6방향 눈꽃 크리스털 */}
              <g stroke="url(#winterSnowGrad)" strokeWidth="1.6" strokeLinecap="round">
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="3.3" y1="7" x2="20.7" y2="17" />
                <line x1="3.3" y1="17" x2="20.7" y2="7" />
                {/* 곁가지 장식 */}
                <path d="M9 5 L12 8 L15 5" fill="none" />
                <path d="M9 19 L12 16 L15 19" fill="none" />
                <path d="M5 10 L8 12 L6 15" fill="none" />
                <path d="M19 14 L16 12 L18 9" fill="none" />
              </g>
              <circle cx="12" cy="12" r="2" fill="white" />
            </svg>
          )}
        </motion.div>
      ))}

      {/* ── 4. 사계절 그라디언트 정의 모음 ──────────────────────────── */}
      <svg width="0" height="0" className="absolute">
        <defs>
          {/* 봄 벚꽃 */}
          <linearGradient id="springPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE4E6" />
            <stop offset="60%" stopColor="#FDA4AF" />
            <stop offset="100%" stopColor="#FB7185" />
          </linearGradient>

          {/* 여름 나뭇잎 & 방울 */}
          <linearGradient id="summerLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="60%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <radialGradient id="summerBubbleGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#7DD3FC" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.7" />
          </radialGradient>

          {/* 가을 단풍 & 은행 */}
          <linearGradient id="autumnMapleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCA5A5" />
            <stop offset="40%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
          <linearGradient id="autumnGinkgoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="60%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>

          {/* 겨울 눈꽃 */}
          <linearGradient id="winterSnowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#BAE6FD" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── 5. 계절별 반짝이 효과 ─────────────────────────────────── */}
      <div className="absolute top-28 left-[18%] animate-sparkle">
        {season === "winter" ? "❄️" : season === "autumn" ? "✨" : season === "summer" ? "☀️" : "🌸"}
      </div>
      <div className="absolute top-72 right-[22%] animate-sparkle" style={{ animationDelay: "1.2s" }}>
        ✨
      </div>
      <div className="absolute bottom-40 left-[8%] animate-sparkle" style={{ animationDelay: "2.4s" }}>
        {season === "winter" ? "❄️" : season === "autumn" ? "🍁" : "✨"}
      </div>
      <div className="absolute bottom-24 right-[10%] animate-sparkle" style={{ animationDelay: "0.8s" }}>
        ✨
      </div>
    </div>
  );
}
