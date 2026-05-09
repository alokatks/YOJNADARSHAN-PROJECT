import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Lock, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

import hero1 from '@/assets/hero1.jpg';
import hero2 from '@/assets/hero2.jpg';
import hero3 from '@/assets/hero3.jpg';


const HeroSection = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slider with Parallax */}
<motion.div
  style={{ y }}
  className="absolute inset-0 scale-110 z-0" // z-0 add kiya taaki content ke niche rahe
  initial={{ scale: 1.1 }}
>
  <Swiper
    modules={[Autoplay, EffectFade]}
    effect="fade"
    fadeEffect={{ crossFade: true }}
    autoplay={{
      delay: 3000,
      disableOnInteraction: false,
    }}
    speed={1000}
    loop={true}
    style={{ height: '100%', width: '100%' }} // Inline style for safety
  >
    <SwiperSlide className="!h-full">
      <div
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${hero1})` }}
      />
    </SwiperSlide>

    <SwiperSlide className="!h-full">
      <div
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${hero2})` }}
      />
    </SwiperSlide>

    <SwiperSlide className="!h-full">
      <div
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${hero3})` }}
      />
    </SwiperSlide>
  </Swiper>
</motion.div>

      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 hero-overlay" />
      
      {/* Animated Pattern */}
      <div className="absolute inset-0 india-pattern opacity-30" />
      
      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 container mx-auto px-4 py-20"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 shadow-lg">
              {[
                { icon: Shield, label: 'Official' },
                { icon: Lock, label: 'Secure' },
                { icon: FileCheck, label: 'Consent-Based' },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-2"
                >
                  {idx > 0 && <div className="w-px h-4 bg-primary-foreground/30" />}
                  <div className="flex items-center gap-2 text-primary-foreground/90 text-sm">
                    <item.icon className="w-4 h-4 text-success" />
                    <span>{item.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Discover Government Schemes
            <br />
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-accent inline-block"
            >
              You're Eligible For
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto"
          >
            YojnaDarshan connects you with Central & State welfare schemes based on your profile. 
            Quick, secure, and citizen-friendly.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => navigate('/eligibility')}
                className="group w-full sm:w-auto"
              >
                Check Eligibility
                <motion.span
                  className="inline-block ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="heroOutline" 
                size="xl"
                className="w-full sm:w-auto"
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                How It Works
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {[
              { value: '500+', label: 'Welfare Schemes' },
              { value: '36', label: 'States & UTs' },
              { value: '10L+', label: 'Citizens Helped' },
              { value: '₹2000Cr+', label: 'Benefits Delivered' },
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: '0 20px 40px -12px hsla(0, 0%, 0%, 0.3)',
                }}
                className="glass-card p-4 text-center cursor-default"
              >
                <motion.div 
                  className="text-2xl md:text-3xl font-bold text-white mb-1"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.8 + index * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
        >
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3], y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-3 bg-white/70 rounded-full" 
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
