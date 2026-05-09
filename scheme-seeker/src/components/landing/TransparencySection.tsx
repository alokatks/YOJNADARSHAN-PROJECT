import { motion, useInView } from 'framer-motion';
import { Shield, Eye, Lock, Trash2 } from 'lucide-react';
import { useRef } from 'react';

const features = [
  {
    icon: Shield,
    title: 'Your Consent First',
    description: 'We never process your data without explicit consent. You control what you share.',
  },
  {
    icon: Eye,
    title: 'Transparent Processing',
    description: 'Clear explanations of how your data is used to find eligible schemes.',
  },
  {
    icon: Lock,
    title: 'Secure & Encrypted',
    description: 'Industry-standard encryption protects your information at all times.',
  },
  {
    icon: Trash2,
    title: 'No Permanent Storage',
    description: 'Your personal data is not permanently stored. Session-based processing only.',
  },
];

const TransparencySection = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section className="py-20 bg-primary/5 india-pattern overflow-hidden">
      <div className="container mx-auto px-4" ref={containerRef}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
              Privacy First
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Transparency & <br />Data Privacy
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              At YojnaDarshan, we believe in complete transparency. Your personal data 
              is your property. We use it only to help you discover eligible schemes, 
              and never for any other purpose.
            </p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl bg-success/10 border border-success/20"
            >
              <p className="text-sm text-success font-medium">
                🔒 Compliant with Government Data Protection Guidelines
              </p>
            </motion.div>
          </motion.div>

          {/* Right Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1 + 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  y: -8,
                  boxShadow: '0 20px 40px -12px hsla(220, 30%, 15%, 0.15)',
                }}
                className="bg-card rounded-xl p-5 shadow-md border border-border/50 hover:border-primary/30 transition-colors cursor-default"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3"
                >
                  <feature.icon className="w-5 h-5 text-primary" />
                </motion.div>
                <h3 className="font-heading font-semibold text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransparencySection;
