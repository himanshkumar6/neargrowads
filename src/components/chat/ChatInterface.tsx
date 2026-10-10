/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef } from "react";
import { X, RefreshCcw } from "lucide-react";
import { ChatbotState, ChatMessage } from "@/types/chatbot";
import { CHAT_STEPS } from "@/lib/constants/chatbot";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import Image from "next/image";
import { BOT_AVATAR } from "@/lib/constants/chatbot";

interface ChatInterfaceProps {
  state: ChatbotState;
  inputValue: string;
  onInputChange: (val: string) => void;
  onSubmit: () => void;
  onOptionSelect: (option: string) => void;
  onClose: () => void;
  onReset?: () => void; // Optional reset for the session
}

export default function ChatInterface({
  state,
  inputValue,
  onInputChange,
  onSubmit,
  onOptionSelect,
  onClose,
  onReset
}: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Professional MNC-grade auto-scroll: 
  // We use a slight delay to allow Framer Motion animations to mount in the DOM before calculating the height.
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 50); // 50ms is the sweet spot for React DOM commit + Framer initialization
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, state.isTyping]);

  // Handle keyboard opening/closing which resizes the container
  useEffect(() => {
    if (!scrollRef.current) return;
    
    const resizeObserver = new ResizeObserver(() => {
      scrollToBottom();
    });
    
    resizeObserver.observe(scrollRef.current);
    
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 sm:rounded-2xl overflow-hidden shadow-2xl sm:border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-3 xs:px-4 py-2.5 xs:py-3 bg-linear-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:from-primary-900 text-white shadow-md z-10 relative">
        <div className="flex items-center gap-2.5 xs:gap-3">
          <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-white border border-gray-100 p-1 flex items-center justify-center relative shadow-md shrink-0">
            <Image 
              src={BOT_AVATAR} 
              alt="NearGrow Bot" 
              width={24} 
              height={24} 
              className="object-contain" 
            />
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 w-2 xs:w-2.5 h-2 xs:h-2.5 bg-green-400 border-2 border-primary-700 rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-xs xs:text-sm tracking-tight">NearGrow Chatbot</h3>
            <p className="text-[9px] xs:text-[10px] text-primary-100 font-medium tracking-wide uppercase opacity-90">Usually replies instantly</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {onReset && (
             <button 
               onClick={onReset}
               className="p-1 xs:p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
               aria-label="Restart chat"
               title="Restart chat"
             >
               <RefreshCcw size={15} className="xs:w-4 xs:h-4" />
             </button>
          )}
          <button 
            onClick={onClose}
            className="p-1 xs:p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close chat"
          >
            <X size={18} className="xs:w-5 xs:h-5" />
          </button>
        </div>
      </div>

      {/* Message Feed Area */}
      <div 
        ref={scrollRef}
        role="log"
        aria-live="polite"
        data-lenis-prevent="true"
        className="flex-1 min-h-0 overflow-y-auto chat-scrollbar overscroll-contain p-3 xs:p-4 bg-gray-50 dark:bg-gray-900/50 relative scroll-smooth"
      >
        <div className="flex flex-col space-y-2 pb-2">
          {state.messages.map((msg, index) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              onOptionSelect={onOptionSelect}
              currentInput={inputValue}
              showNextButton={state.step === CHAT_STEPS.SERVICE && index === state.messages.length - 1 && inputValue.trim().length > 0}
              onNext={onSubmit}
            />
          ))}
          
          {/* Typing Indicator */}
          {state.isTyping && (
            <div className="flex w-full mt-4 space-x-3 max-w-xs mr-auto items-end">
              <div className="shrink-0 mt-1 mb-1">
                <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-center p-1 overflow-hidden">
                  <Image src={BOT_AVATAR} alt="Bot Typing" width={16} height={16} className="object-contain opacity-50" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          
          {/* Invisible anchor for flawless auto-scrolling */}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>

      {/* Input Footer Area */}
      <div className="shrink-0 p-3 xs:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] xs:pb-[max(1rem,env(safe-area-inset-bottom))] bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.2)] relative z-10">
        {state.step === CHAT_STEPS.SUCCESS ? (
          <div className="text-center py-2 text-xs xs:text-sm text-gray-500 dark:text-gray-400">
            Conversation completed.
          </div>
        ) : (
          <ChatInput 
            value={inputValue}
            onChange={onInputChange}
            onSubmit={onSubmit}
            placeholder={
              state.step === CHAT_STEPS.EMAIL ? "Enter your email..." : 
              state.step === CHAT_STEPS.PHONE ? "Enter your phone..." : 
              state.step === CHAT_STEPS.SERVICE ? "Type or select services..." : 
              "Type a message..."
            }
            type={
              state.step === CHAT_STEPS.EMAIL ? "email" : 
              state.step === CHAT_STEPS.PHONE ? "tel" : 
              "text"
            }
            disabled={false}
            isLocked={state.isTyping || state.step === CHAT_STEPS.SUBMITTING}
            isLoading={state.step === CHAT_STEPS.SUBMITTING}
            error={state.error}
          />
        )}
      </div>
    </div>
  );
}
