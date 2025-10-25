"use client";

import { useAuth } from "./hooks/useAuth";
import Preloader from "./components/Preloader";

export default function Home() {
  const { loading } = useAuth();

  return loading ? <Preloader /> : null;
}