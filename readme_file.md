# 🎄 Road to Natale 2025

Un calendario dell'avvento interattivo dove tre utenti possono votare giornalmente il loro comportamento.

## 🚀 Features

- **Sistema di voti giornalieri** (1-24 dicembre)
- **4 livelli di valutazione**: Cattivo, Medio, Bravissimo, Fantastico
- **Media giornaliera** calcolata automaticamente
- **Media globale** per tutto il periodo
- **Autenticazione** con codici personali
- **UI festiva** con animazioni fluide

## 🛠️ Tech Stack

- **Next.js 14** - Framework React
- **TailwindCSS** - Styling
- **Framer Motion** - Animazioni
- **React Query** - State management
- **Lucide React** - Icone

## 📦 Installazione

```bash
# Clona il repository
git clone https://github.com/tuo-username/road-to-natale.git

# Entra nella cartella
cd road-to-natale

# Installa le dipendenze
npm install

# Avvia in development
npm run dev
```

## 🌐 Deploy su Vercel

1. Fai push del codice su GitHub
2. Vai su [vercel.com](https://vercel.com)
3. Importa il repository
4. Vercel rileverà automaticamente Next.js
5. Clicca "Deploy"!

## 🔐 Codici di Accesso

- **E**: `alpha`
- **M**: `bravo`
- **P**: `charlie`

## 📝 Struttura del Progetto

```
├── pages/
│   ├── _app.js              # App wrapper con QueryClient
│   ├── index.js             # Home page
│   └── RoadToNatale.js      # Pagina principale
├── components/
│   ├── AccessGate.js        # Gate di autenticazione
│   ├── VoteModal.js         # Modale per votare
│   ├── constants.ts         # Costanti e configurazioni
│   └── ui/                  # Componenti UI base
├── api/
│   └── base44Client.js      # Client API (mock)
├── Layout.js                # Layout principale
└── styles/
    └── globals.css          # Stili globali
```

## 🎨 Personalizzazione

Modifica i colori, le icone e i valori in `components/constants.ts`:

```typescript
export const VOTE_OPTIONS = [
  { value: 0, label: "Cattivo", color: "bg-red-500", icon: X },
  // ...
];
```

## 📄 Licenza

MIT

## 🤝 Contributing

Pull requests sono benvenute! Per modifiche importanti, apri prima un issue.

---

Fatto con ❤️ per Natale 2025 🎅