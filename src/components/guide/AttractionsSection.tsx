'use client';

import { motion } from 'framer-motion';
import { Compass, Clock, DollarSign, Lightbulb, Sparkles, Eye, Utensils, Moon, TreePine, Landmark } from 'lucide-react';
import { Attraction } from '@/types';
import { cn } from '@/lib/utils';

interface AttractionsSectionProps {
  attractions: Attraction[];
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  'popular': { icon: <Eye className="w-4 h-4" />, color: 'bg-blue-100 text-blue-700', label: 'Popular' },
  'hidden-gem': { icon: <Sparkles className="w-4 h-4" />, color: 'bg-purple-100 text-purple-700', label: 'Hidden Gem' },
  'cultural': { icon: <Landmark className="w-4 h-4" />, color: 'bg-orange-100 text-orange-700', label: 'Cultural' },
  'nature': { icon: <TreePine className="w-4 h-4" />, color: 'bg-green-100 text-green-700', label: 'Nature' },
  'food': { icon: <Utensils className="w-4 h-4" />, color: 'bg-red-100 text-red-700', label: 'Food' },
  'nightlife': { icon: <Moon className="w-4 h-4" />, color: 'bg-indigo-100 text-indigo-700', label: 'Nightlife' },
};

export function AttractionsSection({ attractions }: AttractionsSectionProps) {
  // Return null if no attractions data
  if (!attractions || attractions.length === 0) {
    return null;
  }
  
  // Separate popular from hidden gems
  const popular = attractions.filter(a => a.type === 'popular' || a.type === 'cultural');
  const hiddenGems = attractions.filter(a => a.type === 'hidden-gem' || a.type === 'nature' || a.type === 'food' || a.type === 'nightlife');
  
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-16"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <Compass className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">What to See & Do</h2>
          <p className="text-muted-foreground">Must-visit places and hidden gems</p>
        </div>
      </div>
      
      {/* Popular Attractions */}
      {popular.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Must-See Attractions
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {popular.map((attraction, index) => (
              <AttractionCard key={attraction.name} attraction={attraction} index={index} />
            ))}
          </div>
        </div>
      )}
      
      {/* Hidden Gems */}
      {hiddenGems.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Hidden Gems & Local Favorites
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {hiddenGems.map((attraction, index) => (
              <AttractionCard key={attraction.name} attraction={attraction} index={index} />
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}

function AttractionCard({ attraction, index }: { attraction: Attraction; index: number }) {
  const config = typeConfig[attraction.type] || typeConfig.popular;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg border border-card-border overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="text-lg font-bold text-foreground">{attraction.name}</h4>
            <p className="text-sm text-muted-foreground">{attraction.city}</p>
          </div>
          <span className={cn(
            'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium',
            config.color
          )}>
            {config.icon}
            {config.label}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4">{attraction.description}</p>
        
        {/* Why Visit */}
        <div className="bg-primary/5 rounded-xl p-4 mb-4">
          <p className="text-sm font-medium text-primary mb-1">Why visit?</p>
          <p className="text-sm text-foreground">{attraction.whyVisit}</p>
        </div>
        
        {/* Quick Info */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{attraction.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span>{attraction.cost}</span>
          </div>
        </div>
        
        {/* Tips */}
        {attraction.tips && attraction.tips.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              Pro Tips
            </p>
            <ul className="space-y-1">
              {attraction.tips.map((tip, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}
