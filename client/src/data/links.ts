/**
 * 봄날의 햇살 - 링크 데이터 타입 및 기본 카테고리 정의
 */

export type CategoryId = string;

export interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: CategoryId;
  icon?: string;
  order?: number;
  isCustom?: boolean;
}

export interface Category {
  id: string;
  label: string;
  description: string;
  colorClass: string;
  bgClass: string;
  textClass: string;
  icon: string;
  order?: number;
}

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "teaching",
    label: "수업 도구",
    description: "수업 준비와 진행에 필요한 나만의 맞춤 도구",
    colorClass: "strip-sunbeam",
    bgClass: "bg-amber-500/10",
    textClass: "text-amber-800",
    icon: "📖",
    order: 1,
  },
  {
    id: "management",
    label: "학급 관리",
    description: "학급 운영과 학생 관리를 위한 스마트 도구",
    colorClass: "strip-sage",
    bgClass: "bg-emerald-500/10",
    textClass: "text-emerald-800",
    icon: "📋",
    order: 2,
  },
  {
    id: "curriculum",
    label: "교육과정",
    description: "교육과정 편성, 수업 설계, 진도 관리 도구",
    colorClass: "strip-sky",
    bgClass: "bg-sky-500/10",
    textClass: "text-sky-800",
    icon: "🎓",
    order: 3,
  },
  {
    id: "behavior",
    label: "행동지원",
    description: "학생 행동 관찰 및 긍정적 행동지원 도구",
    colorClass: "strip-coral",
    bgClass: "bg-rose-500/10",
    textClass: "text-rose-800",
    icon: "🤝",
    order: 4,
  },
  {
    id: "etc",
    label: "기타",
    description: "기타 유용한 링크 및 편의 웹앱",
    colorClass: "strip-lavender",
    bgClass: "bg-purple-500/10",
    textClass: "text-purple-800",
    icon: "✨",
    order: 5,
  },
];

export const CATEGORIES = DEFAULT_CATEGORIES;

/**
 * 기존 기본 링크들은 모두 제거하고, 사용자가 직접 만든 도구들만 관리자 모드로 등록하여 사용합니다.
 */
export const DEFAULT_LINKS: LinkItem[] = [];
