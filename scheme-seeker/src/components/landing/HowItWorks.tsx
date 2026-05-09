import { motion } from 'framer-motion';
import { UserCheck, Search, FileText, CheckCircle } from 'lucide-react';
import { useRef } from 'react';

const steps = [
  {
    icon: UserCheck,
    title: 'Enter Your Details',
    description: 'Fill in basic information like age, income, occupation, and location. Your data is secure.',
  },
  {
    icon: Search,
    title: 'Smart Matching',
    description: 'Our eligibility engine analyzes your profile against 500+ Central and State schemes.',
  },
  {
    icon: FileText,
    title: 'Get Personalized Results',
    description: 'Receive a list of schemes you qualify for, with required documents and application links.',
  },
  {
    icon: CheckCircle,
    title: 'Apply with Confidence',
    description: 'Access official portals directly and apply for benefits you deserve.',
  },
];

const HowItWorks = () => {
  const containerRef = useRef(null);

  return (
    <section id="how-it-works" className="py-24 bg-[#80c5eba7] relative overflow-hidden">
      {/* Background Animated Blobs for Glass Effect */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 india-pattern pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10" ref={containerRef}>
        {/* Section Header with Scroll Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 text-primary-foreground text-sm font-medium mb-4 backdrop-blur-md border border-white/10">
            Simple Process
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6">
            How YojnaDarshan Works
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Discover your eligible government schemes in just 4 simple steps. 
            No agents, no middlemen, just direct citizen empowerment.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              // Scroll Animation Props
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2, // Stagger effect
                ease: "easeOut" 
              }}
              // 3D Hover Effect
              whileHover={{ 
                scale: 1.05, 
                rotateX: 5, 
                perspective: 1000 
              }}
              className="relative group cursor-pointer"
            >
              {/* Animated Connector Line (Desktop Only) */}
              {index < steps.length - 1 && (
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.4 }}
                  className="hidden lg:block absolute top-16 left-[75%] w-[60%] h-[1px] bg-gradient-to-r from-white/20 to-transparent origin-left z-0" 
                />
              )}
              
              {/* Premium Glass Card */}
              <div className="relative backdrop-blur-md bg-white/[0.02] border border-white/[0.08] rounded-2xl p-8 h-full transition-all duration-500 group-hover:bg-white/[0.07] group-hover:border-white/20 shadow-2xl overflow-hidden flex flex-col items-start">
                
                {/* Glow on Hover inside card */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon and Step Number */}
                <div className="flex items-center justify-between w-full mb-8 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/80 to-blue-600/80 flex items-center justify-center shadow-lg group-hover:shadow-primary/20 transition-all border border-white/10">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-5xl font-black text-white/[0.03] group-hover:text-white/[0.08] transition-colors duration-500">
                    0{index + 1}
                  </span>
                </div>
                
                {/* Text Content */}
                <h3 className="font-heading text-xl font-bold text-white mb-3 relative z-10 group-hover:text-primary-foreground transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed relative z-10 group-hover:text-slate-200 transition-colors">
                  {step.description}
                </p>

                {/* Animated Bottom Border */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary to-orange-500 group-hover:w-full transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;