/**
 * 봄날의 햇살 - 링크 카드 컴포넌트
 * 
 * - 봄 그림책 감성의 카드 (spring-card + washi-tape)
 * - 관리자 모드에서만 수정/삭제 버튼 노출 (방문자는 순수 열람만 가능)
 * - 안전한 외부 링크 열기 (noopener noreferrer)
 */
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { LinkItem } from "../data/links";

interface LinkCardProps {
  link: LinkItem;
  colorClass: string;
  isAdmin?: boolean;
  onEdit?: (link: LinkItem) => void;
  onDelete?: (id: string) => void;
  index: number;
}

export default function LinkCard({
  link,
  colorClass,
  isAdmin,
  onEdit,
  onDelete,
  index,
}: LinkCardProps) {
  return (
    <article
      className={`spring-card ${colorClass} p-5 group flex flex-col justify-between`}
      id={`link-card-${link.id}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* 상단 귀여운 마스킹 테이프 장식 */}
      <div className="washi-tape" />

      <div>
        {/* 상단: 아이콘 + 제목 + 관리자 버튼 */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0">
            {/* 도구 아이콘 */}
            <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl transition-transform group-hover:scale-110 group-hover:rotate-6">
              {link.icon || "🔗"}
            </div>

            {/* 도구 제목 */}
            <div className="min-w-0">
              <h3
                className="text-base font-bold text-foreground leading-snug truncate"
                title={link.title}
              >
                {link.title}
              </h3>
            </div>
          </div>

          {/* 관리자 전용 수정 / 삭제 도구 */}
          {isAdmin && (
            <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={() => onEdit(link)}
                  className="p-1.5 text-muted-foreground hover:text-amber-700 hover:bg-amber-100/60 rounded-lg transition-colors"
                  title="도구 수정"
                  aria-label={`${link.title} 수정`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(link.id)}
                  className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-100/60 rounded-lg transition-colors"
                  title="도구 삭제"
                  aria-label={`${link.title} 삭제`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* 설명 문구 */}
        <p className="mt-3 text-xs md:text-sm text-ink-light leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {link.description || "등록된 설명이 없습니다."}
        </p>
      </div>

      {/* 하단 링크 버튼 */}
      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-amber-800
                     hover:text-amber-600 transition-colors duration-150 group/link"
          id={`open-link-${link.id}`}
        >
          <span>이 도구 열어보기</span>
          <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </a>

        {/* URL 도메인 힌트 */}
        <span className="text-[11px] text-muted-foreground/60 truncate max-w-[120px]">
          {link.url.replace(/^https?:\/\//i, "").replace(/\/.*$/, "")}
        </span>
      </div>
    </article>
  );
}
