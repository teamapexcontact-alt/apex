'use client';
import { useEffect, useState } from 'react';

export function ObfuscatedEmail() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Assembled only in the browser — not present in HTML source
    const user = 'teamapex.contact';
    const domain = 'gmail.com';
    setEmail(`${user}@${domain}`);
  }, []);

  if (!email) return <span>Get in Touch</span>;

  return (
    <a
      href={`mailto:${email}`}
      className="inline-flex rounded-2xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/70 transition duration-300 hover:bg-white/10 hover:text-white hover:border-[#AAFF00]/30 hover:shadow-[0_0_24px_rgba(170,255,0,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60 active:scale-95"
      aria-label="Email ApeX Studio"
    >
      {email}
    </a>
  );
}
