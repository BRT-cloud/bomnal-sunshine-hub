/**
 * 봄날의 햇살 - LocalStorage 기반 링크 저장소
 */
import { nanoid } from "nanoid";
import { DEFAULT_LINKS, type LinkItem } from "../data/links";

const STORAGE_KEY = "bomnal-links";

function loadFromStorage(): LinkItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveToStorage(items: LinkItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getAllLinks(): LinkItem[] {
  const customLinks = loadFromStorage();
  // Merge: default links + custom links (custom links override defaults with same id)
  const customIds = new Set(customLinks.map((l) => l.id));
  const defaults = DEFAULT_LINKS.filter((l) => !customIds.has(l.id));
  return [...defaults, ...customLinks];
}

export function addLink(link: Omit<LinkItem, "id" | "isCustom">): LinkItem {
  const newLink: LinkItem = {
    ...link,
    id: nanoid(10),
    isCustom: true,
  };
  const current = loadFromStorage();
  current.push(newLink);
  saveToStorage(current);
  return newLink;
}

export function removeLink(id: string): void {
  const current = loadFromStorage();
  saveToStorage(current.filter((l) => l.id !== id));
}

export function updateLink(id: string, updates: Partial<LinkItem>): void {
  const current = loadFromStorage();
  const index = current.findIndex((l) => l.id === id);
  if (index >= 0) {
    current[index] = { ...current[index], ...updates };
    saveToStorage(current);
  }
}
