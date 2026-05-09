import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EligibilityForm from '@/components/eligibility/EligibilityForm';
import ResultsDisplay from '@/components/eligibility/ResultsDisplay';
import { EligibilityResult } from '@/types/scheme';
import { Shield, Clock, FileCheck } from 'lucide-react';

const EligibilityPage = () => {
  const [results, setResults] = useState<EligibilityResult | null>(null);

  const handleResults = (newResults: EligibilityResult) => {
    setResults(newResults);
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Eligibility Checker
            </span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Check Your Scheme Eligibility
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Answer a few simple questions to discover which government welfare schemes 
              you're eligible for. Your data is secure and private.
            </p>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {[
              { icon: Shield, text: 'Secure & Private' },
              { icon: Clock, text: '2 Min Process' },
              { icon: FileCheck, text: 'Consent-Based' },
            ].map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm"
              >
                <badge.icon className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-foreground">{badge.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Form Section */}
          {!results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <EligibilityForm onResults={handleResults} />
            </motion.div>
          )}

          {/* Results Section */}
          {results && (
            <motion.div
              id="results-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <ResultsDisplay results={results} onReset={handleReset} />
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EligibilityPage;
