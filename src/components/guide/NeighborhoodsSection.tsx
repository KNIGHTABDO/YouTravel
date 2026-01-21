'use client';

import { motion } from 'framer-motion';
import { Home, MapPin, DollarSign, Star } from 'lucide-react';
import { Neighborhood } from '@/types';
import { cn } from '@/lib/utils';

interface NeighborhoodsSectionProps {
  neighborhoods: Neighborhood[];
}

const typeColors = {
  'budget': 'bg-green-100 text-green-700',
  'mid-range': 'bg-blue-100 text-blue-700',
  'luxury': 'bg-purple-100 text-purple-700',
  'local': 'bg-orange-100 text-orange-700',
};

export function NeighborhoodsSection({ neighborhoods }: NeighborhoodsSectionProps) {
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
          <Home className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Where to Stay</h2>
          <p className="text-muted-foreground">Best neighborhoods for every budget and style</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {neighborhoods.map((neighborhood, index) => (
          <motion.div
            key={neighborhood.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-card-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Header */}
            <div className="p-6 border-b border-card-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{neighborhood.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {neighborhood.city}
                  </p>
                </div>
                <span className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium capitalize',
                  typeColors[neighborhood.type]
                )}>
                  {neighborhood.type}
                </span>
              </div>
              
              <p className="text-muted-foreground text-sm">{neighborhood.description}</p>
            </div>
            
            {/* Price Range */}
            <div className="px-6 py-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>Nightly rate</span>
                </div>
                <span className="font-bold text-foreground">
                  ${neighborhood.priceRange.min} - ${neighborhood.priceRange.max}
                </span>
              </div>
            </div>
            
            {/* Best For */}
            <div className="p-6">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Best for</p>
              <div className="flex flex-wrap gap-2">
                {neighborhood.bestFor.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/5 text-primary rounded text-xs font-medium"
                  >
                    <Star className="w-3 h-3" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Nearby */}
            {neighborhood.nearbyAttractions.length > 0 && (
              <div className="px-6 pb-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Nearby</p>
                <p className="text-sm text-foreground">{neighborhood.nearbyAttractions.join(' • ')}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
