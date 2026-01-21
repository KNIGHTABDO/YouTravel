'use client';

import { motion } from 'framer-motion';
import { Trophy, Clock, Star, ChevronRight } from 'lucide-react';
import { CityRanking } from '@/types';
import { cn } from '@/lib/utils';

interface CitiesSectionProps {
  cities: CityRanking[];
}

export function CitiesSection({ cities }: CitiesSectionProps) {
  // Return null if no cities data
  if (!cities || cities.length === 0) {
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
          <Trophy className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Top Cities & Regions</h2>
          <p className="text-muted-foreground">Ranked by uniqueness, accessibility, and experience</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {cities.map((city, index) => (
          <motion.div
            key={city.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'bg-white rounded-2xl shadow-lg border border-card-border overflow-hidden',
              'hover:shadow-xl transition-shadow duration-300'
            )}
          >
            <div className="flex flex-col md:flex-row">
              {/* Rank Badge */}
              <div className="md:w-24 flex md:flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-dark p-4 md:p-6 text-white">
                <span className="text-3xl md:text-4xl font-bold">#{city.rank}</span>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">{city.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{city.idealDuration}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">{city.description}</p>
                
                <div className="bg-primary/5 rounded-xl p-4 mb-4">
                  <p className="text-sm font-medium text-primary mb-1">Why visit?</p>
                  <p className="text-foreground">{city.whyVisit}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Highlights</p>
                  <div className="flex flex-wrap gap-2">
                    {(city.highlights || []).map((highlight, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm text-foreground"
                      >
                        <Star className="w-3 h-3 text-accent" />
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
