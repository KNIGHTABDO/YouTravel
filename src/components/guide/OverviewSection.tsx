'use client';

import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Sun, 
  Globe, 
  CreditCard, 
  Languages,
  Calendar,
  Plane
} from 'lucide-react';
import { DestinationOverview as OverviewType } from '@/types';

interface OverviewSectionProps {
  overview: OverviewType;
  destination: string;
  imageUrl?: string;
}

export function OverviewSection({ overview, destination, imageUrl }: OverviewSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mb-16"
    >
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] rounded-3xl overflow-hidden mb-8">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: imageUrl 
              ? `url(${imageUrl})` 
              : `url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600)` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 text-white/80 mb-3">
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-medium">Destination Guide</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {destination}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl">
              {overview?.summary || `Welcome to ${destination}. Explore this amazing destination.`}
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Quick Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <InfoCard 
          icon={<Calendar className="w-5 h-5" />}
          label="Best Time"
          value={(overview?.bestTimeToVisit || 'Check local seasons').split('.')[0]}
        />
        <InfoCard 
          icon={<Sun className="w-5 h-5" />}
          label="Climate"
          value={(overview?.climate || 'Varies by region').split('.')[0]}
        />
        <InfoCard 
          icon={<CreditCard className="w-5 h-5" />}
          label="Currency"
          value={(overview?.currency || 'Local currency').split('.')[0]}
        />
        <InfoCard 
          icon={<Languages className="w-5 h-5" />}
          label="Language"
          value={(overview?.language || 'Local language').split('.')[0]}
        />
      </div>
      
      {/* Highlights */}
      <div className="bg-white rounded-2xl shadow-lg border border-card-border p-6 md:p-8">
        <h3 className="text-xl font-bold text-foreground mb-4">Highlights</h3>
        <div className="flex flex-wrap gap-2">
          {(overview?.highlights || []).map((highlight, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="px-4 py-2 bg-primary/5 text-primary rounded-full text-sm font-medium"
            >
              {highlight}
            </motion.span>
          ))}
        </div>
      </div>
      
      {/* Additional Info */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-2xl shadow-lg border border-card-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Time Zone</h3>
          </div>
          <p className="text-muted-foreground">{overview.timeZone}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-card-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Visa Info</h3>
          </div>
          <p className="text-muted-foreground">{overview.visaInfo}</p>
        </div>
      </div>
    </motion.section>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md border border-card-border p-4"
    >
      <div className="flex items-center gap-2 text-primary mb-2">
        {icon}
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <p className="font-semibold text-foreground text-sm line-clamp-2">{value}</p>
    </motion.div>
  );
}
