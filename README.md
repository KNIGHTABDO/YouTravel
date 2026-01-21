# YouTravel - AI-Native Autonomous Travel Research Agent

An AI-powered travel research web application that creates premium travel guides from a single destination input. Built with Next.js, TypeScript, and the GitHub Models API.

## Features

- **Single Input Interface**: Just enter a country or city
- **Autonomous AI Research**: AI plans and executes multi-step research automatically
- **Deep Analysis**: Cross-references multiple sources to verify information
- **Premium Travel Guides**: Editorial-quality guides with actionable recommendations
- **Beautiful UI**: Clean, minimal, and responsive design
- **Country-Themed Colors**: Dynamic theming based on destination

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI**: GitHub Models API with GPT-5

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- GitHub Token (for AI features)

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your GitHub token to .env.local
# GITHUB_TOKEN=your_github_token_here

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

Create a `.env.local` file with:

```env
GITHUB_TOKEN=your_github_token_here
```

The app works without a token (with simulated responses) for development.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── research/
│   │       └── route.ts      # AI research endpoint
│   ├── globals.css           # Global styles & themes
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page component
├── components/
│   ├── guide/
│   │   ├── OverviewSection.tsx
│   │   ├── CitiesSection.tsx
│   │   ├── NeighborhoodsSection.tsx
│   │   ├── AttractionsSection.tsx
│   │   ├── BudgetSection.tsx
│   │   ├── TransportSection.tsx
│   │   ├── SafetySection.tsx
│   │   ├── CultureSection.tsx
│   │   ├── MistakesSection.tsx
│   │   ├── BestForSection.tsx
│   │   └── TravelGuideDisplay.tsx
│   ├── DestinationInput.tsx
│   └── ResearchProgress.tsx
├── lib/
│   ├── tools.ts              # AI tool definitions
│   ├── toolExecutor.ts       # Tool execution logic
│   └── utils.ts              # Utility functions
└── types/
    └── index.ts              # TypeScript types
```

## AI Tools

The AI agent has access to these research tools:

- `web_search` - Search the web for travel information
- `discover_places` - Find cities, attractions, and points of interest
- `get_location_details` - Get detailed location information
- `estimate_costs` - Calculate budget estimates
- `analyze_safety` - Review safety conditions
- `get_cultural_info` - Learn about customs and etiquette
- `get_transportation_info` - Map transport options
- `search_images` - Find destination imagery
- `compare_neighborhoods` - Compare areas for accommodation
- `get_weather_climate` - Check weather patterns
- `get_visa_entry_info` - Review entry requirements
- `rank_destinations` - Rank cities and regions
- `get_local_tips` - Gather insider tips
- `analyze_traveler_fit` - Match traveler types

## Customization

### Adding New Themes

Edit `src/app/globals.css` to add country-specific color themes:

```css
[data-theme="your-country"] {
  --primary: #yourcolor;
  --primary-light: #yourlightcolor;
  --primary-dark: #yourdarkcolor;
  --accent: #youraccent;
}
```

### Adding Destination Data

Edit `src/lib/toolExecutor.ts` to add pre-built destination data for faster responses.

## License

MIT
