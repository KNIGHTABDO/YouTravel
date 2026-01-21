'use client';

import { motion } from 'framer-motion';
import { Train, Plane, Bus, Car, MapPin, Info, Lightbulb } from 'lucide-react';
import { TransportationGuide } from '@/types';

interface TransportSectionProps {
  transportation: TransportationGuide;
}

export function TransportSection({ transportation }: TransportSectionProps) {
  // Return null if no transportation data
  if (!transportation) {
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
          <Train className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Getting Around</h2>
          <p className="text-muted-foreground">Transportation options and tips</p>
        </div>
      </div>
      
      {/* Getting There */}
      <div className="bg-white rounded-2xl shadow-lg border border-card-border p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Plane className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Getting There</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Main Airports</p>
            <ul className="space-y-2">
              {(transportation.gettingThere?.mainAirports || []).map((airport, index) => (
                <li key={index} className="flex items-center gap-2 text-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  {airport}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Alternatives</p>
            <ul className="space-y-2">
              {(transportation.gettingThere?.alternativeOptions || []).map((option, index) => (
                <li key={index} className="flex items-center gap-2 text-foreground">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  {option}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Getting Around */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <TransportCard
          icon={<Train className="w-5 h-5" />}
          title="Public Transport"
          description={transportation.gettingAround?.publicTransport || 'Check local options'}
          color="green"
        />
        <TransportCard
          icon={<Car className="w-5 h-5" />}
          title="Taxis & Rideshare"
          description={transportation.gettingAround?.taxis || 'Available in most areas'}
          color="yellow"
        />
        <TransportCard
          icon={<Car className="w-5 h-5" />}
          title="Car Rental"
          description={transportation.gettingAround?.rentals || 'Check local agencies'}
          color="blue"
        />
        <TransportCard
          icon={<MapPin className="w-5 h-5" />}
          title="Walking"
          description={transportation.gettingAround?.walking || 'Explore on foot'}
          color="purple"
        />
      </div>
      
      {/* Tips */}
      {transportation.gettingAround?.tips && transportation.gettingAround.tips.length > 0 && (
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            Transport Tips
          </h3>
          <ul className="grid md:grid-cols-2 gap-3">
            {transportation.gettingAround.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-foreground text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Intercity Travel */}
      <div className="bg-white rounded-2xl shadow-lg border border-card-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Bus className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Intercity Travel</h3>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {(transportation.intercity?.options || []).map((option, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-muted rounded-full text-sm font-medium text-foreground"
            >
              {option}
            </span>
          ))}
        </div>
        
        <p className="text-muted-foreground text-sm bg-muted/50 rounded-lg p-4">
          <strong className="text-foreground">Recommendation:</strong> {transportation.intercity?.recommendations || 'Check local transport options'}
        </p>
      </div>
    </motion.section>
  );
}

function TransportCard({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  color: 'green' | 'yellow' | 'blue' | 'purple';
}) {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow-md border border-card-border p-5"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <h4 className="font-semibold text-foreground">{title}</h4>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}
