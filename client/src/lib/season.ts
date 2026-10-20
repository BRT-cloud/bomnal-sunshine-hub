/**
 * 봄날의 햇살 - 사계절 테마 관리
 * 
 * - 3, 4, 5월: 봄 (Spring) - 흩날리는 벚꽃잎, 나비, 꽃잎을 단 햇님
 * - 6, 7, 8월: 여름 (Summer) - 싱그러운 나뭇잎과 방울, 선글라스를 쓴 햇님
 * - 9, 10, 11월: 가을 (Autumn) - 바람에 흩날리는 붉은 단풍잎과 노란 은행잎
 * - 12, 1, 2월: 겨울 (Winter) - 소복소복 내리는 눈송이, 털모자/귀마개를 한 햇님
 */

export type Season = "spring" | "summer" | "autumn" | "winter";

export interface SeasonConfig {
  id: Season;
  name: string;
  months: string;
  icon: string;
  greeting: string;
  subtitle: string;
  badgeBg: string;
  badgeText: string;
  sunAccent: string;
}

export const SEASONS: Record<Season, SeasonConfig> = {
  spring: {
    id: "spring",
    name: "봄",
    months: "3월 ~ 5월",
    icon: "🌸",
    greeting: "살랑살랑 봄바람과 따스한 햇살",
    subtitle: "새로운 학기, 설레는 발걸음과 함께하는 도구들",
    badgeBg: "bg-rose-500/15 border-rose-400/40",
    badgeText: "text-rose-900",
    sunAccent: "flower",
  },
  summer: {
    id: "summer",
    name: "여름",
    months: "6월 ~ 8월",
    icon: "🌿",
    greeting: "싱그러운 초록빛과 빛나는 여름 햇살",
    subtitle: "에너지 넘치는 교실, 시원하게 꺼내 쓰는 도구들",
    badgeBg: "bg-emerald-500/15 border-emerald-400/40",
    badgeText: "text-emerald-900",
    sunAccent: "sunglasses",
  },
  autumn: {
    id: "autumn",
    name: "가을",
    months: "9월 ~ 11월",
    icon: "🍁",
    greeting: "붉은 단풍과 풍요로운 가을 햇살",
    subtitle: "알차게 여무는 배움, 깊이를 더하는 교육 도구들",
    badgeBg: "bg-amber-600/15 border-amber-500/40",
    badgeText: "text-amber-950",
    sunAccent: "maple",
  },
  winter: {
    id: "winter",
    name: "겨울",
    months: "12월 ~ 2월",
    icon: "❄️",
    greeting: "소복소복 하얀 눈송이와 포근한 햇살",
    subtitle: "한 해를 정리하고 다음을 준비하는 따뜻한 도구들",
    badgeBg: "bg-sky-500/15 border-sky-400/40",
    badgeText: "text-sky-950",
    sunAccent: "earmuffs",
  },
};

/**
 * 현재 월(Month)을 기준으로 계절 판별
 */
export function getAutoSeason(): Season {
  const month = new Date().getMonth() + 1; // 1~12
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter"; // 12, 1, 2
}

const SEASON_STORAGE_KEY = "bomnal_season_override";

export function getSelectedSeason(): Season {
  try {
    const saved = sessionStorage.getItem(SEASON_STORAGE_KEY) as Season | null;
    if (saved && (saved === "spring" || saved === "summer" || saved === "autumn" || saved === "winter")) {
      return saved;
    }
  } catch {
    // fallback
  }
  return getAutoSeason();
}

export function setSelectedSeason(season: Season | null): void {
  try {
    if (!season) {
      sessionStorage.removeItem(SEASON_STORAGE_KEY);
    } else {
      sessionStorage.setItem(SEASON_STORAGE_KEY, season);
    }
    window.dispatchEvent(new Event("season-changed"));
  } catch {
    // ignore
  }
}
