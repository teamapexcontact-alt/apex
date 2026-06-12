import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy | ApeX Studio",
  description: "Privacy Policy for ApeX Studio. Learn how we collect, use, and protect your personal information when you use our services.",
  path: "/privacy",
  noIndex: false,
});

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-24 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm uppercase tracking-[0.2em] text-[#a3a3a3] hover:text-[#d4f000] transition-colors mb-12 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-8 font-[family-name:var(--font-syne)]">Privacy Policy</h1>
        <p className="text-[#a3a3a3] mb-6">Last updated: June 2026</p>

        <section className="space-y-6 text-[#c0c0c0] leading-relaxed">
          <div>
            <h2 className="text-white text-xl font-semibold mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, including your name, email address, phone number, and company name when you submit our contact form. We also collect technical information automatically, such as your IP address, browser type, and pages visited.</p>
          </div>

          <div>
            <h2 className="text-white text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <p>We use your information to respond to your inquiries, provide our services, improve our website, and send occasional updates about our services with your consent. We do not sell your personal information to third parties.</p>
          </div>

          <div>
            <h2 className="text-white text-xl font-semibold mb-3">3. Data Storage & Security</h2>
            <p>Your data is stored securely using Firebase (Google Cloud Platform). We implement industry-standard security measures including encryption in transit and at rest. We retain your information only as long as necessary to fulfill the purposes described in this policy.</p>
          </div>

          <div>
            <h2 className="text-white text-xl font-semibold mb-3">4. Cookies & Tracking</h2>
            <p>We use Google Analytics 4 to understand how visitors interact with our website. Cookies are used to collect anonymous usage data. You can control cookie preferences through your browser settings.</p>
          </div>

          <div>
            <h2 className="text-white text-xl font-semibold mb-3">5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time. To exercise these rights, contact us at teamapex.contact@gmail.com.</p>
          </div>

          <div>
            <h2 className="text-white text-xl font-semibold mb-3">6. Third-Party Services</h2>
            <p>We use Firebase (Google) for authentication and database hosting, Resend for email delivery, and Vercel for website hosting. These providers have their own privacy policies governing data handling.</p>
          </div>

          <div>
            <h2 className="text-white text-xl font-semibold mb-3">7. Contact</h2>
            <p>For questions about this privacy policy, contact us at <a href="mailto:teamapex.contact@gmail.com" className="text-[#d4f000] hover:underline">teamapex.contact@gmail.com</a>.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
