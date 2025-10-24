"use client";

import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import Onboarding from "./components/Onboarding";
import Preloader from "./components/Preloader";

const INACTIVITY_TIMEOUT = 10 * 60 * 1000;

export default function Home() {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lastActivity = localStorage.getItem("lastActivity");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true" && lastActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity);

      if (timeSinceLastActivity < INACTIVITY_TIMEOUT) {
        setSignedIn(true);
        updateActivity();
      } else {
        handleLogout();
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!signedIn) return;

    const updateActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    const interval = setInterval(() => {
      const lastActivity = localStorage.getItem("lastActivity");
      if (lastActivity) {
        const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
        if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
          handleLogout();
        }
      }
    }, 60000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(interval);
    };
  }, [signedIn]);

  const updateActivity = () => {
    localStorage.setItem("lastActivity", Date.now().toString());
  };

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("lastActivity", Date.now().toString());
    document.title = "PSE-PTML | Dashboard";
    setSignedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("lastActivity");
    document.title = "PSE-PTML | Login";
    setSignedIn(false);
  };

  if (loading) {
    return <div><Preloader /></div>;
  }

  return (
    <>
      <Preloader />
      {signedIn ? <Dashboard onLogout={handleLogout} /> : <Onboarding onLogin={handleLogin} />}
    </>
  );
};