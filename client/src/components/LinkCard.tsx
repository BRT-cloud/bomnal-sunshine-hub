/**
 * 봄날의 햇살 - 링크 카드 컴포넌트
 * 종이 카드 스타일, 색상 스트립, 외부 링크 화살표
 */
import type { LinkItem } from "../data/links";

interface LinkCardProps {
  link: LinkItem;
  colorClass: string;
  onDelete?: (id: string) => void;
  index: number;
}

export default function LinkCard({
  link,
  colorClass,
  onDelete,
  index,
}: LinkCardProps) {
  return (
    <article
      className={`paper-card ${colorClass} p-5 animate-fadeInUp delay-${Math.min(index + 1, 8)} group relative`}
      id={`link-card-${link.id}`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-muted/60 flex items-center justify-center text-xl transition-transform group-hover:scale-110">
          {link.icon || "🔗"}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-[0.95rem] font-bold text-foreground leading-snug truncate"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {link.title}
          </h3>
          <p className="mt-1.5 text-[0.82rem] text-muted-foreground leading-relaxed line-clamp-2">
            {link.description}
          </p>

          {/* Action row */}
          <div className="mt-3 flex items-center gap-3">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-sunbeam-dark
                         hover:text-sunbeam transition-colors duration-150"
              id={`open-link-${link.id}`}
            >
              이 도구 열어보기
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <path d="M6 3h7v7" />
                <path d="M13 3L3 13" />
              </svg>
            </a>

            {link.isCustom && onDelete && (
              <button
                onClick={() => onDelete(link.id)}
                className="text-[0.72rem] text-muted-foreground/60 hover:text-destructive transition-colors"
                aria-label={`${link.title} 삭제`}
                id={`delete-link-${link.id}`}
              >
                삭제
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
