
import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DISCLAIMER_TEXT } from '../constants';

interface DisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onAccept }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Medical Safety & Responsibility</h2>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 text-left">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-900 leading-relaxed font-medium">
                    {DISCLAIMER_TEXT}
                  </p>
                </div>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed px-2">
                This tool uses Grade A medical evidence to provide information. It is designed for educational purposes and is not a clinical diagnosis tool.
              </p>
            </div>

            <button 
              onClick={onAccept}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              I Understand & Proceed
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DisclaimerModal;
