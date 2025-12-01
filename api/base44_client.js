// Il client ora si occupa solo di chiamare le API interne di Next.js.

// Chiameremo le nostre API routes interne su /api/votes

const DailyVote = {
  // Simula la funzione .filter() chiamando l'API GET
  filter: async (filter = {}, sort = null, limit = 200) => {
    // La nostra API non usa filtri complessi; recupera tutto.
    const response = await fetch('/api/votes');
    if (!response.ok) {
        throw new Error('Failed to fetch votes from API');
    }
    const data = await response.json();
    return data; 
  },
  
  // Simula la funzione .create() / .update() chiamando l'API POST
  // L'API Route dovrà gestire se è un 'create' o un 'update'
  create: async (data) => {
    const response = await fetch('/api/votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to create vote');
    }
    return response.json();
  },
  
  // Simula la funzione .update() / .create() chiamando l'API POST
  // Riusiamo 'create' per la POST al momento, per semplificare l'API Route
  update: async (id, data) => {
    const response = await fetch('/api/votes', {
      method: 'POST', // Usiamo POST per creare/aggiornare
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...data, isUpdate: true }), // Indica all'API che è un aggiornamento
    });
    if (!response.ok) {
        throw new Error('Failed to update vote');
    }
    return response.json();
  }
};

export const base44Client = {
    DailyVote: DailyVote
};
