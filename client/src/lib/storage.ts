/**
 * 봄날의 햇살 - 링크 및 카테고리 데이터 저장소
 * 
 * - 캐시 우선 (Cache-first): 로컬스토리지에서 즉시 읽어 깜빡임 없이 렌더링
 * - 클라우드 동기화: 구글 스프레드시트 API와 백그라운드 실시간 양방향 동기화
 */
import { nanoid } from "nanoid";
import {
  DEFAULT_LINKS,
  DEFAULT_CATEGORIES,
  type LinkItem,
  type Category,
} from "../data/links";
import {
  fetchRemoteData,
  isCloudSyncEnabled,
  postToAppsScript,
} from "./api";
import { getAdminPassword } from "./admin";

const LINKS_STORAGE_KEY = "bomnal-links-v3";
const CATEGORIES_STORAGE_KEY = "bomnal-categories-v3";
const LEGACY_V2_KEY = "bomnal-links-v2";

/** 안전한 URL 검증 (javascript: 등 방지) */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^javascript:/i.test(trimmed)) {
    return "#";
  }
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

// ── 카테고리 (목차) 관리 ──────────────────────────────────────────

export function getAllCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        CATEGORIES_STORAGE_KEY,
        JSON.stringify(DEFAULT_CATEGORIES),
      );
      return DEFAULT_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveAllCategories(categories: Category[], syncCloud = true): void {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event("categories-updated"));

    if (syncCloud && isCloudSyncEnabled()) {
      const pwd = getAdminPassword();
      postToAppsScript({
        action: "save_categories",
        password: pwd,
        categories,
      }).catch((err) => {
        console.error("Cloud save categories failed:", err);
      });
    }
  } catch (e) {
    console.error("Failed to save categories:", e);
  }
}

export function addCategory(category: Omit<Category, "id">): Category {
  const newCat: Category = {
    ...category,
    id: `cat-${nanoid(6)}`,
    order: getAllCategories().length + 1,
  };
  const list = getAllCategories();
  list.push(newCat);
  saveAllCategories(list);
  return newCat;
}

export function updateCategory(id: string, updates: Partial<Category>): void {
  const list = getAllCategories();
  const index = list.findIndex((c) => c.id === id);
  if (index >= 0) {
    list[index] = { ...list[index], ...updates };
    saveAllCategories(list);
  }
}

export function removeCategory(id: string): void {
  const list = getAllCategories();
  const filtered = list.filter((c) => c.id !== id);
  saveAllCategories(filtered);

  // 삭제된 카테고리에 속한 링크들을 'etc' (기타) 카테고리로 이동
  const fallbackCat = filtered.some((c) => c.id === "etc")
    ? "etc"
    : filtered[0]?.id || "teaching";
  const links = getAllLinks();
  let changed = false;
  const updatedLinks = links.map((l) => {
    if (l.category === id) {
      changed = true;
      return { ...l, category: fallbackCat };
    }
    return l;
  });
  if (changed) {
    saveAllLinks(updatedLinks);
  }
}

export function reorderCategories(fromIndex: number, toIndex: number): void {
  const list = [...getAllCategories()];
  if (
    fromIndex < 0 ||
    fromIndex >= list.length ||
    toIndex < 0 ||
    toIndex >= list.length
  ) {
    return;
  }
  const [moved] = list.splice(fromIndex, 1);
  list.splice(toIndex, 0, moved);
  const updated = list.map((item, idx) => ({ ...item, order: idx + 1 }));
  saveAllCategories(updated);
}

export function resetCategories(): void {
  saveAllCategories(DEFAULT_CATEGORIES);
}

// ── 도구 (링크) 관리 ──────────────────────────────────────────────

export function getAllLinks(): LinkItem[] {
  try {
    const raw = localStorage.getItem(LINKS_STORAGE_KEY);
    if (!raw) {
      // 1. 기존 v2에 사용자가 추가했던 도구가 있다면 자동 마이그레이션
      const v2Raw = localStorage.getItem(LEGACY_V2_KEY);
      if (v2Raw) {
        try {
          const oldList = JSON.parse(v2Raw);
          if (Array.isArray(oldList)) {
            // isCustom이거나 사용자가 추가한 링크 필터링
            const customOnes = oldList.filter((l: any) => l.isCustom);
            if (customOnes.length > 0) {
              localStorage.setItem(
                LINKS_STORAGE_KEY,
                JSON.stringify(customOnes),
              );
              return customOnes;
            }
          }
        } catch {
          // ignore
        }
      }

      // 2. 기본값: 빈 배열 (사용자가 직접 만든 도구로 시작)
      localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(DEFAULT_LINKS));
      return DEFAULT_LINKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_LINKS;
  } catch {
    return DEFAULT_LINKS;
  }
}

