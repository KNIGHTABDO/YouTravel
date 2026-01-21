'use client';

import { motion } from 'framer-motion';
import { Users, Star, Heart } from 'lucide-react';
import { TravelerType } from '@/types';

interface BestForSectionProps {
  bestFor: TravelerType[];
}

const travelerIcons: Record<string, string> = {
  'Solo': '🧭',
  'Couples': '💑',
  'Families': '👨‍👩‍👧‍👦',
  'Budget': '💰',
  'Luxury': '✨',
  'Adventure': '🏔️',
  'Culture': '🏛️',
  'Food': '🍜',
  'First-time': '🌟',
  'Tech': '🎮',
  'default': '✈️',
};

function getIcon(type: string): string {
  for (const [key, icon] of Object.entries(travelerIcons)) {
    if (type.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return travelerIcons.default;
}

export function BestForSection({ bestFor }: BestForSectionProps) {
  // Return null if no bestFor data
  if (!bestFor || bestFor.length === 0) {
    return null;
  }
  
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
          <Heart className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Who This Destination Is For</h2>
          <p className="text-muted-foreground">Find out if this place matches your travel style</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bestFor.map((traveler, index) => (
          <motion.div
            key={traveler.type}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-card-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-b border-card-border">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{getIcon(traveler.type)}</span>
                <h3 className="text-lg font-bold text-foreground">{traveler.type}</h3>
              </div>
            </div>
            
            {/* Why */}
            <div className="p-6">
              <p className="text-muted-foreground mb-4">{traveler.why}</p>
              
              {/* Highlights */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Highlights</p>
                <ul className="space-y-2">
                  {traveler.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-sm text-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
