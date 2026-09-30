/**
 * 봄날의 햇살 — 메인 홈 페이지
 * 히어로 + 카테고리 탭 + 링크 카드 그리드 + 검색
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import CategoryTabs from "../components/CategoryTabs";
import SearchBar from "../components/SearchBar";
import LinkCard from "../components/LinkCard";
import Footer from "../components/Footer";
import { CATEGORIES, type CategoryId } from "../data/links";
import { getAllLinks, removeLink } from "../lib/storage";
import { toast } from "sonner";

export default function Home() {
  const [links, setLinks] = useState(getAllLinks);
  const [activeCategory, setActiveCategory] = useState<CategoryId | "all">(
    "all",
  );
  const [search, setSearch] = useState("");

  // Listen for link updates from AddLinkModal
  const refreshLinks = useCallback(() => {
    setLinks(getAllLinks());
  }, []);

  useEffect(() => {
    window.addEventListener("links-updated", refreshLinks);
    return () => window.removeEventListener("links-updated", refreshLinks);
  }, [refreshLinks]);

  // Counts per category
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      c[cat.id] = links.filter((l) => l.category === cat.id).length;
    }
    return c;
  }, [links]);

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
  const getColorClass = (category: CategoryId): string => {
    const cat = CATEGORIES.find((c) => c.id === category);
    return cat?.colorClass ?? "strip-sunbeam";
  };

  // Delete handler
  const handleDelete = useCallback(
    (id: string) => {
      removeLink(id);
      refreshLinks();
      toast.success("도구가 삭제되었습니다.");
    },
    [refreshLinks],
  );

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <Header />
      <HeroSection />

      {/* Main Content */}
      <main className="container flex-1 pb-16" id="main-content">
        {/* Toolbar: Tabs + Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <CategoryTabs
            activeCategory={activeCategory}
            onChange={setActiveCategory}
            counts={counts}
          />
          <div className="w-full md:w-72">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>

        {/* Category description */}
        {activeCategory !== "all" && (
          <div className="mb-6 animate-fadeIn">
            <p className="text-sm text-muted-foreground">
              {CATEGORIES.find((c) => c.id === activeCategory)?.description}
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
                onDelete={link.isCustom ? handleDelete : undefined}
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
                : "이 카테고리에 등록된 도구가 없어요."}
            </p>
            <p className="text-sm text-muted-foreground/70 mt-2">
              상단의 &ldquo;도구 추가&rdquo; 버튼으로 새로운 도구를 추가해보세요.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
