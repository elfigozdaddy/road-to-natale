// File: ./pages/api/votes.js
import { createClient } from '@vercel/kv';

// Inizializza Vercel KV client
// Le variabili d'ambiente KV_REST_API_URL, KV_REST_API_TOKEN, ecc.
// devono essere configurate nelle impostazioni di Vercel del progetto.
// L'ID del tuo storage (ecfg_jgdfuhsudlmgcandmfxjponbmwjg) è gestito internamente dalle ENV.
const kv = createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
});

// Chiave unica per immagazzinare tutti i voti
const VOTE_KEY = 'road_to_natale_votes';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Recupera tutti i voti
        try {
            const votes = await kv.get(VOTE_KEY) || [];
            return res.status(200).json(votes);
        } catch (error) {
            console.error("KV GET Error:", error);
            return res.status(500).json({ error: 'Failed to fetch votes' });
        }
    }

    if (req.method === 'POST') {
        // Crea o Aggiorna un voto
        const { day, user_key, value, id, isUpdate } = req.body;
        
        if (!day || !user_key || value === undefined) {
            return res.status(400).json({ error: 'Missing required vote fields' });
        }

        try {
            let votes = await kv.get(VOTE_KEY) || [];
            let newVote;

            // Logica di Update (simile a base44)
            const existingIndex = votes.findIndex(v => v.day === day && v.user_key === user_key);

            if (existingIndex !== -1) {
                // UPDATE
                votes[existingIndex] = { ...votes[existingIndex], value, updated_at: new Date().toISOString() };
                newVote = votes[existingIndex];
            } else {
                // CREATE
                newVote = {
                    id: Date.now().toString() + '-' + user_key,
                    day,
                    user_key,
                    value,
                    created_at: new Date().toISOString(),
                };
                votes.push(newVote);
            }

            // Scrive l'intero array di voti
            await kv.set(VOTE_KEY, votes); 
            
            return res.status(200).json(newVote);

        } catch (error) {
            console.error("KV POST Error:", error);
            return res.status(500).json({ error: 'Failed to save vote' });
        }
    }
    
    // Metodi non supportati
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
