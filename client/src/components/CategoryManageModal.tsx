/**
 * 봄날의 햇살 - 목차(카테고리) 관리 모달
 * 카테고리 추가, 이름/아이콘 수정, 삭제, 기본 복원
 */
import { useState, useEffect, useRef } from "react";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  removeCategory,
  resetCategories,
  getAllLinks,
} from "../lib/storage";
import type { Category } from "../data/links";
import { toast } from "sonner";

interface CategoryManageModalProps {
  onClose: () => void;
  onUpdated?: () => void;
}

const COLOR_PRESETS = [
  {
    name: "햇살 (노랑/골드)",
    colorClass: "strip-sunbeam",
    bgClass: "bg-sunbeam/10",
    textClass: "text-sunbeam-dark",
    badgeBg: "#D89B39",
  },
  {
    name: "세이지 (초록/올리브)",
    colorClass: "strip-sage",
    bgClass: "bg-sage/10",
    textClass: "text-sage",
    badgeBg: "#7A9B6D",
  },
  {
    name: "코랄 (주황/살구)",
    colorClass: "strip-coral",
    bgClass: "bg-coral/10",
    textClass: "text-coral",
    badgeBg: "#E07A5F",
  },
  {
    name: "스카이 (하늘/블루)",
    colorClass: "strip-sky",
    bgClass: "bg-sky/10",
    textClass: "text-sky",
    badgeBg: "#7CAFC4",
  },
  {
    name: "라벤더 (보라/퍼플)",
    colorClass: "strip-lavender",
    bgClass: "bg-lavender/10",
    textClass: "text-lavender",
    badgeBg: "#9B8EC4",
  },
];

