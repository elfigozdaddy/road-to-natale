import React from 'react';
import { motion } from 'framer-motion';
import { VOTE_OPTIONS } from './constants';
import { X } from 'lucide-react';

export default function VoteModal({ isOpen, onClose, onVote, currentVote }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl z-50"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Esprimi il tuo voto</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {VOTE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = currentVote === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => onVote(option.value)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3
                  ${isSelected ? 'border-slate-900 bg-slate-50' : 'border-slate-100 hover:border-slate-300'}
                `}
              >
                <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center text-white shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-medium text-slate-700">{option.label}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Valore {option.value}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}