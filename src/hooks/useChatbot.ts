import { useState, useEffect, useCallback, useRef } from "react";
import { ChatbotState, ChatStep } from "@/types/chatbot";
import { CHAT_STEPS, CHATBOT_MESSAGES, SERVICES_LIST } from "@/lib/constants/chatbot";

const SESSION_STORAGE_KEY = "trisage_chatbot_state";

const INITIAL_STATE: ChatbotState = {
  isOpen: false,
  step: CHAT_STEPS.WELCOME,
  messages: [
    {
      id: "init",
      type: "bot",
      text: CHATBOT_MESSAGES.WELCOME,
      timestamp: 0,
    }
  ],
  isTyping: false,
  error: null,
  leadData: {}
};

export function useChatbot() {
  const [state, setState] = useState<ChatbotState>(INITIAL_STATE);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Murphy's Law: Synchronous lock to prevent rapid-fire double-click glitches
  const isProcessingRef = useRef(false);

  // Restore from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Only restore if it wasn't already successfully submitted
        if (parsed.step !== CHAT_STEPS.SUCCESS) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setState({ ...parsed, isOpen: false, isTyping: false }); // Always start closed
        }
      }
    } catch (e) {
      console.error("Failed to restore chatbot state", e);
    }
    setIsInitialized(true);
  }, []);

  // Persist to sessionStorage on state change
  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isInitialized]);

  const toggleOpen = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const addBotMessage = useCallback((text: string, options?: string[]) => {
    setState(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: Date.now().toString(),
          type: "bot",
          text,
          isOptions: !!options,
          options,
          timestamp: Date.now(),
        }
      ]
    }));
  }, []);

  const addUserMessage = useCallback((text: string) => {
    setState(prev => ({
      ...prev,
      error: null, // clear errors on new input
      messages: [
        ...prev.messages,
        {
          id: Date.now().toString(),
          type: "user",
          text,
          timestamp: Date.now(),
        }
      ]
    }));
  }, []);

  const setTyping = useCallback((isTyping: boolean) => {
    setState(prev => ({ ...prev, isTyping }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const advanceToNextStep = useCallback((nextStep: ChatStep, botText: string, options?: string[]) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      isProcessingRef.current = false; // Release lock when bot finishes typing
      setState(prev => ({ ...prev, step: nextStep }));
      addBotMessage(botText, options);
    }, 1000 + Math.random() * 500); // Realistic 1-1.5s typing delay
  }, [addBotMessage, setTyping]);

  const submitLead = useCallback(async (finalLeadData = state.leadData) => {
    setState(prev => ({ ...prev, step: CHAT_STEPS.SUBMITTING, isTyping: true, error: null }));
    
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...finalLeadData,
          page_url: window.location.href, // Grab the current URL automatically
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || "Failed to submit lead");
      }

      setState(prev => ({ 
        ...prev, 
        step: CHAT_STEPS.SUCCESS,
        isTyping: false
      }));
      isProcessingRef.current = false; // Release lock on success
      addBotMessage(CHATBOT_MESSAGES.SUCCESS);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      
    } catch (error) {
      console.error("Submission error:", error);
      isProcessingRef.current = false; // Release lock on error
      setState(prev => ({ 
        ...prev, 
        step: CHAT_STEPS.MESSAGE, // Go back to the last step so they can try again
        isTyping: false,
        error: "Failed to send message. Please try again."
      }));
    }
  }, [state.leadData, addBotMessage]);

  const handleInputSubmit = useCallback((value: string) => {
    // Murphy's Law: Block execution if currently processing, bot is typing, or already submitting
    if (isProcessingRef.current || state.isTyping || state.step >= CHAT_STEPS.SUBMITTING) {
      return;
    }

    const trimmed = value.trim();
    if (!trimmed) return;

    isProcessingRef.current = true; // Engage synchronous lock immediately
    addUserMessage(trimmed);

    // Flow control
    if (state.step === CHAT_STEPS.WELCOME) {
      // User sent their initial casual message
      // Store it in the 'message' field (can be overwritten or appended later)
      setState(prev => ({ ...prev, leadData: { ...prev.leadData, message: trimmed } }));
      advanceToNextStep(CHAT_STEPS.NAME, CHATBOT_MESSAGES.ASK_NAME);
      
    } else if (state.step === CHAT_STEPS.NAME) {
      if (trimmed.length < 2) {
        setError("Please enter a valid name.");
        isProcessingRef.current = false; // Release lock on error
        return;
      }
      setState(prev => ({ ...prev, leadData: { ...prev.leadData, name: trimmed } }));
      advanceToNextStep(CHAT_STEPS.EMAIL, CHATBOT_MESSAGES.ASK_EMAIL);
      
    } else if (state.step === CHAT_STEPS.EMAIL) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        setError("Please enter a valid email address.");
        isProcessingRef.current = false; // Release lock on error
        return;
      }
      setState(prev => ({ ...prev, leadData: { ...prev.leadData, email: trimmed } }));
      
      // Since phone is also required, remove the "Skip" option
      advanceToNextStep(CHAT_STEPS.PHONE, CHATBOT_MESSAGES.ASK_PHONE);

    } else if (state.step === CHAT_STEPS.PHONE) {
      // Require at least one contact method
      if (trimmed.length < 8) {
        setError("Please enter a valid phone number.");
        isProcessingRef.current = false; // Release lock on error
        return;
      }
      
      setState(prev => ({ ...prev, leadData: { ...prev.leadData, phone: trimmed } }));
      advanceToNextStep(CHAT_STEPS.SERVICE, CHATBOT_MESSAGES.ASK_SERVICE, SERVICES_LIST);

    } else if (state.step === CHAT_STEPS.SERVICE) {
      setState(prev => ({ ...prev, leadData: { ...prev.leadData, service: trimmed } }));
      advanceToNextStep(CHAT_STEPS.MESSAGE, CHATBOT_MESSAGES.ASK_MESSAGE, ["Skip"]);

    } else if (state.step === CHAT_STEPS.MESSAGE) {
      // Append additional message to the initial casual message
      const existingMessage = state.leadData.message || "";
      const finalMessage = trimmed.toLowerCase() !== 'skip' ? `${existingMessage}\n\nAdditional Note: ${trimmed}` : existingMessage;
      
      const newLeadData = { ...state.leadData, message: finalMessage };
      setState(prev => ({ ...prev, leadData: newLeadData }));
      submitLead(newLeadData);
    }
  }, [state, addUserMessage, advanceToNextStep, setError, submitLead]);

  const handleOptionSelect = useCallback((option: string) => {
    // Treat clicking an option exactly the same as typing it
    if (isProcessingRef.current || state.isTyping) return; // Murphy's Law strict block
    handleInputSubmit(option);
  }, [handleInputSubmit, state.isTyping]);

  const resetSession = useCallback(() => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setState({ ...INITIAL_STATE, isOpen: true });
  }, []);

  return {
    state,
    toggleOpen,
    handleInputSubmit,
    handleOptionSelect,
    resetSession
  };
}
