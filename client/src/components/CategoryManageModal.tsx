/**
 * 봄날의 햇살 - 목차(카테고리) 관리 모달
 * 
 * - 카테고리 추가, 이름/아이콘/색상 수정, 삭제, 순서 변경 (위/아래 이동)
 * - 기본 5대 목차 복원
 */
import { useState, useEffect, useRef } from "react";
import {
  X,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  FolderTree,
  RotateCcw,
} from "lucide-react";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  removeCategory,
  resetCategories,
  reorderCategories,
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
    name: "햇살 골드",
    colorClass: "strip-sunbeam",
    bgClass: "bg-amber-500/10",
    textClass: "text-amber-800",
    badgeBg: "#D89B39",
  },
  {
    name: "세이지 그린",
    colorClass: "strip-sage",
    bgClass: "bg-emerald-500/10",
    textClass: "text-emerald-800",
    badgeBg: "#5F8752",
  },
  {
    name: "스카이 블루",
    colorClass: "strip-sky",
    bgClass: "bg-sky-500/10",
    textClass: "text-sky-800",
    badgeBg: "#4A8FA9",
  },
  {
    name: "코랄 핑크",
    colorClass: "strip-coral",
    bgClass: "bg-rose-500/10",
    textClass: "text-rose-800",
    badgeBg: "#D96B50",
  },
  {
    name: "라벤더 퍼플",
    colorClass: "strip-lavender",
    bgClass: "bg-purple-500/10",
    textClass: "text-purple-800",
    badgeBg: "#8675B8",
  },
];

export default function CategoryManageModal({
  onClose,
  onUpdated,
}: CategoryManageModalProps) {
  const [categories, setCategories] = useState<Category[]>(getAllCategories);
  const [editingId, setEditingId] = useState<string | null>(null);

  // 수정 상태
  const [editLabel, setEditLabel] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editColorIdx, setEditColorIdx] = useState(0);

  // 추가 상태
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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

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
      toast.error("목차 이름을 입력해주세요.");
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
      toast.error("새 목차 이름을 입력해주세요.");
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
        ? `"${cat.label}" 목차를 삭제하시겠습니까?\n이 목차에 속한 도구 ${count}개는 '기타' 목차로 자동 이동됩니다.`
        : `"${cat.label}" 목차를 삭제하시겠습니까?`;

    if (window.confirm(message)) {
      removeCategory(cat.id);
      refresh();
      toast.success(`"${cat.label}" 목차가 삭제되었습니다.`);
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= categories.length) return;
    reorderCategories(index, targetIdx);
    refresh();
  };

  const handleReset = () => {
    if (
      window.confirm(
        "목차 설정을 기본 5개(수업 도구, 학급 관리, 교육과정, 행동지원, 기타)로 초기화하시겠습니까?",
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn"
      id="category-manage-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
    >
      <div className="w-full max-w-lg bg-card rounded-2xl shadow-2xl p-6 relative border border-border flex flex-col max-h-[90vh] animate-fadeInUp">
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
        <div className="mb-4 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center">
              <FolderTree className="w-4 h-4" />
            </div>
            <div>
              <h3
                id="category-modal-title"
                className="text-lg font-bold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                상단 목차(카테고리) 관리
              </h3>
              <p className="text-xs text-muted-foreground">
                사이트 상단에 표시되는 탭 이름, 아이콘, 색상과 순서를 조절할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 카테고리 목록 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {categories.map((cat, idx) => {
            const isEditing = editingId === cat.id;

            if (isEditing) {
              return (
                <div
                  key={cat.id}
                  className="p-4 rounded-xl border-2 border-amber-500/70 bg-amber-50/40 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editIcon}
                      onChange={(e) => setEditIcon(e.target.value)}
                      className="w-10 h-9 text-center text-lg rounded-lg border border-input bg-background"
                      title="아이콘"
                      maxLength={4}
                    />
                    <input
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      placeholder="목차 이름"
                      className="flex-1 h-9 px-3 rounded-lg border border-input bg-background text-sm font-bold"
                    />
                  </div>

                  <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="목차 설명"
                    className="w-full h-8 px-3 rounded-lg border border-input bg-background text-xs text-muted-foreground"
                  />

                  {/* 색상 선택 */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-muted-foreground">색상:</span>
                    <div className="flex gap-2">
                      {COLOR_PRESETS.map((color, cIdx) => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setEditColorIdx(cIdx)}
                          className={`w-5 h-5 rounded-full transition-transform ${
                            editColorIdx === cIdx
                              ? "scale-125 ring-2 ring-foreground"
                              : "opacity-70 hover:opacity-100"
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
                      className="px-3 py-1.5 text-xs rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700"
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
                className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:bg-amber-50/20 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* 순서 이동 버튼 */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20 rounded"
                      title="위로 이동"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === categories.length - 1}
                      className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20 rounded"
                      title="아래로 이동"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-lg flex-shrink-0">
                    {cat.icon}
                  </span>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <span>{cat.label}</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{
                          backgroundColor:
                            COLOR_PRESETS.find((c) => c.colorClass === cat.colorClass)?.badgeBg || "#D89B39",
                        }}
                      />
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {cat.description || "설명 없음"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(cat)}
                    className="p-1.5 text-muted-foreground hover:text-amber-800 hover:bg-amber-100/50 rounded-lg transition-colors"
                    title="수정"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat)}
                    className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-100/50 rounded-lg transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* 새 목차 추가 폼 */}
          {isAdding ? (
            <form
              onSubmit={handleAddCategory}
              className="p-4 rounded-xl border-2 border-dashed border-amber-500/80 bg-amber-50/40 space-y-3 mt-3"
            >
              <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> 새 목차 추가
              </h5>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="w-10 h-9 text-center text-lg rounded-lg border border-input bg-background"
                  title="아이콘"
                  maxLength={4}
                />
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="예: 프로젝트 학습"
                  className="flex-1 h-9 px-3 rounded-lg border border-input bg-background text-sm font-bold"
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
                <span className="text-xs text-muted-foreground">색상:</span>
                <div className="flex gap-2">
                  {COLOR_PRESETS.map((color, idx) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setNewColorIdx(idx)}
                      className={`w-5 h-5 rounded-full transition-transform ${
                        newColorIdx === idx
                          ? "scale-125 ring-2 ring-foreground"
                          : "opacity-70 hover:opacity-100"
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
                  className="px-4 py-1.5 text-xs rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700"
                >
                  추가하기
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-border hover:border-amber-500/70 text-xs font-bold text-muted-foreground hover:text-amber-900 flex items-center justify-center gap-1.5 hover:bg-amber-50/50 transition-all mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>새 목차(카테고리) 추가하기</span>
            </button>
          )}
        </div>

        {/* 모달 푸터 */}
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-muted-foreground/70 hover:text-destructive underline decoration-dotted transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>기본 5개 목차로 초기화</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-ink text-cream text-xs font-bold hover:bg-ink-light transition-all"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}
