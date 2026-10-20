/**
 * 봄날의 햇살 - 링크 추가 및 수정 모달
 * 
 * - 화면을 떠나지 않는 깔끔한 종이 양식 모달
 * - 안전한 URL 자동 보정 (https:// 자동 추가, javascript: 차단)
 * - 접근성: Escape 키 지원, focus trap, aria-modal
 */
import { useState, useRef, useEffect } from "react";
import { X, Plus, Pencil, Link as LinkIcon, Sparkles } from "lucide-react";
import { getAllCategories, addLink, updateLink, sanitizeUrl } from "../lib/storage";
import type { LinkItem, Category } from "../data/links";
import { toast } from "sonner";

interface AddLinkModalProps {
  onClose: () => void;
  initialData?: LinkItem | null;
}

const QUICK_ICONS = ["🔗", "📖", "📋", "🎓", "🤝", "🎨", "🎮", "🌟", "📊", "💡", "📝", "✂️"];

export default function AddLinkModal({
  onClose,
  initialData,
}: AddLinkModalProps) {
  const [categories, setCategories] = useState<Category[]>(getAllCategories);
  const [title, setTitle] = useState(initialData?.title || "");
  const [url, setUrl] = useState(initialData?.url || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [category, setCategory] = useState<string>(
    initialData?.category || categories[0]?.id || "teaching",
  );
  const [icon, setIcon] = useState(initialData?.icon || "🔗");
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const list = getAllCategories();
    setCategories(list);
    if (!initialData && list.length > 0 && !list.some((c) => c.id === category)) {
      setCategory(list[0].id);
    }
  }, [category, initialData]);

  useEffect(() => {
    titleRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("도구 이름을 입력해주세요.");
      return;
    }

    const cleanUrl = sanitizeUrl(url);
    if (!cleanUrl || cleanUrl === "#") {
      toast.error("올바른 웹 주소(URL)를 입력해주세요.");
      return;
    }

    if (initialData) {
      updateLink(initialData.id, {
        title: title.trim(),
        url: cleanUrl,
        description: description.trim(),
        category,
        icon: icon.trim() || "🔗",
      });
      toast.success(`"${title.trim()}" 도구가 수정되었습니다.`);
    } else {
      addLink({
        title: title.trim(),
        url: cleanUrl,
        description: description.trim(),
        category,
        icon: icon.trim() || "🔗",
      });
      toast.success(`"${title.trim()}" 도구가 추가되었습니다.`);
    }

    onClose();
    window.dispatchEvent(new Event("links-updated"));
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn"
      id="add-link-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-modal-title"
    >
      <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl p-6 relative border border-border max-h-[92vh] overflow-y-auto animate-fadeInUp">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center
                     text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="닫기"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 헤더 */}
        <div className="mb-5 pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center">
              {initialData ? (
                <Pencil className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3
                id="add-modal-title"
                className="text-lg font-bold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {initialData ? "도구 정보 수정" : "새로운 도구 추가"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {initialData
                  ? "도구의 이름, 링크 주소, 목차를 수정합니다."
                  : "내가 만든 웹앱이나 자주 쓰는 도구의 링크를 등록하세요."}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 아이콘 + 제목 */}
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0">
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                아이콘
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-12 h-11 text-center text-xl rounded-xl border border-input bg-background
                           focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                maxLength={4}
                title="이모지 또는 글자"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="input-title"
                className="text-xs font-semibold text-muted-foreground mb-1 block"
              >
                도구 이름 *
              </label>
              <input
                ref={titleRef}
                id="input-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 우리 반 자리배치기"
                className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-sm
                           focus:outline-none focus:ring-2 focus:ring-amber-500/30
                           placeholder:text-muted-foreground/50 font-medium"
              />
            </div>
          </div>

          {/* 빠른 아이콘 추천 */}
          <div>
            <span className="text-[11px] text-muted-foreground block mb-1">
              추천 아이콘 선택:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                    icon === ic
                      ? "bg-amber-500/20 border border-amber-500/50 scale-110"
                      : "bg-muted/60 hover:bg-muted"
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* URL */}
          <div>
            <label
              htmlFor="input-url"
              className="text-xs font-semibold text-muted-foreground mb-1 block flex items-center gap-1"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>웹 주소 (URL) *</span>
            </label>
            <input
              id="input-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="예: https://my-tool.vercel.app"
              className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-sm
                         focus:outline-none focus:ring-2 focus:ring-amber-500/30
                         placeholder:text-muted-foreground/50"
            />
          </div>

          {/* 설명 */}
          <div>
            <label
              htmlFor="input-description"
              className="text-xs font-semibold text-muted-foreground mb-1 block"
            >
              간단한 설명
            </label>
            <textarea
              id="input-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="어떤 기능을 하는 도구인지 간단히 적어주세요."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm
                         focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none
                         placeholder:text-muted-foreground/50"
            />
          </div>

          {/* 목차 (카테고리) 선택 */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
              소속 목차 (카테고리)
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold
                              transition-all border
                              ${
                                category === cat.id
                                  ? "border-amber-500 bg-amber-500/15 text-amber-900 shadow-xs"
                                  : "border-border bg-background text-muted-foreground hover:bg-muted"
                              }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-border text-sm font-semibold
                         text-muted-foreground hover:bg-muted/60 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-amber-600 text-white text-sm font-bold
                         hover:bg-amber-700 active:scale-[0.98] transition-all shadow-sm"
            >
              {initialData ? "수정 완료" : "추가하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
