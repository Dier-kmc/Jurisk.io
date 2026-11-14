"use client";

import { useCallback, useEffect, useState } from "react";

export function useCredits() {
  const [credits, setCredits] = useState<number | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCredits = useCallback(async () => {
    try {
      const response = await fetch("/api/user/credits", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) return;
      setCredits(data.credits);
      setPlan(data.plan || null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCredits();
    const handleCreditsUpdate = () => refreshCredits();
    window.addEventListener("jurisk:credits-updated", handleCreditsUpdate);
    return () => window.removeEventListener("jurisk:credits-updated", handleCreditsUpdate);
  }, [refreshCredits]);

  return { credits, plan, loading, refreshCredits };
}
