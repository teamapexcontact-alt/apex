"use client";

import { useRef, useEffect } from "react";

export function DeferredStylesheet({ href, nonce }: { href: string; nonce?: string }) {
  const ref = useRef<HTMLLinkElement>(null);

  useEffect(() => {
    const link = ref.current;
    if (!link) return;
    const handler = () => { link.media = "all"; };
    link.addEventListener("load", handler);
    return () => link.removeEventListener("load", handler);
  }, []);

  return <link ref={ref} rel="stylesheet" href={href} media="print" nonce={nonce} />;
}
