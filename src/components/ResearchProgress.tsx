'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Train, 
  Shield, 
  Users, 
  Lightbulb,
  Image,
  FileText,
  Compass,
  Building,
  Sparkles,
  Check
} from 'lucide-react';
import { ResearchStep } from '@/types';
import { cn } from '@/lib/utils';

interface ResearchProgressProps {
  steps: ResearchStep[];
  currentStep: ResearchStep | null;
  progress: number;
  destination: string;
}

const stepIcons: Record<string, React.ReactNode> = {
  'init': <Compass className="w-5 h-5" />,
  'overview': <Search className="w-5 h-5" />,
  'cities': <Building className="w-5 h-5" />,
  'places': <MapPin className="w-5 h-5" />,
  'neighborhoods': <Building className="w-5 h-5" />,
  'costs': <DollarSign className="w-5 h-5" />,
  'transport': <Train className="w-5 h-5" />,
  'safety': <Shield className="w-5 h-5" />,
  'culture': <Users className="w-5 h-5" />,
  'tips': <Lightbulb className="w-5 h-5" />,
  'images': <Image className="w-5 h-5" />,
  'synthesize': <FileText className="w-5 h-5" />,
};

export function ResearchProgress({ steps, currentStep, progress, destination }: ResearchProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-3xl mx-auto py-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6"
        >
          <Sparkles className="w-10 h-10 text-primary" />
        </motion.div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Researching {destination}
        </h2>
        <p className="text-muted-foreground">
          Our AI is conducting deep research to create your personalized travel guide
        </p>
      </motion.div>
      
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
      
      {/* Current Step Highlight */}
      <AnimatePresence mode="wait">
        {currentStep && (
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-card-border p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <motion.div
                    animate={{ 
                      boxShadow: ['0 0 0 0 rgba(14, 165, 233, 0.4)', '0 0 0 20px rgba(14, 165, 233, 0)']
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeOut'
                    }}
                    className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary"
                  >
                    {stepIcons[currentStep.id] || <Search className="w-5 h-5" />}
                  </motion.div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">{currentStep.name}</h3>
                  <p className="text-muted-foreground text-sm">{currentStep.description}</p>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Steps Timeline */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300',
              step.status === 'active' && 'bg-primary/5',
              step.status === 'complete' && 'opacity-60'
            )}
          >
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300',
              step.status === 'pending' && 'bg-muted text-muted-foreground',
              step.status === 'active' && 'bg-primary text-white',
              step.status === 'complete' && 'bg-green-100 text-green-600'
            )}>
              {step.status === 'complete' ? (
                <Check className="w-5 h-5" />
              ) : (
                stepIcons[step.id] || <Search className="w-4 h-4" />
              )}
            </div>
            
            <div className="flex-1">
              <p className={cn(
                'font-medium transition-colors duration-300',
                step.status === 'active' && 'text-primary',
                step.status === 'complete' && 'text-muted-foreground',
                step.status === 'pending' && 'text-muted-foreground'
              )}>
                {step.name}
              </p>
            </div>
            
            {step.status === 'active' && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xs text-primary font-medium"
              >
                In progress...
              </motion.div>
            )}
            
            {step.status === 'complete' && (
              <span className="text-xs text-green-600 font-medium">Done</span>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Ambient Animation */}
      <motion.div
        className="fixed inset-0 pointer-events-none -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
        />
      </motion.div>
    </motion.div>
  );
}
