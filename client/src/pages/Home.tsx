/**
 * 봄날의 햇살 — 메인 홈 페이지
 * 히어로 + 카테고리 탭 + 링크 카드 그리드 + 검색 + 관리자 모드
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
import type { LinkItem, Category } from "../data/links";
import {
  getAllLinks,
  removeLink,
  getAllCategories,
  resetLinks,
} from "../lib/storage";
import { useAdmin } from "../lib/admin";
import { toast } from "sonner";

export default function Home() {
  const { isAdmin } = useAdmin();
  const [links, setLinks] = useState<LinkItem[]>(getAllLinks);
  const [categories, setCategories] = useState<Category[]>(getAllCategories);
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");
  const [search, setSearch] = useState("");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Sync links
  const refreshLinks = useCallback(() => {
    setLinks(getAllLinks());
  }, []);

  // Sync categories
  const refreshCategories = useCallback(() => {
    const cats = getAllCategories();
    setCategories(cats);
    // If active category was deleted, fallback to 'all'
    setActiveCategory((prev) =>
      prev === "all" || cats.some((c) => c.id === prev) ? prev : "all",
    );
  }, []);

  useEffect(() => {
    window.addEventListener("links-updated", refreshLinks);
    window.addEventListener("categories-updated", refreshCategories);
    return () => {
      window.removeEventListener("links-updated", refreshLinks);
      window.removeEventListener("categories-updated", refreshCategories);
    };
  }, [refreshLinks, refreshCategories]);

  // Counts per category
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const cat of categories) {
      c[cat.id] = links.filter((l) => l.category === cat.id).length;
    }
    return c;
  }, [links, categories]);

  // Filtered links
  const filteredLinks = useMemo(() => {
    let result = links;
    if (activeCategory !== "all") {
      result = result.filter((l) => l.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [links, activeCategory, search]);

  // Get color class for a link
  const getColorClass = (category: string): string => {
    const cat = categories.find((c) => c.id === category);
    return cat?.colorClass ?? "strip-sunbeam";
  };

  // Delete handler
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

  // Reset all links to initial default
  const handleResetLinks = useCallback(() => {
    if (
      window.confirm(
        "모든 도구 데이터를 초기 기본 상태로 복원하시겠습니까?\n직접 추가하거나 수정한 도구가 초기화됩니다.",
      )
    ) {
      resetLinks();
      refreshLinks();
      toast.success("도구 데이터가 초기 상태로 복원되었습니다.");
    }
  }, [refreshLinks]);

  // Active category info
  const currentCategoryInfo = useMemo(() => {
    if (activeCategory === "all") return null;
    return categories.find((c) => c.id === activeCategory);
  }, [activeCategory, categories]);

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <Header
        onOpenAdd={() => {
          setEditingLink(null);
          setShowAddModal(true);
        }}
        onOpenManageCategories={() => setShowCategoryModal(true)}
        onOpenLogin={() => setShowLoginModal(true)}
      />

      <HeroSection categories={categories} />

      {/* Main Content */}
      <main className="container flex-1 pb-16" id="main-content">
        {/* Admin Bar (visible when Admin Mode is ON) */}
        {isAdmin && (
          <div className="mb-6 p-3.5 rounded-2xl bg-sunbeam/10 border border-sunbeam/30 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-sunbeam-dark">
              <span>👑</span>
              <span>관리자 모드가 활성화되어 있습니다.</span>
              <span className="text-[0.75rem] font-normal text-muted-foreground hidden sm:inline">
                (카드의 ✏️수정 / 🗑️삭제 버튼과 상단 목차 편집을 이용하세요)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCategoryModal(true)}
                className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                📑 목차 관리
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingLink(null);
                  setShowAddModal(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-sunbeam text-white text-xs font-semibold hover:bg-sunbeam-dark transition-colors shadow-xs"
              >
                ➕ 도구 추가
              </button>
              <button
                type="button"
                onClick={handleResetLinks}
                className="px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="초기 기본 도구 데이터로 되돌리기"
              >
                도구 초기화
              </button>
            </div>
          </div>
        )}

        {/* Toolbar: Tabs + Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
            counts={counts}
            isAdmin={isAdmin}
            onOpenManageCategories={() => setShowCategoryModal(true)}
          />
          <div className="w-full md:w-72">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>

        {/* Category description */}
        {currentCategoryInfo && (
          <div className="mb-6 animate-fadeIn">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="text-base">{currentCategoryInfo.icon}</span>
              <span>{currentCategoryInfo.description}</span>
            </p>
          </div>
        )}

        {/* Links Grid */}
        {filteredLinks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="text-center py-20 animate-fadeIn">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-muted-foreground font-medium">
              {search
                ? `"${search}"에 해당하는 도구를 찾지 못했어요.`
                : "이 목차에 등록된 도구가 없어요."}
            </p>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingLink(null);
                  setShowAddModal(true);
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-sunbeam text-white text-xs font-semibold hover:bg-sunbeam-dark transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>➕</span>
                <span>이 목차에 도구 추가하기</span>
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />

      {/* Modals */}
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
