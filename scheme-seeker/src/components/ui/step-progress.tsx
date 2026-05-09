import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

const StepProgress = ({ steps, currentStep, className }: StepProgressProps) => {
  return (
    <div className={cn('w-full', className)}>
      {/* Step Labels */}
      <div className="flex justify-between mb-3">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              'flex-1 text-center transition-colors duration-300',
              currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <span className="text-xs font-medium hidden sm:block">{step.title}</span>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="relative flex items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            {/* Step Circle */}
            <motion.div
              initial={false}
              animate={{
                scale: currentStep === step.id ? 1.1 : 1,
                backgroundColor:
                  currentStep > step.id
                    ? 'hsl(var(--success))'
                    : currentStep === step.id
                    ? 'hsl(var(--primary))'
                    : 'hsl(var(--muted))',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={cn(
                'relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shadow-md',
                currentStep >= step.id ? 'text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              {currentStep > step.id ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Check className="w-5 h-5" />
                </motion.div>
              ) : (
                step.id
              )}
              
              {/* Pulse Animation for Active Step */}
              {currentStep === step.id && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/30"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{
                    width: currentStep > step.id ? '100%' : '0%',
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-success rounded-full"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step Description */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mt-4"
      >
        <h3 className="font-heading font-semibold text-foreground">
          {steps.find(s => s.id === currentStep)?.title}
        </h3>
        {steps.find(s => s.id === currentStep)?.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {steps.find(s => s.id === currentStep)?.description}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export { StepProgress };
