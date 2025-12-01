// Mock Base44 Client per development
// Sostituisci con il tuo vero client Base44

class Base44Client {
  constructor() {
    this.entities = {
      DailyVote: {
        filter: async (filter = {}, sort = null, limit = 200) => {
          // Simula una chiamata API
          const stored = localStorage.getItem('dailyVotes');
          return stored ? JSON.parse(stored) : [];
        },
        
        create: async (data) => {
          const stored = localStorage.getItem('dailyVotes');
          const votes = stored ? JSON.parse(stored) : [];
          
          const newVote = {
            id: Date.now().toString(),
            ...data,
            created_at: new Date().toISOString()
          };
          
          votes.push(newVote);
          localStorage.setItem('dailyVotes', JSON.stringify(votes));
          
          return newVote;
        },
        
        update: async (id, data) => {
          const stored = localStorage.getItem('dailyVotes');
          const votes = stored ? JSON.parse(stored) : [];
          
          const index = votes.findIndex(v => v.id === id);
          if (index !== -1) {
            votes[index] = { ...votes[index], ...data };
            localStorage.setItem('dailyVotes', JSON.stringify(votes));
            return votes[index];
          }
          
          throw new Error('Vote not found');
        }
      }
    };
  }
}

export const base44 = new Base44Client();