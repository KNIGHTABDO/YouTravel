'use client';

import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { CommonMistake } from '@/types';

interface MistakesSectionProps {
  mistakes: CommonMistake[];
}

export function MistakesSection({ mistakes }: MistakesSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-16"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Common Mistakes to Avoid</h2>
          <p className="text-muted-foreground">Learn from other travelers' experiences</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {mistakes.map((mistake, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-card-border overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* Mistake */}
              <div className="md:w-1/3 p-6 bg-red-50 border-b md:border-b-0 md:border-r border-red-100">
                <div className="flex items-center gap-2 text-red-600 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">The Mistake</span>
                </div>
                <p className="font-semibold text-red-700">{mistake.mistake}</p>
              </div>
              
              {/* Why */}
              <div className="md:w-1/3 p-6 bg-orange-50 border-b md:border-b-0 md:border-r border-orange-100">
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Why It's a Problem</span>
                </div>
                <p className="text-orange-700">{mistake.why}</p>
              </div>
              
              {/* Instead */}
              <div className="md:w-1/3 p-6 bg-green-50">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <ArrowRight className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Do This Instead</span>
                </div>
                <p className="text-green-700">{mistake.instead}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
