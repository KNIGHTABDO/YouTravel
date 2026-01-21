'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DestinationInput } from '@/components/DestinationInput';
import { ResearchProgress } from '@/components/ResearchProgress';
import { TravelGuideDisplay } from '@/components/guide/TravelGuideDisplay';
import { TravelGuide, ResearchStep, ResearchState } from '@/types';
import { researchSteps } from '@/lib/tools';
import { Sparkles, Globe, Compass, MapPin } from 'lucide-react';

export default function Home() {
  const [state, setState] = useState<ResearchState>({
    status: 'idle' as ResearchState['status'],
    currentStep: null,
    steps: researchSteps.map(s => ({ ...s, status: 'pending' as const, toolCalls: [] })),
    progress: 0,
    guide: undefined,
  });
  
  const [destination, setDestination] = useState('');
  
  // Compute isLoading outside of conditional blocks to avoid TypeScript narrowing issues
  const isLoading = state.status === 'researching';

  const handleResearch = useCallback(async (dest: string) => {
    setDestination(dest);
    
    // Reset state and start researching
    setState({
      status: 'researching',
      currentStep: { ...researchSteps[0], status: 'active', toolCalls: [] },
      steps: researchSteps.map(s => ({ ...s, status: 'pending' as const, toolCalls: [] })),
      progress: 0,
    });
    
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: dest }),
      });
      
      if (!response.ok) {
        throw new Error('Research failed');
      }
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');
      
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (!line.trim()) continue;
          
          try {
            const message = JSON.parse(line);
            
            switch (message.type) {
              case 'step':
                setState(prev => {
                  const newSteps = [...prev.steps];
                  const stepIndex = message.data.stepIndex;
                  
                  // Update step status
                  if (stepIndex !== undefined && newSteps[stepIndex]) {
                    newSteps[stepIndex] = {
                      ...newSteps[stepIndex],
                      status: message.data.step.status,
                    };
                  }
                  
                  return {
                    ...prev,
                    steps: newSteps,
                    currentStep: message.data.step.status === 'active' ? message.data.step : prev.currentStep,
                  };
                });
                break;
                
              case 'progress':
                setState(prev => ({
                  ...prev,
                  progress: message.data.progress,
                }));
                break;
                
              case 'tool_call':
                // Could update UI with tool call info
                break;
                
              case 'complete':
                setState(prev => ({
                  ...prev,
                  status: 'complete',
                  progress: 100,
                  guide: message.data.guide,
                  currentStep: null,
                }));
                break;
                
              case 'error':
                setState(prev => ({
                  ...prev,
                  status: 'error',
                  error: message.data.error,
                }));
                break;
            }
          } catch (e) {
            console.error('Failed to parse message:', line, e);
          }
        }
      }
    } catch (error) {
      console.error('Research error:', error);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Research failed',
      }));
    }
  }, []);

  const handleReset = useCallback(() => {
    setState({
      status: 'idle',
      currentStep: null,
      steps: researchSteps.map(s => ({ ...s, status: 'pending' as const, toolCalls: [] })),
      progress: 0,
      guide: undefined,
    });
    setDestination('');
  }, []);

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {state.status === 'idle' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col"
          >
            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
              {/* Background Elements */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.15, 0.1],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
                />
              </div>

              {/* Logo & Brand */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 justify-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <Compass className="w-8 h-8 text-white" />
                  </motion.div>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                    You<span className="text-primary">Travel</span>
                  </h1>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center mb-12 max-w-3xl"
              >
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                  Your AI Travel Research
                  <br />
                  <span className="gradient-text">Agent</span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Enter any destination. Our AI conducts deep research and creates a premium travel guide—automatically.
                </p>
              </motion.div>

              {/* Main Input */}
              <DestinationInput 
                onSubmit={handleResearch} 
                isLoading={isLoading} 
              />

              {/* Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-20 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              >
                <FeatureCard
                  icon={<Sparkles className="w-6 h-6" />}
                  title="Autonomous Research"
                  description="AI plans and executes multi-step research without any input from you"
                />
                <FeatureCard
                  icon={<Globe className="w-6 h-6" />}
                  title="Deep Analysis"
                  description="Cross-references multiple sources to verify and synthesize insights"
                />
                <FeatureCard
                  icon={<MapPin className="w-6 h-6" />}
                  title="Premium Guides"
                  description="Receive editorial-quality travel guides with actionable recommendations"
                />
              </motion.div>
            </main>

            {/* Footer */}
            <footer className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Powered by AI • No booking, no ads, just intelligence
              </p>
            </footer>
          </motion.div>
        )}

        {state.status === 'researching' && (
          <motion.div
            key="researching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-4 py-16"
          >
            <ResearchProgress
              steps={state.steps}
              currentStep={state.currentStep}
              progress={state.progress}
              destination={destination}
            />
          </motion.div>
        )}

        {state.status === 'complete' && state.guide && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TravelGuideDisplay guide={state.guide} onReset={handleReset} />
          </motion.div>
        )}

        {state.status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-4"
          >
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">😞</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Research Failed</h2>
              <p className="text-muted-foreground mb-6">{state.error || 'Something went wrong. Please try again.'}</p>
              <button
                onClick={handleReset}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg border border-card-border p-6 text-center"
    >
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}
