'use client';

import { motion } from 'framer-motion';
import { TravelGuide } from '@/types';
import { OverviewSection } from './OverviewSection';
import { CitiesSection } from './CitiesSection';
import { NeighborhoodsSection } from './NeighborhoodsSection';
import { AttractionsSection } from './AttractionsSection';
import { BudgetSection } from './BudgetSection';
import { TransportSection } from './TransportSection';
import { SafetySection } from './SafetySection';
import { CultureSection } from './CultureSection';
import { MistakesSection } from './MistakesSection';
import { BestForSection } from './BestForSection';
import { ArrowUp, Download, Share2 } from 'lucide-react';

interface TravelGuideDisplayProps {
  guide: TravelGuide;
  onReset: () => void;
}

export function TravelGuideDisplay({ guide, onReset }: TravelGuideDisplayProps) {
  // CRITICAL: Return null if guide is not provided to prevent client-side crash
  if (!guide) {
    console.error('TravelGuideDisplay: guide prop is undefined');
    return null;
  }
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen"
      data-theme={guide.theme || 'default'}
    >
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-card-border">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onReset}
              className="font-bold text-xl text-primary hover:text-primary-dark transition-colors"
            >
              YouTravel
            </button>
            
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Share2 className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Download className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={onReset}
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors text-sm"
              >
                New Search
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container-custom py-8">
        <OverviewSection 
          overview={guide.overview} 
          destination={guide.destination}
          imageUrl={guide.images?.[0]?.url}
        />
        
        <CitiesSection cities={guide.topCities} />
        
        <NeighborhoodsSection neighborhoods={guide.neighborhoods} />
        
        <AttractionsSection attractions={guide.attractions} />
        
        <BudgetSection budget={guide.budget} />
        
        <TransportSection transportation={guide.transportation} />
        
        <SafetySection safety={guide.safety} />
        
        <CultureSection culture={guide.culture} />
        
        <MistakesSection mistakes={guide.mistakes} />
        
        <BestForSection bestFor={guide.bestFor} />
        
        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready for your adventure in {guide.destination || 'your destination'}?
          </h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            This guide was created by our AI research agent. Start a new search to explore more destinations.
          </p>
          <button
            onClick={onReset}
            className="px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-colors"
          >
            Explore Another Destination
          </button>
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted border-t border-card-border mt-16">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-lg text-foreground">YouTravel</p>
              <p className="text-sm text-muted-foreground">AI-Powered Travel Research</p>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 YouTravel. Powered by AI.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Scroll to Top */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors flex items-center justify-center"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}
