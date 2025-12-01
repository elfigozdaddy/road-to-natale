import React, { useState, useEffect } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import AccessGate from "../components/AccessGate";
import VoteModal from "../components/VoteModal";
import { USERS, VOTE_OPTIONS } from "../components/ui/Constants";
import { Calendar, Snowflake, Star } from "lucide-react";

export default function RoadToNatale() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const queryClient = useQueryClient();

  // Fetch votes
  const { data: votes = [], isLoading } = useQuery({
    queryKey: ['votes'],
    // Use filter to ensure we get all records, passing empty filter, no sort, and limit 200
    queryFn: () => base44.entities.DailyVote.filter({}, null, 200), 
    refetchInterval: 2000, // Faster updates
  });

  // Create/Update vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ day, value }) => {
      // Find existing vote for this user and day
      const existingVote = votes.find(v => v.day === day && v.user_key === currentUser.name);
      
      if (existingVote) {
        return base44.entities.DailyVote.update(existingVote.id, { value });
      } else {
        return base44.entities.DailyVote.create({ 
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
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-handwriting font-bold text-slate-900 flex items-center gap-2">
                <Snowflake className="w-6 h-6 text-red-600" />
                Road to Natale
                </h1>
                <p className="text-xs text-slate-500">2025 Edition</p>
            </div>
            {currentUser && (
                 <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase">Tu sei</span>
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">{currentUser.name}</span>
                 </div>
            )}
        </div>
      </header>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Header Row */}
        <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr] gap-2 mb-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider sticky top-[73px] bg-white/90 backdrop-blur-md py-2 z-20 rounded-b-xl shadow-sm border-b border-slate-200">
          <div className="flex items-center justify-center"><Calendar className="w-4 h-4" /></div>
          <div>E</div>
          <div>M</div>
          <div>P</div>
          <div>Avg</div>
        </div>

        {/* Days */}
        <div className="space-y-2">
          {Array.from({ length: 24 }, (_, i) => i + 1).map((day) => {
            const avg = getDailyAverage(day);
            const isComplete = avg !== null;

            return (
              <motion.div 
                key={day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: day * 0.02 }}
                className={`
                  grid grid-cols-[40px_1fr_1fr_1fr_1fr] gap-2 items-center
                  p-2 rounded-xl border transition-colors backdrop-blur-sm
                  ${isComplete ? 'bg-yellow-50/60 border-yellow-200' : 'bg-white/40 border-white/30'}
                `}
              >
                {/* Day Number */}
                <div className="flex items-center justify-center font-bold text-slate-400 text-sm">
                  {day}
                </div>

                {/* User Columns */}
                {['E', 'M', 'P'].map((userKey) => {
                  const val = getVoteFor(day, userKey);
                  const isMyColumn = currentUser?.name === userKey;
                  const isClickable = isMyColumn && !isLoading;

                  return (
                    <button
                      key={userKey}
                      disabled={!isClickable}
                      onClick={() => handleCellClick(day, userKey)}
                      className={`
                        aspect-square rounded-lg flex items-center justify-center transition-all relative overflow-hidden
                        ${isClickable ? 'hover:bg-slate-50 active:scale-95 ring-2 ring-transparent hover:ring-slate-200 cursor-pointer' : 'cursor-default opacity-90'}
                        ${!val && isClickable ? 'bg-slate-50 border-2 border-dashed border-slate-200' : ''}
                        ${!val && !isClickable ? 'bg-slate-50/50' : ''}
                      `}
                    >
                      {renderCellContent(val)}
                    </button>
                  );
                })}

                {/* Average Column */}
                <div className={`
                    aspect-square rounded-lg flex items-center justify-center
                    ${isComplete ? 'bg-white shadow-sm' : 'bg-slate-50/30'}
                `}>
                  {renderCellContent(avg, true)}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Global Summary Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 pb-8 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-md mx-auto flex items-center justify-between px-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Media Totale</p>
            <p className="text-sm text-slate-500">Fino ad oggi</p>
          </div>
          
          <div className="flex items-center gap-4">
            {globalAvgOption ? (
               <>
                 <span className={`text-lg font-bold ${globalAvgOption.text}`}>
                    {globalAvgOption.label}
                 </span>
                 <div className={`w-16 h-16 rounded-full ${globalAvgOption.color} flex items-center justify-center ${globalAvgOption.iconColor || 'text-white'} shadow-lg ring-4 ring-white`}>
                    <globalAvgOption.icon className="w-8 h-8" />
                 </div>
               </>
            ) : (
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <span className="text-xl font-bold">-</span>
                </div>
            )}
          </div>
        </div>
      </div>

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

