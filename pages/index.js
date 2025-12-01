import React, { useState, useEffect } from 'react';
// CORREZIONE 1: L'alias '@/api/base44Client' ora punta a un client generico, 
// assumendo che 'base44Client.js' gestisca il nuovo storage.
// L'import viene modificato solo per coerenza e test, l'alias richiede jsconfig.json.
import { base44Client } from "@/api/base44Client"; 

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import AccessGate from "../components/AccessGate";
import VoteModal from "../components/VoteModal";
// CORREZIONE 2: Aggiunto .ts per risolvere il problema di estensione/case sensitivity su Vercel.
import { USERS, VOTE_OPTIONS } from "../components/ui/Constants.ts"; 
import { Calendar, Snowflake, Star } from "lucide-react";

export default function RoadToNatale() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const queryClient = useQueryClient();

  // --- GESTIONE DEI DATI (DA MODIFICARE PER IL NUOVO STORAGE 25) ---

  // Fetch votes
  const { data: votes = [], isLoading } = useQuery({
    queryKey: ['votes'],
    // QUESTO E' IL CODICE BASE44 ORIGINALE. DEVE ESSERE SOSTITUITO.
    // Il nuovo queryFn deve chiamare base44Client per recuperare i voti
    // dal tuo Storage 25 (es. usando kv.get('voti_natale'))
    queryFn: () => base44Client.DailyVote.filter({}, null, 200),  // **POTREBBE ROMPERSI SE base44Client NON HA .DailyVote**
    refetchInterval: 2000, // Faster updates
  });

  // Create/Update vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ day, value }) => {
      // Find existing vote for this user and day
      const existingVote = votes.find(v => v.day === day && v.user_key === currentUser.name);
      
      if (existingVote) {
        // QUESTO E' IL CODICE BASE44 ORIGINALE. DEVE ESSERE SOSTITUITO CON LOGICA KV.
        return base44Client.DailyVote.update(existingVote.id, { value });
      } else {
        // QUESTO E' IL CODICE BASE44 ORIGINALE. DEVE ESSERE SOSTITUITO CON LOGICA KV.
        return base44Client.DailyVote.create({ 
          day, 
          user_key: currentUser.name, 
          value 
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['votes']);
      setIsModalOpen(false);
    }
  });

  // --- FINE GESTIONE DEI DATI ---

  // Check login persistence
  useEffect(() => {
    const savedUserCode = localStorage.getItem('road_to_natale_user');
    if (savedUserCode) {
      const user = Object.values(USERS).find(u => u.code === savedUserCode);
      if (user) setCurrentUser(user);
    }
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem('road_to_natale_user', user.code);
    setCurrentUser(user);
  };

  const handleCellClick = (day, colUserKey) => {
    if (colUserKey !== currentUser.name) return; // Only allow clicking own column
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const handleVote = (value) => {
    if (selectedDay && currentUser) {
      voteMutation.mutate({ day: selectedDay, value });
    }
  };

  // Helper to get vote value for a cell
  const getVoteFor = (day, userKey) => {
    const vote = votes.find(v => v.day === day && v.user_key === userKey);
    return vote ? vote.value : null;
  };

  // Helper to calculate average for a day (4th column)
  const getDailyAverage = (day) => {
    const users = ['E', 'M', 'P'];
    const dayVotes = votes.filter(v => v.day === day && users.includes(v.user_key));
    
    if (dayVotes.length < 3) return null; // Only show if all 3 voted

    const sum = dayVotes.reduce((acc, curr) => acc + curr.value, 0);
    const avg = Math.round(sum / 3);
    return avg;
  };

  // Calculate Global Average
  const getGlobalAverage = () => {
    let totalSum = 0;
    let count = 0;

    for (let d = 1; d <= 24; d++) {
      const dailyAvg = getDailyAverage(d);
      if (dailyAvg !== null) {
        totalSum += dailyAvg;
        count++;
      }
    }

    if (count === 0) return null;
    // Closest value logic
    const globalAvgRaw = totalSum / count;
    return Math.round(globalAvgRaw);
  };

  const globalAvg = getGlobalAverage();
  // Ensure we don't look for an index out of bounds or invalid value
  const globalAvgOption = (globalAvg !== null && globalAvg >= 0) ? VOTE_OPTIONS.find(o => o.value === globalAvg) : null;

  // Render cell content
  const renderCellContent = (value, isAvg = false) => {
    if (value === null || value === undefined) return null;
    const option = VOTE_OPTIONS.find(o => o.value === value);
    if (!option) return null;
    
    const Icon = option.icon;
    
    return (
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${option.color} flex items-center justify-center ${option.iconColor || 'text-white'} shadow-sm mx-auto`}
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </motion.div>
    );
  };

  return (
    <div className="pb-32">
      {!currentUser && <AccessGate onLogin={handleLogin} />}
      
      {/* Header */}
      {/* ... (omesso per brevità) */}

      {/* Calendar Grid */}
      {/* ... (omesso per brevità) */}

      {/* Global Summary Footer */}
      {/* ... (omesso per brevità) */}

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
            <VoteModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onVote={handleVote}
                currentVote={getVoteFor(selectedDay, currentUser?.name)}
            />
        )}
      </AnimatePresence>
    </div>
  );

}
