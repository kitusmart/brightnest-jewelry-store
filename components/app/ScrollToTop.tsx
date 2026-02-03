"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // When the actual URL path changes (e.g., from / to /about)
    // We force the window to the top immediately.
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
