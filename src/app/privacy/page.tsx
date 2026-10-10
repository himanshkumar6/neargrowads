import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | NearGrow Ads",
  description: "Privacy policy detailing how NearGrow Ads collects and uses your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 xs:pt-28 sm:pt-32 pb-16 xs:pb-20 sm:pb-24 bg-white dark:bg-[#050b14]">
      <div className="container mx-auto px-3 xs:px-4 md:px-8 max-w-4xl">
        
        {/* Header */}
        <header className="mb-8 xs:mb-12 md:mb-16 border-b border-gray-200 dark:border-gray-800 pb-6 xs:pb-8">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 xs:mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400">
            Last updated: June 11, 2026
          </p>
        </header>

        {/* Content */}
        <article className="text-sm xs:text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-6 xs:space-y-8 break-words">
          
          <section>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2.5 xs:mb-4">1. Introduction</h2>
            <p>
              At NearGrow Ads (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or engage with our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2.5 xs:mb-4">2. Information We Collect</h2>
            <p className="mb-3 xs:mb-4">
              We may collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services. The personal information that we collect depends on the context of your interactions with us and the website, and may include:
            </p>
            <ul className="list-disc pl-4 xs:pl-6 space-y-1.5 xs:space-y-2">
              <li>Names and Job Titles</li>
              <li>Contact information including email addresses and phone numbers</li>
              <li>Billing addresses and payment details for service fulfillment</li>
              <li>Data from cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2.5 xs:mb-4">3. How We Use Your Information</h2>
            <p className="mb-3 xs:mb-4">
              We use personal information collected via our website for a variety of business purposes described below:
            </p>
            <ul className="list-disc pl-4 xs:pl-6 space-y-1.5 xs:space-y-2">
              <li>To facilitate account creation and logon process.</li>
              <li>To send administrative information to you regarding our services or changes to our terms, conditions, and policies.</li>
              <li>To fulfill and manage your orders, payments, and service contracts.</li>
              <li>To deliver targeted advertising to you based on your interests and location.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2.5 xs:mb-4">4. Sharing Your Information</h2>
            <p>
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell or rent your personal information to third parties for their marketing purposes without your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2.5 xs:mb-4">5. Data Security</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
            </p>
          </section>

          <section>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2.5 xs:mb-4">6. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, you may contact our Data Protection Officer at:
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
