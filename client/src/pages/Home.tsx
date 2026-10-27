/**
 * 봄날의 햇살 — 메인 홈 페이지
 * 
 * - 사계절 맞춤 배경 모션 그래픽 (AmbientScene: 봄 벚꽃, 여름 나뭇잎/방울, 가을 단풍/은행, 겨울 눈꽃 - 데스크톱 전용)
 * - 사계절 맞춤 햇님 히어로 섹션 (SunCharacter)
 * - 5대 카테고리 탭 + 검색바
 * - 링크 카드 그리드 (순수 관리자 제어)
 * - 구글 스프레드시트 실시간 동기화 상태 및 원클릭 전송
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import CategoryTabs from "../components/CategoryTabs";
import SearchBar from "../components/SearchBar";
import LinkCard from "../components/LinkCard";
import Footer from "../components/Footer";
import AddLinkModal from "../components/AddLinkModal";
import AdminLoginModal from "../components/AdminLoginModal";
import CategoryManageModal from "../components/CategoryManageModal";
import AmbientScene from "../components/motion/AmbientScene";
import type { LinkItem, Category } from "../data/links";
import type { Season } from "../lib/season";
import { getCurrentSeason } from "../lib/season";
import {
  getAllLinks,
  removeLink,
  getAllCategories,
  resetLinks,
  refreshFromCloud,
  pushLocalToCloud,
} from "../lib/storage";
import { isCloudSyncEnabled } from "../lib/api";
import { useAdmin } from "../lib/admin";
import {
  Plus,
  FolderTree,
  RotateCcw,
  Cloud,
  CloudUpload,
} from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const { isAdmin, password } = useAdmin();
  const [links, setLinks] = useState<LinkItem[]>(getAllLinks);
  const [categories, setCategories] = useState<Category[]>(getAllCategories);
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");
  const [search, setSearch] = useState("");
  const [isPushingCloud, setIsPushingCloud] = useState(false);
  const [season] = useState<Season>(getCurrentSeason);

  // 모달 상태
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 데이터 동기화
  const refreshLinks = useCallback(() => {
    setLinks(getAllLinks());
  }, []);

  const refreshCategories = useCallback(() => {
    const cats = getAllCategories();
    setCategories(cats);
    setActiveCategory((prev) =>
      prev === "all" || cats.some((c) => c.id === prev) ? prev : "all",
    );
  }, []);

  // 마운트 시 로컬스토리지 이벤트 리스너 등록 & 구글 시트 백그라운드 갱신
  useEffect(() => {
    window.addEventListener("links-updated", refreshLinks);
    window.addEventListener("categories-updated", refreshCategories);

    if (isCloudSyncEnabled()) {
      refreshFromCloud().then((res) => {
        if (res.success) {
          refreshLinks();
          refreshCategories();
        }
      });
    }

    return () => {
      window.removeEventListener("links-updated", refreshLinks);
      window.removeEventListener("categories-updated", refreshCategories);
    };
  }, [refreshLinks, refreshCategories]);

  // 카테고리별 개수 카운트
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const cat of categories) {
      c[cat.id] = links.filter((l) => l.category === cat.id).length;
    }
    return c;
  }, [links, categories]);

  // 검색 및 카테고리 필터링
  const filteredLinks = useMemo(() => {
    let result = links;
    if (activeCategory !== "all") {
      result = result.filter((l) => l.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((l) => {
        const catObj = categories.find((c) => c.id === l.category);
        const catLabel = catObj ? catObj.label.toLowerCase() : "";
        return (
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.url.toLowerCase().includes(q) ||
          catLabel.includes(q)
        );
      });
    }
    return result;
  }, [links, activeCategory, search, categories]);

  const getColorClass = (category: string): string => {
    const cat = categories.find((c) => c.id === category);
    return cat?.colorClass ?? "strip-sunbeam";
  };

  // 삭제 처리
  const handleDelete = useCallback(
    (id: string) => {
      const target = links.find((l) => l.id === id);
      const title = target ? `"${target.title}"` : "이";
      if (window.confirm(`${title} 도구를 정말 삭제하시겠습니까?`)) {
        removeLink(id);
        refreshLinks();
        toast.success("도구가 삭제되었습니다.");
      }
    },
    [links, refreshLinks],
  );

  // 로컬 데이터를 구글 시트로 강제 동기화 (원클릭)
  const handlePushToCloud = async () => {
    if (!isCloudSyncEnabled()) {
      toast.error(
        "구글 시트 연동 URL이 아직 설정되지 않았습니다. apps-script/SETUP.md를 참고해주세요.",
      );
      return;
    }
    setIsPushingCloud(true);
    try {
      const res = await pushLocalToCloud(password);
      if (res.success) {
        toast.success("현재 브라우저의 도구와 목차가 구글 시트에 안전하게 저장되었습니다! ☁️");
      } else {
        toast.error(`시트 저장 실패: ${res.error}`);
      }
    } finally {
      setIsPushingCloud(false);
    }
  };

  // 전체 도구 초기화
  const handleResetLinks = useCallback(() => {
    if (
      window.confirm(
        "모든 도구를 초기화하시겠습니까?\n직접 추가한 모든 링크가 삭제됩니다.",
      )
    ) {
      resetLinks();
      refreshLinks();
      toast.success("도구가 초기화되었습니다.");
    }
  }, [refreshLinks]);

  const currentCategoryInfo = useMemo(() => {
    if (activeCategory === "all") return null;
    return categories.find((c) => c.id === activeCategory);
  }, [activeCategory, categories]);

  return (
    <div className="min-h-screen flex flex-col paper-texture relative selection:bg-amber-200">
      {/* ── 사계절 데스크톱 배경 모션 그래픽 (구름, 벚꽃/나뭇잎/단풍/눈꽃, 나비/잠자리, 반짝이) ── */}
      <AmbientScene season={season} />

      {/* 헤더 */}
      <Header
        onOpenAdd={() => {
          setEditingLink(null);
          setShowAddModal(true);
        }}
        onOpenManageCategories={() => setShowCategoryModal(true)}
        onOpenLogin={() => setShowLoginModal(true)}
      />

      {/* 사계절 맞춤 히어로 섹션 */}
      <HeroSection season={season} />

      {/* 메인 콘텐츠 영역 */}
      <main className="container flex-1 pb-20 relative z-10" id="main-content">
        {/* 관리자 툴바 (관리자 모드 로그인 시 노출) */}
        {isAdmin && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-amber-900">
              <span className="text-base">👑</span>
              <span>관리자 모드 활성화 중</span>
              <span className="text-[11px] font-normal text-muted-foreground hidden lg:inline">
                (카드의 수정/삭제 버튼을 이용하거나 도구를 추가하세요)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isCloudSyncEnabled() ? (
                <button
                  type="button"
                  onClick={handlePushToCloud}
                  disabled={isPushingCloud}
                  className="px-3 py-1.5 rounded-xl bg-card border border-amber-400 text-xs font-bold text-amber-900 hover:bg-amber-100/50 transition-all flex items-center gap-1 shadow-2xs"
                  title="현재 브라우저에 저장된 도구 목록을 구글 시트에 즉시 덮어씁니다"
                >
                  <CloudUpload className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isPushingCloud ? "동기화 중..." : "시트로 내보내기"}</span>
                </button>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-[11px] font-semibold text-amber-900 flex items-center gap-1">
                  <Cloud className="w-3 h-3 text-amber-600" />
                  <span>로컬 캐시 모드</span>
                </span>
              )}

              <button
                type="button"
                onClick={() => setShowCategoryModal(true)}
                className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted transition-all flex items-center gap-1"
              >
                <FolderTree className="w-3.5 h-3.5 text-muted-foreground" />
                <span>목차 관리</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingLink(null);
                  setShowAddModal(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-all flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>도구 추가</span>
              </button>

              <button
                type="button"
                onClick={handleResetLinks}
                className="px-2.5 py-1.5 rounded-xl text-xs text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="전체 도구 초기화"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* 탭 + 검색 영역 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
            counts={counts}
            isAdmin={isAdmin}
            onOpenManageCategories={() => setShowCategoryModal(true)}
          />
          <div className="w-full md:w-80">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>

        {/* 선택된 카테고리 안내 문구 */}
        {currentCategoryInfo && (
          <div className="mb-6 flex items-center gap-2 text-sm text-ink-light bg-card/60 px-4 py-2.5 rounded-xl border border-border/60">
            <span className="text-lg">{currentCategoryInfo.icon}</span>
            <span className="font-semibold text-foreground">
              {currentCategoryInfo.label}:
            </span>
            <span>{currentCategoryInfo.description}</span>
          </div>
        )}

        {/* 링크 카드 그리드 */}
        {filteredLinks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLinks.map((link, i) => (
              <LinkCard
                key={link.id}
                link={link}
                colorClass={getColorClass(link.category)}
                isAdmin={isAdmin}
                onEdit={(item) => setEditingLink(item)}
                onDelete={handleDelete}
                index={i}
              />
            ))}
          </div>
        ) : (
          /* 빈 화면 (일러스트와 다정한 안내) */
          <div className="text-center py-20 px-4 rounded-3xl bg-card/60 border border-border/80 shadow-xs max-w-xl mx-auto my-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-500/15 flex items-center justify-center text-4xl shadow-inner">
              ☀️
            </div>
            <h3
              className="text-lg font-bold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {search
                ? `"${search}"에 해당하는 도구를 찾지 못했어요.`
                : activeCategory === "all"
                  ? "아직 등록된 도구가 없어요."
                  : `'${currentCategoryInfo?.label || ""}' 목차에 등록된 도구가 없어요.`}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
              {isAdmin
                ? "상단의 '+ 도구 추가' 버튼을 눌러 내가 만든 웹앱이나 자주 쓰는 도구의 링크를 등록해보세요!"
                : "선생님께서 도구를 준비하고 있습니다. 잠시 후 다시 확인해주세요."}
            </p>

            {isAdmin && (
              <button
                onClick={() => {
                  setEditingLink(null);
                  setShowAddModal(true);
                }}
                className="mt-6 px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs md:text-sm font-bold hover:bg-amber-700 transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>새 도구 등록하기</span>
              </button>
            )}
          </div>
        )}
      </main>

      {/* 푸터 */}
      <Footer />

      {/* 모달창들 */}
      {(showAddModal || editingLink) && (
        <AddLinkModal
          initialData={editingLink}
          onClose={() => {
            setShowAddModal(false);
            setEditingLink(null);
          }}
        />
      )}

      {showCategoryModal && (
        <CategoryManageModal
          onClose={() => setShowCategoryModal(false)}
          onUpdated={refreshCategories}
        />
      )}

      {showLoginModal && (
        <AdminLoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
}
