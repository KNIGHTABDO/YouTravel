'use client';

import { motion } from 'framer-motion';
import { DollarSign, TrendingDown, TrendingUp, Lightbulb, Wallet } from 'lucide-react';
import { BudgetEstimate } from '@/types';
import { cn } from '@/lib/utils';

interface BudgetSectionProps {
  budget: BudgetEstimate;
}

export function BudgetSection({ budget }: BudgetSectionProps) {
  // Return null if no budget data
  if (!budget) {
    return null;
  }
  
  // Provide safe defaults for nested properties
  const breakdown = budget.breakdown || {
    accommodation: { budget: 'N/A', midRange: 'N/A', luxury: 'N/A' },
    food: { budget: 'N/A', midRange: 'N/A', luxury: 'N/A' },
    transport: { budget: 'N/A', midRange: 'N/A', luxury: 'N/A' },
    activities: { budget: 'N/A', midRange: 'N/A', luxury: 'N/A' },
  };
  
  const weeklyTotal = budget.weeklyTotal || {
    budget: { min: 0, max: 0 },
    midRange: { min: 0, max: 0 },
    luxury: { min: 0, max: 0 },
  };
  
  const daily = budget.daily || {
    budget: { min: 0, max: 0 },
    midRange: { min: 0, max: 0 },
    luxury: { min: 0, max: 0 },
  };
  
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
          <Wallet className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Budget Guide</h2>
          <p className="text-muted-foreground">Realistic daily costs for every travel style</p>
        </div>
      </div>
      
      {/* Daily Budget Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <BudgetCard
          type="budget"
          label="Budget Traveler"
          icon={<TrendingDown className="w-5 h-5" />}
          range={daily.budget}
          currency={budget.currency || 'USD'}
          color="green"
          description="Hostels, street food, public transport"
        />
        <BudgetCard
          type="mid-range"
          label="Mid-Range"
          icon={<DollarSign className="w-5 h-5" />}
          range={daily.midRange}
          currency={budget.currency || 'USD'}
          color="blue"
          description="Hotels, restaurants, mix of activities"
          featured
        />
        <BudgetCard
          type="luxury"
          label="Luxury"
          icon={<TrendingUp className="w-5 h-5" />}
          range={daily.luxury}
          currency={budget.currency || 'USD'}
          color="purple"
          description="5-star hotels, fine dining, premium experiences"
        />
      </div>
      
      {/* Cost Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg border border-card-border overflow-hidden mb-8">
        <div className="p-6 border-b border-card-border">
          <h3 className="text-lg font-bold text-foreground">Cost Breakdown by Category</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-foreground">Category</th>
                <th className="text-left p-4 text-sm font-semibold text-green-600">Budget</th>
                <th className="text-left p-4 text-sm font-semibold text-blue-600">Mid-Range</th>
                <th className="text-left p-4 text-sm font-semibold text-purple-600">Luxury</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              <tr>
                <td className="p-4 font-medium text-foreground">🏨 Accommodation</td>
                <td className="p-4 text-sm text-muted-foreground">{breakdown.accommodation?.budget || 'N/A'}</td>
                <td className="p-4 text-sm text-muted-foreground">{breakdown.accommodation?.midRange || 'N/A'}</td>
                <td className="p-4 text-sm text-muted-foreground">{breakdown.accommodation?.luxury || 'N/A'}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">🍽️ Food</td>
                <td className="p-4 text-sm text-muted-foreground">{breakdown.food?.budget || 'N/A'}</td>
                <td className="p-4 text-sm text-muted-foreground">{breakdown.food?.midRange || 'N/A'}</td>
                <td className="p-4 text-sm text-muted-foreground">{breakdown.food?.luxury || 'N/A'}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">🚌 Transport</td>
                <td className="p-4 text-sm text-muted-foreground">{breakdown.transport?.budget || 'N/A'}</td>
                <td className="p-4 text-sm text-muted-foreground">{breakdown.transport?.midRange || 'N/A'}</td>
                <td className="p-4 text-sm text-muted-foreground">{breakdown.transport?.luxury || 'N/A'}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground">🎭 Activities</td>
                <td className="p-4 text-sm text-muted-foreground">{breakdown.activities?.budget || 'N/A'}</td>
                <td className="p-4 text-sm text-muted-foreground">{breakdown.activities?.midRange || 'N/A'}</td>
                <td className="p-4 text-sm text-muted-foreground">{breakdown.activities?.luxury || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Weekly Totals */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-bold text-foreground mb-4">Estimated Weekly Total</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-xl">
            <p className="text-sm text-green-600 font-medium mb-1">Budget</p>
            <p className="text-2xl font-bold text-foreground">
              ${weeklyTotal.budget?.min || 0} - ${weeklyTotal.budget?.max || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-white rounded-xl border-2 border-primary">
            <p className="text-sm text-blue-600 font-medium mb-1">Mid-Range</p>
            <p className="text-2xl font-bold text-foreground">
              ${weeklyTotal.midRange?.min || 0} - ${weeklyTotal.midRange?.max || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-white rounded-xl">
            <p className="text-sm text-purple-600 font-medium mb-1">Luxury</p>
            <p className="text-2xl font-bold text-foreground">
              ${weeklyTotal.luxury?.min || 0} - ${weeklyTotal.luxury?.max || 0}
            </p>
          </div>
        </div>
      </div>
      
      {/* Money-Saving Tips */}
      {budget.tips && budget.tips.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-card-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            Money-Saving Tips
          </h3>
          <ul className="space-y-3">
            {budget.tips.map((tip, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent text-sm font-bold">{index + 1}</span>
                </span>
                <span className="text-foreground">{tip}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.section>
  );
}

function BudgetCard({ 
  type, 
  label, 
  icon, 
  range, 
  currency, 
  color, 
  description,
  featured 
}: { 
  type: string;
  label: string;
  icon: React.ReactNode;
  range: { min: number; max: number };
  currency: string;
  color: 'green' | 'blue' | 'purple';
  description: string;
  featured?: boolean;
}) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        'bg-white rounded-2xl shadow-lg border overflow-hidden transition-all duration-300 hover:shadow-xl',
        featured ? 'border-primary ring-2 ring-primary/20' : 'border-card-border'
      )}
    >
      <div className={cn(
        'px-6 py-4 border-b flex items-center justify-between',
        colorClasses[color]
      )}>
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold">{label}</span>
        </div>
        {featured && (
          <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">Most Common</span>
        )}
      </div>
      
      <div className="p-6">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground mb-1">Daily budget</p>
          <p className="text-3xl font-bold text-foreground">
            ${range.min} - ${range.max}
          </p>
          <p className="text-xs text-muted-foreground uppercase">{currency}/day</p>
        </div>
        <p className="text-sm text-muted-foreground text-center">{description}</p>
      </div>
    </motion.div>
  );
}
