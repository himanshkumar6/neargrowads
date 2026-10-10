import ContactForm from "@/components/ContactForm";
import FAQ from "@/components/FAQ";
import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | NearGrow Ads",
  description: "Get in touch with NearGrow Ads for a free Google Maps visibility check and practical local marketing solutions.",
};

export default function ContactPage() {
  return (
    <>
      <div className="pt-24 xs:pt-28 sm:pt-32 pb-12 sm:pb-16 bg-gradient-to-b from-primary-50/50 dark:from-gray-900 to-white dark:to-gray-950 ">
        <div className="container mx-auto px-3 xs:px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 xs:mb-12 sm:mb-16">
            <h1 className="text-3xl xs:text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Let&apos;s Talk Growth</h1>
            <p className="text-base xs:text-lg sm:text-xl text-gray-700 dark:text-gray-300">
              Ready to improve your local visibility and acquire nearby customers? Reach out to discuss your goals with our team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
            <div className="lg:col-span-1 space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Contact Information</h3>
                <p className="text-sm xs:text-base text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                  Whether you have a question about our services, pricing, or anything else, our team is ready to answer all your questions.
                </p>
              </div>

              <div className="space-y-4 xs:space-y-6">
                <div className="flex items-start gap-3 xs:gap-4">
                  <div className="w-10 h-10 xs:w-12 xs:h-12 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 transition-colors">
                    <Phone className="w-5 h-5 xs:w-6 xs:h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-0.5 xs:mb-1 text-sm xs:text-base">Phone</h4>
                    <a href="tel:+919289810149" className="text-sm xs:text-base text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">+91 92898 10149</a>
                  </div>
                </div>

                <div className="flex items-start gap-3 xs:gap-4">
                  <div className="w-10 h-10 xs:w-12 xs:h-12 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 transition-colors">
                    <Mail className="w-5 h-5 xs:w-6 xs:h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-0.5 xs:mb-1 text-sm xs:text-base">Email</h4>
                    <a href="mailto:info@neargrowads.in" className="text-sm xs:text-base text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">info@neargrowads.in</a>
                  </div>
                </div>

                <div className="flex items-start gap-3 xs:gap-4">
                  <div className="w-10 h-10 xs:w-12 xs:h-12 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 transition-colors">
                    <MapPin className="w-5 h-5 xs:w-6 xs:h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-0.5 xs:mb-1 text-sm xs:text-base">Office</h4>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Pillar+no.+781,+B-1,+Bhagwati+Garden+Rd,+near+dwarka+mor,+Uttam+Nagar,+Bhagwati+Garden,+Nawada,+New+Delhi,+Delhi+110059"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 dark:text-gray-300 leading-relaxed block hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors"
                    >
                      Pillar no. 781, B-1, Bhagwati Garden Rd,<br/>
                      near dwarka mor, Uttam Nagar,<br/>
                      Bhagwati Garden, Nawada,<br/>
                      New Delhi, Delhi, 110059
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
      <FAQ />
    </>
  );
}