export function saveAllLinks(links: LinkItem[], syncCloud = true): void {
  try {
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(links));
    window.dispatchEvent(new Event("links-updated"));

    if (syncCloud && isCloudSyncEnabled()) {
      const pwd = getAdminPassword();
      postToAppsScript({
        action: "save_links",
        password: pwd,
        links,
      }).catch((err) => {
        console.error("Cloud save links failed:", err);
      });
    }
  } catch (e) {
    console.error("Failed to save links:", e);
  }
}

export function addLink(link: Omit<LinkItem, "id">): LinkItem {
  const current = getAllLinks();
  const newLink: LinkItem = {
    ...link,
    id: `link-${nanoid(10)}`,
    url: sanitizeUrl(link.url),
    order: current.length + 1,
    isCustom: true,
  };
  current.unshift(newLink); // 새 도구는 맨 앞에 추가
  saveAllLinks(current);
  return newLink;
}

export function updateLink(id: string, updates: Partial<LinkItem>): void {
  const current = getAllLinks();
  const index = current.findIndex((l) => l.id === id);
  if (index >= 0) {
    const sanitizedUpdates = { ...updates };
    if (sanitizedUpdates.url) {
      sanitizedUpdates.url = sanitizeUrl(sanitizedUpdates.url);
    }
    current[index] = { ...current[index], ...sanitizedUpdates };
    saveAllLinks(current);
  }
}

export function removeLink(id: string): void {
  const current = getAllLinks();
  const filtered = current.filter((l) => l.id !== id);
  saveAllLinks(filtered);
}

export function reorderLinks(fromIndex: number, toIndex: number): void {
  const current = [...getAllLinks()];
  if (
    fromIndex < 0 ||
    fromIndex >= current.length ||
    toIndex < 0 ||
    toIndex >= current.length
  ) {
    return;
  }
  const [moved] = current.splice(fromIndex, 1);
  current.splice(toIndex, 0, moved);
  const updated = current.map((item, idx) => ({ ...item, order: idx + 1 }));
  saveAllLinks(updated);
}

export function resetLinks(): void {
  saveAllLinks(DEFAULT_LINKS);
}

// ── 클라우드 백그라운드 새로고침 및 수동 동기화 ────────────────────────

export async function refreshFromCloud(): Promise<{
  success: boolean;
  linkCount?: number;
  categoryCount?: number;
}> {
  if (!isCloudSyncEnabled()) {
    return { success: false };
  }

  const remote = await fetchRemoteData();
  if (!remote || !remote.success) {
    return { success: false };
  }

  if (Array.isArray(remote.categories) && remote.categories.length > 0) {
    saveAllCategories(remote.categories, false);
  }

  if (Array.isArray(remote.links)) {
    saveAllLinks(remote.links, false);
  }

  return {
    success: true,
    linkCount: remote.links?.length || 0,
    categoryCount: remote.categories?.length || 0,
  };
}

/** 현재 로컬 브라우저에 있는 데이터를 구글 시트로 강제 전송 */
export async function pushLocalToCloud(password: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!isCloudSyncEnabled()) {
    return {
      success: false,
      error: "구글 시트 연동 URL(VITE_SHEETS_API_URL)이 설정되지 않았습니다.",
    };
  }

  const currentLinks = getAllLinks();
  const currentCategories = getAllCategories();

  // 1. 카테고리 전송
  const catRes = await postToAppsScript({
    action: "save_categories",
    password,
    categories: currentCategories,
  });

  if (!catRes.success) {
    return { success: false, error: catRes.error || "카테고리 저장 실패" };
  }

  // 2. 링크 전송
  const linkRes = await postToAppsScript({
    action: "save_links",
    password,
    links: currentLinks,
  });

  if (!linkRes.success) {
    return { success: false, error: linkRes.error || "링크 저장 실패" };
  }

  return { success: true };
}
