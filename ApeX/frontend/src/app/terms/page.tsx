import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms & Conditions | ApeX Studio",
  description: "Terms and Conditions for ApeX Studio. Please read these terms carefully before using our website or services.",
  path: "/terms",
  noIndex: false,
});

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm uppercase tracking-[0.2em] text-[#a3a3a3] hover:text-[#d4f000] transition-colors mb-12 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-8 font-[family-name:var(--font-syne)]">Terms & Conditions</h1>
        <p className="text-[#a3a3a3] mb-6">Last updated: June 2026</p>

        <section className="space-y-6 text-[#c0c0c0] leading-relaxed">
          <div>
            <h2 className="text-white text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using the ApeX Studio website and services, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.</p>
          </div>

          <div>
            <h2 className="text-white text-xl font-semibold mb-3">2. Services</h2>
            <p>ApeX Studio provides web development, AI automation, 3D web experiences, branding, and related digital services. The scope, timeline, and pricing for each project are defined in a separate service agreement.</p>
          </div>

          <div>
            <h2 className="text-white text-xl font-semibold mb-3">3. Intellectual Property</h2>
            <p>Upon full payment, clients retain ownership of the final delivered work. ApeX Studio retains the right to display completed work in its portfolio unless otherwise agreed in writing.</p>
          </div>

          <div>
            <h2 className="text-white text-xl font-semibold mb-3">4. User Responsibilities</h2>
            <p>You agree to provide accurate information when contacting us and to not use our website for any unlawful purpose. You are responsible for maintaining the confidentiality of any account credentials.</p>
          </div>

          <div>
            <h2 className="text-white text-xl font-semibold mb-3">5. Limitation of Liability</h2>
            <p>ApeX Studio shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability is limited to the amount paid for the specific service giving rise to the claim.</p>
          </div>

          <div>
            <h2 className="text-white text-xl font-semibold mb-3">6. Termination</h2>
            <p>Either party may terminate a service agreement according to the terms outlined in the specific project contract. We reserve the right to refuse service to anyone.</p>
          </div>

          <div>
            <h2 className="text-white text-xl font-semibold mb-3">7. Changes to Terms</h2>
            <p>We may update these terms at any time. Changes will be posted on this page with an updated date. Continued use of our services constitutes acceptance of the revised terms.</p>
          </div>

          <div>
            <h2 className="text-white text-xl font-semibold mb-3">8. Contact</h2>
            <p>For questions about these terms, contact us at <a href="mailto:hello@buildwithapex.app" className="text-[#d4f000] hover:underline">hello@buildwithapex.app</a>.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
