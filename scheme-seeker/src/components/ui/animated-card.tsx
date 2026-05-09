import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  index?: number;
  hoverEffect?: 'lift' | 'glow' | 'border' | 'none';
  staggerDelay?: number;
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, index = 0, hoverEffect = 'lift', staggerDelay = 0.1, children, ...props }, ref) => {
    const hoverVariants = {
      lift: {
        y: -8,
        boxShadow: '0 20px 40px -12px hsla(220, 30%, 15%, 0.2)',
      },
      glow: {
        boxShadow: '0 0 30px 0 hsla(220, 70%, 50%, 0.2)',
      },
      border: {
        borderColor: 'hsl(220, 70%, 50%)',
      },
      none: {},
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ 
          duration: 0.5, 
          delay: index * staggerDelay,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        whileHover={hoverVariants[hoverEffect]}
        className={cn(
          'bg-card rounded-xl border border-border p-6 transition-colors duration-300',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

export { AnimatedCard };
