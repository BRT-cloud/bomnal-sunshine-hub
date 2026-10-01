/**
 * 봄날의 햇살 - 링크 데이터 타입 및 카테고리 정의
 */

export type CategoryId = string;

export interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: CategoryId;
  icon?: string;
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
}

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "teaching",
    label: "수업 도구",
    description: "수업 준비와 진행에 도움이 되는 도구들",
    colorClass: "strip-sunbeam",
    bgClass: "bg-sunbeam/10",
    textClass: "text-sunbeam-dark",
    icon: "📖",
  },
  {
    id: "management",
    label: "학급 관리",
    description: "학급 운영과 학생 관리를 위한 도구들",
    colorClass: "strip-sage",
    bgClass: "bg-sage/10",
    textClass: "text-sage",
    icon: "📋",
  },
  {
    id: "content",
    label: "콘텐츠 제작",
    description: "교육 자료와 콘텐츠 제작 도구들",
    colorClass: "strip-coral",
    bgClass: "bg-coral/10",
    textClass: "text-coral",
    icon: "🎨",
  },
  {
    id: "community",
    label: "커뮤니티",
    description: "교육 커뮤니티와 소통 플랫폼",
    colorClass: "strip-sky",
    bgClass: "bg-sky/10",
    textClass: "text-sky",
    icon: "💬",
  },
];

export const CATEGORIES = DEFAULT_CATEGORIES;

export const DEFAULT_LINKS: LinkItem[] = [
  // 수업 도구
  {
    id: "canva-edu",
    title: "Canva for Education",
    description: "교육용 무료 디자인 도구. 프레젠테이션, 워크시트, 포스터를 손쉽게 만들 수 있어요.",
    url: "https://www.canva.com/education/",
    category: "teaching",
    icon: "🎨",
  },
  {
    id: "kahoot",
    title: "Kahoot!",
    description: "게임 기반 학습 플랫폼. 퀴즈로 수업을 재미있게 만들어 보세요.",
    url: "https://kahoot.com/",
    category: "teaching",
    icon: "🎮",
  },
  {
    id: "padlet",
    title: "Padlet",
    description: "온라인 협업 게시판. 학생들과 아이디어를 나누고 함께 만들어요.",
    url: "https://padlet.com/",
    category: "teaching",
    icon: "📌",
  },
  {
    id: "google-classroom",
    title: "Google Classroom",
    description: "과제 배부, 제출, 채점을 한 곳에서. 구글 계정으로 바로 시작하세요.",
    url: "https://classroom.google.com/",
    category: "teaching",
    icon: "📚",
  },
  {
    id: "mentimeter",
    title: "Mentimeter",
    description: "실시간 투표와 질문 도구. 수업 중 학생 참여를 높여요.",
    url: "https://www.mentimeter.com/",
    category: "teaching",
    icon: "📊",
  },
  {
    id: "quizlet",
    title: "Quizlet",
    description: "플래시카드와 학습 게임으로 효과적인 복습을 도와줍니다.",
    url: "https://quizlet.com/",
    category: "teaching",
    icon: "🃏",
  },

  // 학급 관리
  {
    id: "classting",
    title: "클래스팅",
    description: "알림장, 출결, 학부모 소통을 한번에 관리하는 스마트 학급 플랫폼.",
    url: "https://www.classting.com/",
    category: "management",
    icon: "🏫",
  },
  {
    id: "neis",
    title: "NEIS 나이스",
    description: "교육행정정보시스템. 학생 정보, 성적, 출결 등을 관리하세요.",
    url: "https://www.neis.go.kr/",
    category: "management",
    icon: "🗂️",
  },
  {
    id: "school-info",
    title: "학교알리미",
    description: "학교 공시 정보를 쉽게 검색하고 확인할 수 있어요.",
    url: "https://www.schoolinfo.go.kr/",
    category: "management",
    icon: "🔍",
  },
  {
    id: "edunet",
    title: "에듀넷·티-클리어",
    description: "교수학습 자료, 교육과정 정보를 제공하는 교육부 플랫폼.",
    url: "https://www.edunet.net/",
    category: "management",
    icon: "📑",
  },

  // 콘텐츠 제작
  {
    id: "book-creator",
    title: "Book Creator",
    description: "학생들이 직접 디지털 책을 만들 수 있는 창작 도구.",
    url: "https://bookcreator.com/",
    category: "content",
    icon: "📘",
  },
  {
    id: "genially",
    title: "Genially",
    description: "인터랙티브 프레젠테이션, 인포그래픽, 게임을 만들어보세요.",
    url: "https://genial.ly/",
    category: "content",
    icon: "✨",
  },
  {
    id: "edpuzzle",
    title: "Edpuzzle",
    description: "동영상에 퀴즈를 삽입하여 학습 효과를 높이는 도구.",
    url: "https://edpuzzle.com/",
    category: "content",
    icon: "🎬",
  },
  {
    id: "miricanvas",
    title: "미리캔버스",
    description: "한국형 디자인 도구. 학교 행사 포스터, 안내장 등을 쉽게 만들어요.",
    url: "https://www.miricanvas.com/",
    category: "content",
    icon: "🖼️",
  },
  {
    id: "remove-bg",
    title: "Remove.bg",
    description: "이미지 배경을 한 클릭으로 제거. 교육 자료 만들 때 유용해요.",
    url: "https://www.remove.bg/",
    category: "content",
    icon: "✂️",
  },

  // 커뮤니티
  {
    id: "indischool",
    title: "인디스쿨",
    description: "초등교사 커뮤니티. 수업 자료와 교육 정보를 나눠요.",
    url: "https://www.indischool.com/",
    category: "community",
    icon: "👩‍🏫",
  },
  {
    id: "jamt",
    title: "참쌤스쿨",
    description: "교사 콘텐츠 크리에이터 커뮤니티. 다양한 수업 자료를 공유합니다.",
    url: "https://chamssaem.com/",
    category: "community",
    icon: "🌟",
  },
  {
    id: "ssam-gle",
    title: "쌤글",
    description: "교사들의 글쓰기 플랫폼. 교육 이야기를 나누고 소통해요.",
    url: "https://teacher.ssam.kr/",
    category: "community",
    icon: "✍️",
  },
  {
    id: "keris",
    title: "KERIS 연구정보",
    description: "한국교육학술정보원. 교육 연구 자료와 정책 정보를 확인하세요.",
    url: "https://www.keris.or.kr/",
    category: "community",
    icon: "🔬",
  },
];
