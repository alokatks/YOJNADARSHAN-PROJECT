import { motion, useInView } from 'framer-motion';
import { GraduationCap, Tractor, Users, Building2, Heart } from 'lucide-react';
import { useRef } from 'react';

const beneficiaries = [
  {
    icon: GraduationCap,
    title: 'Students',
    description: 'Scholarships, fee waivers, and educational support schemes',
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5',
  },
  {
    icon: Tractor,
    title: 'Farmers',
    description: 'Agricultural subsidies, crop insurance, and income support',
    gradient: 'from-green-500 to-green-600',
    bgGradient: 'bg-gradient-to-br from-green-500/10 to-green-600/5',
  },
  {
    icon: Users,
    title: 'Women',
    description: 'Empowerment programs, financial assistance, and skill development',
    gradient: 'from-pink-500 to-pink-600',
    bgGradient: 'bg-gradient-to-br from-pink-500/10 to-pink-600/5',
  },
  {
    icon: Building2,
    title: 'MSMEs',
    description: 'Business loans, startup support, and entrepreneur schemes',
    gradient: 'from-purple-500 to-purple-600',
    bgGradient: 'bg-gradient-to-br from-purple-500/10 to-purple-600/5',
  },
  {
    icon: Heart,
    title: 'Senior Citizens',
    description: 'Pension schemes, healthcare benefits, and social security',
    gradient: 'from-orange-500 to-orange-600',
    bgGradient: 'bg-gradient-to-br from-orange-500/10 to-orange-600/5',
  },
];

const WhoIsThisFor = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section className="py-20 bg-gradient-to-b from-secondary/30 to-background overflow-hidden">
      <div className="container mx-auto px-4" ref={containerRef}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            For Every Citizen
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Who Is This For?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            YojnaDarshan serves all segments of Indian society, helping every citizen 
            discover the welfare schemes designed for their needs.
          </p>
        </motion.div>

        {/* Beneficiaries Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {beneficiaries.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{ 
                y: -12,
                transition: { duration: 0.3 }
              }}
              className="group"
            >
              <div className={`relative rounded-2xl p-6 h-full border border-border/50 text-center transition-all duration-300 overflow-hidden ${item.bgGradient} hover:border-primary/30 hover:shadow-xl`}>
                {/* Animated background gradient */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5`} />
                </div>
                
                {/* Icon */}
                <motion.div 
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`relative w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <item.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                {/* Content */}
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed relative z-10">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoIsThisFor;
