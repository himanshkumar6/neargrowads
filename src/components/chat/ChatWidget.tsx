"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useChatbot } from "@/hooks/useChatbot";
import { CHAT_STEPS } from "@/lib/constants/chatbot";

// Lazy-load the heavy ChatInterface chunk so it doesn't block the initial page render
const ChatInterface = dynamic(() => import("./ChatInterface"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

export default function ChatWidget() {
  const pathname = usePathname();
  const isEmsPage = pathname?.startsWith("/admin") || pathname?.startsWith("/login") || pathname?.startsWith("/dashboard");

  const [mounted, setMounted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [vvStyle, setVvStyle] = useState<React.CSSProperties>({});
  const { state, toggleOpen, handleInputSubmit, handleOptionSelect, resetSession } = useChatbot();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling and rubber-banding when chat is open on mobile
  useEffect(() => {
    if (typeof window === 'undefined' || isEmsPage) return;
    
    if (state.isOpen && window.innerWidth < 640) {
      const scrollY = window.scrollY;
      
      // Lock the body to completely prevent background scrolling/swiping
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        // Restore scroll position precisely
        window.scrollTo(0, scrollY);
      };
    }
  }, [state.isOpen, isEmsPage]);

  // Bulletproof mobile and tablet keyboard fix using Visual Viewport API
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport || isEmsPage) return;
    
    const handleResize = () => {
      if (!window.visualViewport) return;
      const isMobile = window.innerWidth < 640;
      const vv = window.visualViewport;

      if (isMobile) {
        setVvStyle({
          height: `${vv.height}px`,
          top: `${vv.offsetTop}px`,
          left: `${vv.offsetLeft}px`,
          width: `${vv.width}px`,
        });
      } else {
        // Tablet (Portrait & Landscape) and Desktop keyboard/height adaptation:
        const keyboardOffset = Math.max(0, window.innerHeight - (vv.offsetTop + vv.height));
        
        if (keyboardOffset > 50) {
          // Virtual keyboard is active on tablet/desktop touch devices!
          const availableHeight = Math.min(520, Math.max(280, vv.height - 24));
          setVvStyle({
            bottom: `${keyboardOffset + 12}px`,
            height: `${availableHeight}px`,
            maxHeight: `${availableHeight}px`,
          });
        } else if (window.innerHeight < 700) {
          // Short landscape viewport (e.g. tablet in landscape with browser chrome)
          const availableHeight = Math.min(480, Math.max(300, window.innerHeight - 80));
          setVvStyle({
            bottom: '12px',
            height: `${availableHeight}px`,
            maxHeight: `${availableHeight}px`,
          });
        } else {
          setVvStyle({}); // Standard desktop dimensions
        }
      }
    };

    // The scroll event is critical on iOS/Android because the keyboard forces a scroll
    // without triggering a resize if the visual viewport shrinks natively.
    window.visualViewport.addEventListener('resize', handleResize);
    window.visualViewport.addEventListener('scroll', handleResize);
    handleResize(); // Initial measurement

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, [state.isOpen, isEmsPage]);

  // Hide on Admin/EMS routes or before client mount to prevent SSR hydration attribute mismatch
  if (!mounted || isEmsPage) return null;

  return (
    <>
      {/* 1. Modal Container - Decoupled from the bottom-right button to prevent keyboard pushing on Android/iOS */}
      <AnimatePresence>
        {state.isOpen && (
          <>
            {/* Dark Backdrop to prevent background interactions on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm sm:hidden"
              onClick={toggleOpen}
            />

            <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={Object.keys(vvStyle).length > 0 ? vvStyle : {}}
            data-lenis-prevent="true"
            className="fixed top-0 left-0 z-[1000] w-full h-[100dvh] sm:h-[520px] sm:max-h-[calc(100dvh-100px)] sm:inset-auto sm:bottom-20 md:bottom-24 sm:right-4 md:right-6 sm:w-[380px] origin-bottom-right flex flex-col shadow-2xl"
          >
            <ChatInterface 
              state={state}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSubmit={() => {
                if (!inputValue.trim()) return;
                handleInputSubmit(inputValue);
                setInputValue("");
              }}
              onOptionSelect={(option) => {
                if (state.step === CHAT_STEPS.SERVICE) {
                  setInputValue((prev) => {
                    if (!prev) return option;
                    const items = prev.split(',').map(s => s.trim()).filter(Boolean);
                    if (items.includes(option)) {
                      return items.filter(s => s !== option).join(', ');
                    } else {
                      return `${prev}, ${option}`;
                    }
                  });
                } else {
                  handleOptionSelect(option);
                }
              }}
              onClose={toggleOpen}
              onReset={resetSession}
            />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 2. Floating Toggle Button */}
      <div 
        id="chat-widget-container" 
        className="fixed bottom-3.5 right-3.5 sm:bottom-6 sm:right-6 z-[999] flex flex-col items-end floating-widget-container"
      >
        <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className="w-11 h-11 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-primary-600 to-primary-800 text-white shadow-xl shadow-primary-600/30 flex items-center justify-center hover:shadow-2xl hover:shadow-primary-600/40 transition-shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/50"
        aria-label={state.isOpen ? "Close chat window" : "Open chat window"}
      >
        <AnimatePresence mode="wait">
          {state.isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={20} strokeWidth={2.5} className="xs:w-6 xs:h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={20} strokeWidth={2} className="xs:w-6 xs:h-6 fill-white/10" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Notification dot */}
        {!state.isOpen && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 xs:w-4 xs:h-4 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></span>
        )}
      </motion.button>
      </div>
    </>
  );
}
