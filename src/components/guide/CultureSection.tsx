'use client';

import { motion } from 'framer-motion';
import { Users, MessageCircle, Shirt, Coins, Hand, X, Heart } from 'lucide-react';
import { CultureGuide } from '@/types';

interface CultureSectionProps {
  culture: CultureGuide;
}

export function CultureSection({ culture }: CultureSectionProps) {
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
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Culture & Etiquette</h2>
          <p className="text-muted-foreground">Local customs and how to respect them</p>
        </div>
      </div>
      
      {/* Summary */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 mb-6">
        <p className="text-lg text-foreground leading-relaxed">{culture.summary}</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Etiquette */}
        <div className="bg-white rounded-2xl shadow-lg border border-card-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Hand className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-bold text-foreground">Etiquette Tips</h3>
          </div>
          <ul className="space-y-3">
            {culture.etiquette.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-muted-foreground text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Taboos */}
        <div className="bg-white rounded-2xl shadow-lg border border-card-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-bold text-foreground">What to Avoid</h3>
          </div>
          <ul className="space-y-3">
            {culture.taboos.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span className="text-muted-foreground text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Quick Reference Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <QuickCard
          icon={<Shirt className="w-5 h-5" />}
          title="Dress Code"
          content={culture.dress}
          color="blue"
        />
        <QuickCard
          icon={<Coins className="w-5 h-5" />}
          title="Tipping"
          content={culture.tipping}
          color="green"
        />
        <QuickCard
          icon={<MessageCircle className="w-5 h-5" />}
          title="Greetings"
          content={culture.greetings}
          color="purple"
        />
      </div>
      
      {/* Local Customs */}
      {culture.localCustoms.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-card-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-bold text-foreground">Local Customs to Know</h3>
          </div>
          <ul className="grid md:grid-cols-2 gap-3">
            {culture.localCustoms.map((custom, index) => (
              <li key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                <span className="text-orange-500">•</span>
                <span className="text-sm text-foreground">{custom}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.section>
  );
}

function QuickCard({ 
  icon, 
  title, 
  content, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  content: string;
  color: 'blue' | 'green' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
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
      <p className="text-sm text-muted-foreground">{content}</p>
    </motion.div>
  );
}
