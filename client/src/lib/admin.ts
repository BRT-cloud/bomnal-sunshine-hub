/**
 * 봄날의 햇살 - 관리자 모드 인증 및 세션 관리
 * 관리자 비밀번호: 0809
 */
import { useState, useEffect } from "react";
import { isCloudSyncEnabled, postToAppsScript } from "./api";

const ADMIN_SESSION_KEY = "bomnal_admin_session";
const ADMIN_PASSWORD_KEY = "bomnal_admin_pwd";
const LOCAL_FALLBACK_PASSWORD = "0809";

export function isAdminLoggedIn(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

export function getAdminPassword(): string {
  try {
    return sessionStorage.getItem(ADMIN_PASSWORD_KEY) || "";
  } catch {
    return "";
  }
}

export async function loginAdmin(password: string): Promise<boolean> {
  const trimmed = password.trim();
  if (!trimmed) return false;

  // 1. 구글 시트 클라우드 연동이 활성화된 경우 서버에서 비밀번호 검증
  if (isCloudSyncEnabled()) {
    try {
      const res = await postToAppsScript({
        action: "verify",
        password: trimmed,
      });
      if (res && res.success) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
        sessionStorage.setItem(ADMIN_PASSWORD_KEY, trimmed);
        window.dispatchEvent(new Event("admin-auth-changed"));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // 2. 로컬 테스트 환경인 경우
  if (trimmed === LOCAL_FALLBACK_PASSWORD) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    sessionStorage.setItem(ADMIN_PASSWORD_KEY, trimmed);
    window.dispatchEvent(new Event("admin-auth-changed"));
    return true;
  }

  return false;
}

export function logoutAdmin(): void {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
  } catch (e) {
    console.error(e);
  }
  window.dispatchEvent(new Event("admin-auth-changed"));
}

/**
 * 컴포넌트 내에서 관리자 모드 상태를 구독하는 리액트 훅
 */
export function useAdmin(): {
  isAdmin: boolean;
  login: (pwd: string) => Promise<boolean>;
  logout: () => void;
  password: string;
} {
  const [isAdmin, setIsAdmin] = useState(isAdminLoggedIn);
  const [pwd, setPwd] = useState(getAdminPassword);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAdmin(isAdminLoggedIn());
      setPwd(getAdminPassword());
    };

    window.addEventListener("admin-auth-changed", handleAuthChange);
    return () => {
      window.removeEventListener("admin-auth-changed", handleAuthChange);
    };
  }, []);

  return {
    isAdmin,
    login: loginAdmin,
    logout: logoutAdmin,
    password: pwd,
  };
}
