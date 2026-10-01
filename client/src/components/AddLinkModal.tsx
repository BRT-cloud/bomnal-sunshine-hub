/**
 * 봄날의 햇살 - 링크 추가 및 수정 모달
 * 화면을 떠나지 않는 작은 종이 양식
 */
import { useState, useRef, useEffect } from "react";
import { getAllCategories, addLink, updateLink } from "../lib/storage";
import type { LinkItem, Category } from "../data/links";
import { toast } from "sonner";

interface AddLinkModalProps {
  onClose: () => void;
  initialData?: LinkItem | null;
}

export default function AddLinkModal({
  onClose,
  initialData,
}: AddLinkModalProps) {
  const [categories, setCategories] = useState<Category[]>(getAllCategories);
  const [title, setTitle] = useState(initialData?.title || "");
  const [url, setUrl] = useState(initialData?.url || "https://");
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
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("도구 이름을 입력해주세요.");
      return;
    }
    if (!url.trim() || url === "https://") {
      toast.error("URL을 입력해주세요.");
      return;
    }

    if (initialData) {
      updateLink(initialData.id, {
        title: title.trim(),
        url: url.trim(),
        description: description.trim(),
        category,
        icon: icon.trim() || "🔗",
      });
      toast.success(`"${title.trim()}" 도구가 수정되었습니다.`);
    } else {
      addLink({
        title: title.trim(),
        url: url.trim(),
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/30 backdrop-blur-sm animate-fadeIn"
      id="add-link-modal"
    >
      <div className="w-full max-w-md mx-4 bg-card rounded-2xl shadow-2xl animate-fadeInUp p-6 relative max-h-[92vh] overflow-y-auto border border-border">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center
                     text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="닫기"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="4" y1="4" x2="12" y2="12" />
            <line x1="12" y1="4" x2="4" y2="12" />
          </svg>
        </button>

        {/* Title */}
        <div className="mb-6">
          <h3
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {initialData ? "도구 정보 수정" : "새로운 도구 추가"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {initialData
              ? "도구의 이름, 링크 주소, 목차를 수정합니다."
              : "자주 쓰는 교육 도구를 추가해보세요."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Icon + Title */}
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                아이콘
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-12 h-10 text-center text-xl rounded-lg border border-input bg-background
                           focus:outline-none focus:ring-2 focus:ring-ring/30"
                maxLength={2}
                id="input-icon"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="input-title"
                className="text-xs font-medium text-muted-foreground mb-1.5 block"
              >
                도구 이름 *
              </label>
              <input
                ref={titleRef}
                id="input-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: Kahoot!"
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm
                           focus:outline-none focus:ring-2 focus:ring-ring/30
                           placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          {/* URL */}
          <div>
            <label
              htmlFor="input-url"
              className="text-xs font-medium text-muted-foreground mb-1.5 block"
            >
              URL *
            </label>
            <input
              id="input-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm
                         focus:outline-none focus:ring-2 focus:ring-ring/30
                         placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="input-description"
              className="text-xs font-medium text-muted-foreground mb-1.5 block"
            >
              설명
            </label>
            <textarea
              id="input-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="이 도구에 대한 간단한 설명을 적어주세요."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm
                         focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none
                         placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              목차 (카테고리)
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                              transition-all duration-150 border
                              ${
                                category === cat.id
                                  ? "border-sunbeam bg-sunbeam/10 text-sunbeam-dark font-semibold shadow-xs"
                                  : "border-border bg-background text-muted-foreground hover:bg-muted/50"
                              }`}
                  id={`cat-select-${cat.id}`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-lg border border-border text-sm font-medium
                         text-muted-foreground hover:bg-muted/50 transition-colors"
              id="btn-cancel"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 h-10 rounded-lg bg-sunbeam text-white text-sm font-semibold
                         hover:bg-sunbeam-dark active:scale-[0.97] transition-all duration-150
                         shadow-sm hover:shadow-md"
              id="btn-submit"
            >
              {initialData ? "수정 완료" : "추가하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
