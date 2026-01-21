'use client';

import { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, MapPin, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DestinationInputProps {
  onSubmit: (destination: string) => void;
  isLoading: boolean;
}

const popularDestinations = [
  { name: 'Japan', emoji: '🗾' },
  { name: 'France', emoji: '🇫🇷' },
  { name: 'Italy', emoji: '🇮🇹' },
  { name: 'Thailand', emoji: '🇹🇭' },
  { name: 'Greece', emoji: '🇬🇷' },
  { name: 'Morocco', emoji: '🇲🇦' },
];

export function DestinationInput({ onSubmit, isLoading }: DestinationInputProps) {
  const [destination, setDestination] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSubmit = () => {
    if (destination.trim() && !isLoading) {
      onSubmit(destination.trim());
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  const handleQuickSelect = (dest: string) => {
    setDestination(dest);
    onSubmit(dest);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Main Input */}
      <div className="relative">
        <motion.div
          className={cn(
            'relative bg-white rounded-2xl shadow-xl transition-all duration-300',
            isFocused ? 'shadow-2xl ring-2 ring-primary/30' : 'shadow-lg',
            isLoading && 'opacity-50 pointer-events-none'
          )}
          whileHover={{ scale: isLoading ? 1 : 1.01 }}
        >
          <div className="flex items-center p-2">
            <div className="flex-shrink-0 pl-4 pr-3">
              <MapPin className={cn(
                'w-6 h-6 transition-colors duration-300',
                isFocused ? 'text-primary' : 'text-muted-foreground'
              )} />
            </div>
            
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a country or city..."
              disabled={isLoading}
              className="flex-1 py-4 px-2 text-lg bg-transparent outline-none placeholder:text-muted-foreground/60"
            />
            
            <motion.button
              onClick={handleSubmit}
              disabled={!destination.trim() || isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'flex items-center gap-2 px-6 py-4 rounded-xl font-medium transition-all duration-200 mr-1',
                destination.trim() && !isLoading
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Compass className="w-5 h-5" />
                  </motion.div>
                  <span className="hidden sm:inline">Researching</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span className="hidden sm:inline">Research</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
        
        {/* Decorative gradient */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl opacity-30 -z-10" />
      </div>
      
      {/* Quick Select */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-muted-foreground mb-4">Popular destinations</p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularDestinations.map((dest, index) => (
            <motion.button
              key={dest.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              onClick={() => handleQuickSelect(dest.name)}
              disabled={isLoading}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-card-border',
                'hover:shadow-md hover:border-primary/30 transition-all duration-200',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span>{dest.emoji}</span>
              <span className="text-sm font-medium">{dest.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
