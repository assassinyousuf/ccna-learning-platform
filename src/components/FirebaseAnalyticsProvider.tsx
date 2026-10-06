"use client";

import { useEffect } from "react";
import { initFirebaseAnalytics } from "@/lib/firebase";

export function FirebaseAnalyticsProvider() {
  useEffect(() => {
    initFirebaseAnalytics();
  }, []);

  return null;
}