export default function CategoryManageModal({
  onClose,
  onUpdated,
}: CategoryManageModalProps) {
  const [categories, setCategories] = useState<Category[]>(getAllCategories);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Edit form state
  const [editLabel, setEditLabel] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editColorIdx, setEditColorIdx] = useState(0);

  // New category form state
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newIcon, setNewIcon] = useState("📁");
  const [newDesc, setNewDesc] = useState("");
  const [newColorIdx, setNewColorIdx] = useState(0);

  const overlayRef = useRef<HTMLDivElement>(null);

  const refresh = () => {
    const list = getAllCategories();
    setCategories(list);
    onUpdated?.();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditLabel(cat.label);
    setEditIcon(cat.icon);
    setEditDesc(cat.description || "");
    const cIdx = COLOR_PRESETS.findIndex((c) => c.colorClass === cat.colorClass);
    setEditColorIdx(cIdx >= 0 ? cIdx : 0);
  };

  const handleSaveEdit = (id: string) => {
    if (!editLabel.trim()) {
      toast.error("카테고리 이름을 입력해주세요.");
      return;
    }
    const color = COLOR_PRESETS[editColorIdx];
    updateCategory(id, {
      label: editLabel.trim(),
      icon: editIcon.trim() || "📁",
      description: editDesc.trim(),
      colorClass: color.colorClass,
      bgClass: color.bgClass,
      textClass: color.textClass,
    });
    setEditingId(null);
    refresh();
    toast.success("목차가 수정되었습니다.");
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) {
      toast.error("새 카테고리 이름을 입력해주세요.");
      return;
    }
    const color = COLOR_PRESETS[newColorIdx];
    addCategory({
      label: newLabel.trim(),
      icon: newIcon.trim() || "📁",
      description: newDesc.trim() || `${newLabel.trim()} 관련 도구 모음`,
      colorClass: color.colorClass,
      bgClass: color.bgClass,
      textClass: color.textClass,
    });
    setNewLabel("");
    setNewDesc("");
    setNewIcon("📁");
    setIsAdding(false);
    refresh();
    toast.success("새로운 목차가 추가되었습니다.");
  };

  const handleDeleteCategory = (cat: Category) => {
    if (categories.length <= 1) {
      toast.error("최소 1개의 목차는 유지되어야 합니다.");
      return;
    }

    const links = getAllLinks();
    const count = links.filter((l) => l.category === cat.id).length;

    const message =
      count > 0
        ? `"${cat.label}" 목차를 삭제하시겠습니까?\n이 목차에 속한 도구 ${count}개는 첫 번째 목차로 자동 이동됩니다.`
        : `"${cat.label}" 목차를 삭제하시겠습니까?`;

    if (window.confirm(message)) {
      removeCategory(cat.id);
      refresh();
      toast.success(`"${cat.label}" 목차가 삭제되었습니다.`);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        "목차 설정을 기본 4개(수업 도구, 학급 관리, 콘텐츠 제작, 커뮤니티)로 되돌리시겠습니까?",
      )
    ) {
      resetCategories();
      refresh();
      toast.success("기본 목차로 초기화되었습니다.");
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4 animate-fadeIn"
      id="category-manage-modal"
    >
      <div className="w-full max-w-lg bg-card rounded-2xl shadow-2xl p-6 relative border border-border flex flex-col max-h-[90vh] animate-fadeInUp">
        {/* Close Button */}
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

        {/* Modal Header */}
        <div className="mb-5 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📑</span>
            <div>
              <h3
                className="text-lg font-bold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                상단 목차(카테고리) 관리
              </h3>
              <p className="text-xs text-muted-foreground">
                사이트 상단에 표시되는 탭 이름과 아이콘, 색상을 변경할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Category List Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {categories.map((cat) => {
            const isEditing = editingId === cat.id;

            if (isEditing) {
              return (
                <div
                  key={cat.id}
                  className="p-4 rounded-xl border-2 border-sunbeam/60 bg-sunbeam/5 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editIcon}
                      onChange={(e) => setEditIcon(e.target.value)}
                      className="w-10 h-9 text-center text-lg rounded-lg border border-input bg-background"
                      title="아이콘"
                      maxLength={2}
                    />
                    <input
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      placeholder="목차 이름"
                      className="flex-1 h-9 px-3 rounded-lg border border-input bg-background text-sm font-semibold"
                    />
                  </div>

                  <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="목차 설명 (선택)"
                    className="w-full h-8 px-3 rounded-lg border border-input bg-background text-xs text-muted-foreground"
                  />

                  {/* Color Select */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-muted-foreground">색상:</span>
                    <div className="flex gap-1.5">
                      {COLOR_PRESETS.map((color, idx) => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setEditColorIdx(idx)}
                          className={`w-5 h-5 rounded-full transition-transform ${
                            editColorIdx === idx ? "scale-125 ring-2 ring-foreground" : "opacity-70 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: color.badgeBg }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:bg-muted"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(cat.id)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-sunbeam text-white font-semibold hover:bg-sunbeam-dark"
                    >
                      저장
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-background/60 hover:bg-muted/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-lg">
                    {cat.icon}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      {cat.label}
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{
                          backgroundColor:
                            COLOR_PRESETS.find((c) => c.colorClass === cat.colorClass)?.badgeBg || "#D89B39",
                        }}
                      />
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {cat.description || "설명 없음"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(cat)}
                    className="px-2.5 py-1 text-xs rounded-md text-muted-foreground hover:text-foreground hover:bg-muted font-medium transition-colors"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat)}
                    className="px-2.5 py-1 text-xs rounded-md text-destructive/70 hover:text-destructive hover:bg-destructive/10 font-medium transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add Category Form */}
          {isAdding ? (
            <form
              onSubmit={handleAddCategory}
              className="p-4 rounded-xl border-2 border-dashed border-sunbeam/80 bg-sunbeam/5 space-y-3 mt-4"
            >
              <h5 className="text-xs font-bold text-sunbeam-dark flex items-center gap-1">
                <span>➕</span> 새 목차 추가
              </h5>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="w-10 h-9 text-center text-lg rounded-lg border border-input bg-background"
                  title="아이콘"
                  maxLength={2}
                />
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="예: AI 활용 도구"
                  className="flex-1 h-9 px-3 rounded-lg border border-input bg-background text-sm font-semibold"
                  autoFocus
                />
              </div>

              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="목차에 대한 간단한 설명"
                className="w-full h-8 px-3 rounded-lg border border-input bg-background text-xs text-muted-foreground"
              />

              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-muted-foreground">색상 테마:</span>
                <div className="flex gap-1.5">
                  {COLOR_PRESETS.map((color, idx) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setNewColorIdx(idx)}
                      className={`w-5 h-5 rounded-full transition-transform ${
                        newColorIdx === idx ? "scale-125 ring-2 ring-foreground" : "opacity-70 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: color.badgeBg }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:bg-muted"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs rounded-lg bg-sunbeam text-white font-semibold hover:bg-sunbeam-dark"
                >
                  추가하기
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="w-full py-3 rounded-xl border border-dashed border-border hover:border-sunbeam/70 text-xs font-semibold text-muted-foreground hover:text-sunbeam-dark flex items-center justify-center gap-1.5 hover:bg-sunbeam/5 transition-all mt-2"
            >
              <span>➕</span> 새 목차(카테고리) 추가하기
            </button>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleReset}
            className="text-muted-foreground/60 hover:text-destructive underline decoration-dotted transition-colors"
          >
            기본 목차로 초기화
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-ink text-cream text-xs font-semibold hover:bg-ink-light transition-all"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}
