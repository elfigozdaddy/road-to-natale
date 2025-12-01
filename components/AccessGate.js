import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { USERS } from './Constants';

export default function AccessGate({ onLogin }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const normalizedCode = code.toLowerCase().trim();
    
    const foundUser = Object.values(USERS).find(u => u.code === normalizedCode);
    
    if (foundUser) {
      onLogin(foundUser);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-sm rounded-2xl p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Road to Natale 2025</h1>
          <p className="text-slate-500 mt-2">Inserisci il tuo codice personale</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Codice accesso..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`text-center text-lg py-6 tracking-wider ${error ? 'border-red-500 ring-red-200' : ''}`}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-medium rounded-xl transition-all"
          >
            Entra <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-center text-sm font-medium"
            >
              Codice non valido
            </motion.p>
          )}
        </form>
      </motion.div>
    </div>
  );

}
