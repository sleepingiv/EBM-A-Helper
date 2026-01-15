
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Send, Stethoscope, ChevronRight, Activity, ShieldCheck, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, SuggestedQuery } from './types';
import { solveMedicalQuery } from './services/geminiService';
import MessageBubble from './components/MessageBubble';
import SkeletonLoader from './components/SkeletonLoader';
import DisclaimerModal from './components/DisclaimerModal';
import { SUGGESTED_QUERIES, DISCLAIMER_TEXT } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await solveMedicalQuery(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.summary,
        insight: response.insight,
        evidenceGrade: response.evidenceGrade,
        sources: response.sources,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Query Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error while consulting medical databases. Please check your connection and try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <DisclaimerModal 
        isOpen={showDisclaimer} 
        onAccept={() => setShowDisclaimer(false)} 
      />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 z-10 shrink-0 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">EBM Solver</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Grade A Medical Intel</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={startNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
          <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-[0.8]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
              >
                <div className="mb-8 p-4 bg-blue-50 rounded-full">
                  <Activity className="w-12 h-12 text-blue-600 animate-pulse" />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Verified Medical Answers</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed text-base md:text-lg">
                  Access clinical gold-standard guidelines and peer-reviewed evidence for your health questions.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                  {SUGGESTED_QUERIES.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q.prompt)}
                      className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl text-left hover:border-blue-300 hover:shadow-md transition-all group"
                    >
                      <span className="text-sm font-semibold text-slate-700">{q.title}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </button>
                  ))}
                </div>

                <div className="mt-12 flex items-center gap-2 px-6 py-3 bg-amber-50 rounded-2xl border border-amber-100 max-w-lg">
                  <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-[11px] text-amber-800 text-left leading-relaxed italic">
                    {DISCLAIMER_TEXT}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-2">
                {messages.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))}
                {isLoading && <SkeletonLoader />}
              </div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-slate-200 p-4 shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all p-1 shadow-inner">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a medical question (e.g., 'Treatments for low back pain')"
              className="flex-1 bg-transparent py-3 px-4 outline-none text-sm md:text-base text-slate-800 placeholder-slate-400 font-medium"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={`p-2.5 rounded-xl transition-all ${
                input.trim() && !isLoading 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:scale-105 active:scale-95' 
                : 'bg-slate-200 text-slate-400'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 opacity-40 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <History className="w-3 h-3" />
            Powered by Clinical Evidence Engines
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
