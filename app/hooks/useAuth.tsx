"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const INACTIVITY_TIMEOUT = 10 * 60 * 1000;
const CHECK_INTERVAL = 60000;
const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart"];
const STORAGE_KEYS = {
   IS_LOGGED_IN: "isLoggedIn",
   LAST_ACTIVITY: "lastActivity",
} as const;

const storage = {
   get: (key: string) => localStorage.getItem(key),
   set: (key: string, value: string) => localStorage.setItem(key, value),
   remove: (key: string) => localStorage.removeItem(key),
   isLoggedIn: () => localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === "true",
   getLastActivity: () => {
      const activity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
      return activity ? parseInt(activity) : null;
   },
};

const isSessionExpired = (lastActivity: number | null): boolean => {
   if (!lastActivity) return true;
   return Date.now() - lastActivity >= INACTIVITY_TIMEOUT;
};

export function useAuth() {
   const router = useRouter();
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (typeof window === "undefined") return;

      const isLoggedIn = storage.isLoggedIn();
      const lastActivity = storage.getLastActivity();

      if (isLoggedIn && !isSessionExpired(lastActivity)) {
         router.push("/dashboard");
      } else {
         if (isLoggedIn) {
            storage.remove(STORAGE_KEYS.IS_LOGGED_IN);
            storage.remove(STORAGE_KEYS.LAST_ACTIVITY);
         }
         router.push("/onboarding");
      }

      setLoading(false);
   }, [router]);

   return { loading };
}

export function useDashboardAuth() {
   const router = useRouter();

   const logout = useCallback(() => {
      if (typeof window === "undefined") return;

      storage.remove(STORAGE_KEYS.IS_LOGGED_IN);
      storage.remove(STORAGE_KEYS.LAST_ACTIVITY);
      router.push("/onboarding");
   }, [router]);

   useEffect(() => {
      if (typeof window === "undefined") return;

      if (!storage.isLoggedIn()) {
         router.push("/onboarding");
         return;
      }

      const updateActivity = () => {
         storage.set(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
      };

      ACTIVITY_EVENTS.forEach((event) => {
         window.addEventListener(event, updateActivity);
      });

      const interval = setInterval(() => {
         const lastActivity = storage.getLastActivity();
         if (isSessionExpired(lastActivity)) {
            logout();
         }
      }, CHECK_INTERVAL);

      return () => {
         ACTIVITY_EVENTS.forEach((event) => {
            window.removeEventListener(event, updateActivity);
         });
         clearInterval(interval);
      };
   }, [router, logout]);

   return { logout };
}

export function useOnboardingAuth() {
   const router = useRouter();

   const login = useCallback(() => {
      if (typeof window === "undefined") return;

      storage.set(STORAGE_KEYS.IS_LOGGED_IN, "true");
      storage.set(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
      router.push("/dashboard");
   }, [router]);

   useEffect(() => {
      if (typeof window === "undefined") return;

      if (storage.isLoggedIn()) {
         router.push("/dashboard");
      }
   }, [router]);

   return { login };
}