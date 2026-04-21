"use client";

import { usePathname } from "next/navigation";

/**
 * Thin wrapper around <main> that adds top padding for pages where the
 * fixed Header sits above flowed content. Pages that own their own
 * top-of-viewport chrome (landing hero, /beats masthead) get no padding.
 */
export default function LayoutMain({ children }) {
  const pathname = usePathname();

  // These pages own the top of the viewport themselves.
  const ownsTop = pathname === "/" || pathname === "/beats";

  return (
    <main className={["flex-1 pb-32", ownsTop ? "" : "pt-20 sm:pt-24"].join(" ")}>
      {children}
    </main>
  );
}
