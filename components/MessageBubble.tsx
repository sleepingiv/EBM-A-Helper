
import React, { useState } from 'react';
import { Message } from '../types';
import { CheckCircle2, ChevronDown, ChevronUp, FileText, Clock, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [showInsight, setShowInsight] = useState(false);

  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-tr-none max-w-[85%] md:max-w-[70%] shadow-md"
        >
          <p className="text-sm md:text-base leading-relaxed">{message.content}</p>
          <div className="flex items-center justify-end mt-1 opacity-70">
            <Clock className="w-3 h-3 mr-1" />
            <span className="text-[10px]">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-8 max-w-[95%] md:max-w-[85%]">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-3"
      >
        {/* Evidence Badge */}
        <div className="flex items-center gap-2">
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Grade {message.evidenceGrade || 'A'} Evidence
          </div>
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-widest">Verified Medical Response</span>
        </div>

        {/* Answer Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm md:text-base">
            {/* Handle basic bolding if provided in markdown or string */}
            <p dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>') }} />
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {message.sources?.map((source, idx) => (
              <span key={idx} className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                <FileText className="w-3 h-3" />
                {source}
              </span>
            ))}
          </div>
        </div>

        {/* Insight Accordion */}
        {message.insight && (
          <div className="bg-slate-100/60 border border-slate-200/50 rounded-xl overflow-hidden transition-all duration-200">
            <button 
              onClick={() => setShowInsight(!showInsight)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-200/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                Evidence Context & Insight
              </div>
              {showInsight ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <AnimatePresence>
              {showInsight && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 pb-4 text-xs md:text-sm text-slate-600 border-t border-slate-200/50 pt-3 leading-relaxed">
                    {message.insight}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MessageBubble;
