/**
 * 관리자 모드 인증 및 상태 관리
 * 기본 관리자 비밀번호: 0301
 */
import { useState, useEffect } from "react";

const ADMIN_STORAGE_KEY = "bomnal_admin_authenticated";
const ADMIN_PASSWORD = "0301";

export function isAdminLoggedIn(): boolean {
  try {
    return localStorage.getItem(ADMIN_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function loginAdmin(password: string): boolean {
  if (password.trim() === ADMIN_PASSWORD) {
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, "true");
    } catch (e) {
      console.error(e);
    }
    window.dispatchEvent(new Event("admin-auth-changed"));
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  try {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
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
  login: (pwd: string) => boolean;
  logout: () => void;
} {
  const [isAdmin, setIsAdmin] = useState(isAdminLoggedIn);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAdmin(isAdminLoggedIn());
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
  };
}
