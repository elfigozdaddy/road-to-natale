import React from 'react';
import { motion } from "framer-motion";


export default function Layout({ children }) {
  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-red-100 pb-20 relative bg-slate-900">
      {/* Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');
        .font-handwriting { font-family: 'Patrick Hand', cursive; }
      `}</style>

      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{ 
          backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692d7fbbfc08221cf3b2814b/1a66955dd_sfondo.jpg')` 
        }}
      />
      <div className="fixed inset-0 z-0 bg-black/20" /> {/* Slight overlay to ensure text readability */}

      {/* Simple festive top bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-green-600 to-red-600 z-50 shadow-md" />
      
      <main className="max-w-md mx-auto min-h-screen shadow-2xl overflow-hidden relative z-10 bg-white/60 backdrop-blur-md">
         {children}
      </main>
    </div>
  );
}