'use client';

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Lightbulb, Phone, Heart, CheckCircle } from 'lucide-react';
import { SafetyInfo } from '@/types';
import { cn } from '@/lib/utils';

interface SafetySectionProps {
  safety: SafetyInfo;
}

const ratingConfig = {
  'very-safe': { color: 'bg-green-100 text-green-700 border-green-200', label: 'Very Safe', icon: '✓' },
  'safe': { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Safe', icon: '✓' },
  'moderate': { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Moderate', icon: '!' },
  'caution': { color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Caution Advised', icon: '⚠' },
  'avoid': { color: 'bg-red-100 text-red-700 border-red-200', label: 'Not Recommended', icon: '✗' },
};

export function SafetySection({ safety }: SafetySectionProps) {
  // Return null if no safety data
  if (!safety) {
    return null;
  }
  
  const rating = ratingConfig[safety.overallRating] || ratingConfig['moderate'];
  
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
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Safety Information</h2>
          <p className="text-muted-foreground">Stay safe and informed during your trip</p>
        </div>
      </div>
      
      {/* Safety Rating */}
      <div className={cn(
        'rounded-2xl border-2 p-6 mb-6',
        rating.color
      )}>
        <div className="flex items-center gap-4">
          <div className="text-4xl">{rating.icon === '✓' ? '✅' : rating.icon === '!' ? '⚠️' : rating.icon === '⚠' ? '🟠' : '🔴'}</div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wide opacity-80">Safety Rating</p>
            <p className="text-2xl font-bold">{rating.label}</p>
          </div>
        </div>
        <p className="mt-4 opacity-90">{safety.summary}</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Concerns */}
        {safety.concerns && safety.concerns.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-card-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-bold text-foreground">Things to Know</h3>
            </div>
            <ul className="space-y-3">
              {safety.concerns.map((concern, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span className="text-muted-foreground text-sm">{concern}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Safety Tips */}
        {safety.tips && safety.tips.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-card-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-bold text-foreground">Safety Tips</h3>
            </div>
            <ul className="space-y-3">
              {safety.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Emergency Numbers */}
      {safety.emergencyNumbers && (
      <div className="bg-white rounded-2xl shadow-lg border border-card-border p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Phone className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="font-bold text-foreground">Emergency Numbers</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted rounded-xl">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Police</p>
            <p className="text-xl font-bold text-foreground">{safety.emergencyNumbers?.police || 'Check locally'}</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-xl">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Ambulance</p>
            <p className="text-xl font-bold text-foreground">{safety.emergencyNumbers?.ambulance || 'Check locally'}</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-xl">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Tourist Help</p>
            <p className="text-lg font-bold text-foreground">{safety.emergencyNumbers?.tourist || 'Contact embassy'}</p>
          </div>
        </div>
      </div>
      )}
      
      {/* Health Advice */}
      {safety.healthAdvice && safety.healthAdvice.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-foreground">Health Advice</h3>
          </div>
          <ul className="grid md:grid-cols-2 gap-3">
            {safety.healthAdvice.map((advice, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span className="text-sm text-foreground">{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.section>
  );
}
