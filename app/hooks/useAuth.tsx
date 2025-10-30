import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";

const INACTIVITY_TIMEOUT = 60 * 60 * 1000;
const CHECK_INTERVAL = INACTIVITY_TIMEOUT;
const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart"];
const STORAGE_KEYS = {
   LAST_ACTIVITY: "lastActivity",
} as const;

const storage = {
   get: (key: string) => localStorage.getItem(key),
   set: (key: string, value: string) => localStorage.setItem(key, value),
   remove: (key: string) => localStorage.removeItem(key),
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

      const unsubscribe = onAuthStateChanged(auth, (user) => {
         if (user) {
            const lastActivity = storage.getLastActivity();
            if (!isSessionExpired(lastActivity)) {
               router.push("/dashboard");
            } else {
               signOut(auth);
               storage.remove(STORAGE_KEYS.LAST_ACTIVITY);
               router.push("/onboarding");
            }
         } else {
            router.push("/onboarding");
         }
         setLoading(false);
      });

      return () => unsubscribe();
   }, [router]);

   return { loading };
}

export function useDashboardAuth() {
   const router = useRouter();

   const logout = useCallback(async () => {
      if (typeof window === "undefined") return;

      await signOut(auth);
      storage.remove(STORAGE_KEYS.LAST_ACTIVITY);
      document.title = "HSE-PTML | Login";
      router.push("/onboarding");
   }, [router]);

   useEffect(() => {
      if (typeof window === "undefined") return;

      const unsubscribe = onAuthStateChanged(auth, (user) => {
         if (!user) {
            router.push("/onboarding");
            return;
         }

         document.title = "HSE-PTML | Dashboard";

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
      });

      return () => unsubscribe();
   }, [router, logout]);

   return { logout };
}

export function useOnboardingAuth() {
   const router = useRouter();
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   const login = useCallback(async (username: string, password: string) => {
      if (typeof window === "undefined") return;

      setError("");
      setLoading(true);

      try {
         const email = `${username}@hseptml.com`;
         await signInWithEmailAndPassword(auth, email, password);
         storage.set(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
         document.title = "HSE-PTML | Dashboard";
         router.push("/dashboard");
      } catch (err) {
         setError("Invalid credentials. Please check username and/or password.");
      } finally {
         setLoading(false);
      }
   }, [router]);

   useEffect(() => {
      if (typeof window === "undefined") return;

      const unsubscribe = onAuthStateChanged(auth, (user) => {
         if (user) {
            router.push("/dashboard");
            return;
         }
         document.title = "HSE-PTML | Login";
      });

      return () => unsubscribe();
   }, [router]);

   return { login, error, loading };
}