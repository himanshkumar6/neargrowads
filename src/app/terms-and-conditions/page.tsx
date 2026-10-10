import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | NearGrow Ads",
  description: "Terms and conditions for using NearGrow Ads's services.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-24 xs:pt-28 sm:pt-32 pb-16 xs:pb-20 sm:pb-24 bg-white dark:bg-[#050b14]">
      <div className="container mx-auto px-3 xs:px-4 md:px-8 max-w-4xl">
        
        {/* Header */}
        <header className="mb-8 xs:mb-12 md:mb-16 border-b border-gray-200 dark:border-gray-800 pb-6 xs:pb-8">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 xs:mb-4 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400">
            Last updated: June 11, 2026
          </p>
        </header>

        {/* Content */}
        <article className="text-sm xs:text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-6 xs:space-y-8 break-words">
          
          <section>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2.5 xs:mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the services provided by NearGrow Ads (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our website or services.
            </p>
          </section>

          <section>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2.5 xs:mb-4">2. Description of Services</h2>
            <p>
              NearGrow Ads provides digital marketing, SEO, web development, and related consulting services. The specific details, deliverables, and timelines for your project will be outlined in a separate written agreement or Statement of Work (SOW).
            </p>
          </section>

          <section>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2.5 xs:mb-4">3. Intellectual Property Rights</h2>
            <p className="mb-3 xs:mb-4">
              All content on this website, including text, graphics, logos, and software, is the property of NearGrow Ads and is protected by international copyright laws.
            </p>
            <p>
              Upon full payment for our services, clients retain intellectual property rights to the final deliverables as specified in their individual contracts. We reserve the right to showcase completed work in our portfolio unless explicitly agreed otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2.5 xs:mb-4">4. Payment Terms</h2>
            <ul className="list-disc pl-4 xs:pl-6 space-y-1.5 xs:space-y-2">
              <li>Invoices are due upon receipt unless otherwise specified in your contract.</li>
              <li>We reserve the right to suspend services if payments are not received within the agreed-upon timeframe.</li>
              <li>All fees are non-refundable unless explicitly stated in a separate agreement.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2.5 xs:mb-4">5. Limitation of Liability</h2>
            <p>
              NearGrow Ads shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2.5 xs:mb-4">6. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <address className="mt-3 xs:mt-4 not-italic">
              <p><strong>NearGrow Ads</strong></p>
              <p>Pillar no. 781, B-1, Bhagwati Garden Rd,</p>
              <p>near dwarka mor, Uttam Nagar, Bhagwati Garden, Nawada,</p>
              <p>New Delhi, Delhi - 110059</p>
              <p className="mt-2">
                Email: <a href="mailto:info@neargrowads.in" className="text-primary-600 dark:text-primary-500 hover:underline">info@neargrowads.in</a>
              </p>
            </address>
          </section>

        </article>

        <div className="mt-10 xs:mt-16 pt-6 xs:pt-8 border-t border-gray-200 dark:border-gray-800">
          <Link href="/" className="text-xs xs:text-sm text-primary-600 dark:text-primary-500 font-medium hover:underline inline-flex items-center gap-1">
            &larr; Back to Home
          </Link>
        </div>
        
      </div>
    </main>
  );
}
