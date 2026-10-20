/**
 * Google Apps Script (스프레드시트) API 연동 클라이언트
 * VITE_SHEETS_API_URL 환경 변수가 설정되어 있으면 클라우드 시트와 실시간 동기화합니다.
 */
import type { Category, LinkItem } from "../data/links";

export const SHEETS_API_URL: string =
  (import.meta.env.VITE_SHEETS_API_URL as string | undefined)?.trim() || "";

export const isCloudSyncEnabled = (): boolean => {
  return Boolean(SHEETS_API_URL && SHEETS_API_URL.startsWith("http"));
};

export interface RemoteDataResponse {
  success: boolean;
  categories: Category[];
  links: LinkItem[];
  timestamp?: string;
  error?: string;
}

export async function fetchRemoteData(): Promise<RemoteDataResponse | null> {
  if (!isCloudSyncEnabled()) return null;

  try {
    const res = await fetch(`${SHEETS_API_URL}?t=${Date.now()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const data = (await res.json()) as RemoteDataResponse;
    if (data && data.success) {
      return data;
    }
    throw new Error(data?.error || "Failed to fetch from Google Sheets");
  } catch (err) {
    console.warn("[CloudSync] Failed to fetch remote data:", err);
    return null;
  }
}

export async function postToAppsScript<T = any>(payload: {
  action: string;
  password?: string;
  [key: string]: any;
}): Promise<{ success: boolean; error?: string; [key: string]: any }> {
  if (!isCloudSyncEnabled()) {
    return { success: true, localOnly: true };
  }

  try {
    // Apps Script의 CORS preflight 이슈를 방지하기 위해 text/plain으로 전송
    const res = await fetch(SHEETS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    return result;
  } catch (err: any) {
    console.error("[CloudSync] POST error:", err);
    return {
      success: false,
      error: err?.message || "스프레드시트 서버와의 통신에 실패했습니다.",
    };
  }
}
