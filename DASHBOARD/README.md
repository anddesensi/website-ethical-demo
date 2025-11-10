# Ethics Matrix Dashboard

An interactive ethics assessment tool featuring 24 carefully crafted questions that map your ethical orientation across two dimensions:

- **X-axis**: Universalism ← → Utilitarianism
- **Y-axis**: Harmful ← → Non-harmful

## Features

- ✅ 24 comprehensive ethical statements
- 📊 Live interactive scatter chart visualization
- 💾 Automatic local storage (browser-based)
- 📥 Export results as JSON or CSV
- 🎨 Modern, responsive UI with dark theme
- 🔒 Privacy-first: all data stays in your browser

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## How It Works

1. **Answer Questions**: Rate each of the 24 statements on a 5-point Likert scale
2. **Live Scoring**: Your position updates in real-time on the ethics matrix
3. **Interpretation**: Get insights into your ethical framework
4. **Export**: Download your results for further analysis

## Technology Stack

- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Language**: TypeScript

## License

MIT
