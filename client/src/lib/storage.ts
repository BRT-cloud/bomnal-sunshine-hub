/**
 * 봄날의 햇살 - LocalStorage 기반 링크 및 카테고리(목차) 저장소
 */
import { nanoid } from "nanoid";
import {
  DEFAULT_LINKS,
  DEFAULT_CATEGORIES,
  type LinkItem,
  type Category,
} from "../data/links";

const LINKS_STORAGE_KEY = "bomnal-links-v2";
const CATEGORIES_STORAGE_KEY = "bomnal-categories-v2";

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

export function saveAllCategories(categories: Category[]): void {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event("categories-updated"));
  } catch (e) {
    console.error("Failed to save categories:", e);
  }
}

export function addCategory(category: Omit<Category, "id">): Category {
  const newCat: Category = {
    ...category,
    id: `cat-${nanoid(6)}`,
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

  // 삭제된 카테고리에 속한 링크들을 남은 첫 번째 카테고리로 변경
  const fallbackCat = filtered[0]?.id || "teaching";
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

export function resetCategories(): void {
  saveAllCategories(DEFAULT_CATEGORIES);
}

// ── 도구 (링크) 관리 ──────────────────────────────────────────────

export function getAllLinks(): LinkItem[] {
  try {
    const raw = localStorage.getItem(LINKS_STORAGE_KEY);
    if (!raw) {
      // 기존 v1 저장소가 있는지 확인 후 마이그레이션
      const v1Raw = localStorage.getItem("bomnal-links");
      if (v1Raw) {
        try {
          const customLinks = JSON.parse(v1Raw);
          if (Array.isArray(customLinks) && customLinks.length > 0) {
            const merged = [...DEFAULT_LINKS, ...customLinks];
            localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(merged));
            return merged;
          }
        } catch {
          // ignore
        }
      }
      localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(DEFAULT_LINKS));
      return DEFAULT_LINKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_LINKS;
  } catch {
    return DEFAULT_LINKS;
  }
}

export function saveAllLinks(links: LinkItem[]): void {
  try {
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(links));
    window.dispatchEvent(new Event("links-updated"));
  } catch (e) {
    console.error("Failed to save links:", e);
  }
}

export function addLink(link: Omit<LinkItem, "id">): LinkItem {
  const newLink: LinkItem = {
    ...link,
    id: nanoid(10),
    isCustom: true,
  };
  const current = getAllLinks();
  current.unshift(newLink); // 새 도구는 맨 앞에 추가
  saveAllLinks(current);
  return newLink;
}

export function updateLink(id: string, updates: Partial<LinkItem>): void {
  const current = getAllLinks();
  const index = current.findIndex((l) => l.id === id);
  if (index >= 0) {
    current[index] = { ...current[index], ...updates };
    saveAllLinks(current);
  }
}

export function removeLink(id: string): void {
  const current = getAllLinks();
  const filtered = current.filter((l) => l.id !== id);
  saveAllLinks(filtered);
}

export function resetLinks(): void {
  saveAllLinks(DEFAULT_LINKS);
}
