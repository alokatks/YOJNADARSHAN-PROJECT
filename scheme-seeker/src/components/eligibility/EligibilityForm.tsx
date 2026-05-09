import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { EligibilityResult } from '@/types/scheme';
import { states, occupations, educationLevels, socialCategories } from '@/data/schemes';

interface FormData {
  age: string;
  gender: string;
  annualIncome: string;
  occupation: string;
  category: string;
  state: string;
  education: string;
  hasDisability: boolean;
  consent: boolean;
}

const initialFormData: FormData = {
  age: '',
  gender: '',
  annualIncome: '',
  occupation: '',
  category: '',
  state: '',
  education: '',
  hasDisability: false,
  consent: false,
};

const steps = [
  { id: 1, title: 'Personal Details', description: 'Tell us about yourself' },
  { id: 2, title: 'Financial Info', description: 'Your income and work details' },
  { id: 3, title: 'Category & Location', description: 'Category and state information' },
  { id: 4, title: 'Additional Info', description: 'Final details and consent' },
];

interface EligibilityFormProps {
  onResults: (results: EligibilityResult) => void;
}

const EligibilityForm = ({ onResults }: EligibilityFormProps) => {

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep = (step: number): boolean => {

    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 1) {
      if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 120)
        newErrors.age = 'Enter valid age';
      if (!formData.gender)
        newErrors.gender = 'Select gender';
    }

    if (step === 2) {
      if (!formData.annualIncome)
        newErrors.annualIncome = 'Enter income';
      if (!formData.occupation)
        newErrors.occupation = 'Select occupation';
    }

    if (step === 3) {
      if (!formData.category)
        newErrors.category = 'Select category';
      if (!formData.state)
        newErrors.state = 'Select state';
    }

    if (step === 4) {
      if (!formData.education)
        newErrors.education = 'Select education';
      if (!formData.consent)
        newErrors.consent = 'Consent required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep))
      setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };


  // ✅ FINAL FIX HERE
  const handleSubmit = async () => {

    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    const payload = {
      age: parseInt(formData.age),
      gender: formData.gender,
      annualIncome: parseInt(formData.annualIncome),
      occupation: formData.occupation,
      category: formData.category,
      state: formData.state,
      hasDisability: formData.hasDisability
    };

    try {

      const response = await fetch(
        'http://localhost:8000/api/check-eligibility',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      console.log("Backend response:", data);


      // ✅ TRANSFORM BACKEND RESPONSE → FRONTEND FORMAT

      const transformed: EligibilityResult = {

        eligible: data.total_count > 0,

        totalMatched: data.total_count || 0,

        schemes: data.eligible_schemes || [],

        profileSummary: {
          age: payload.age,
          gender: payload.gender as any,
          annualIncome: payload.annualIncome,
          occupation: payload.occupation,
          category: payload.category,
          state: payload.state,
          education: formData.education,
          hasDisability: payload.hasDisability,
          consent: formData.consent
        }
      };

      console.log("Transformed:", transformed);

      onResults(transformed);

    }
    catch (err) {

      console.error(err);
      alert("Eligibility check failed");

    }
    finally {

      setIsSubmitting(false);

    }

  };


  const updateField = (field: keyof FormData, value: string | boolean) => {

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

  };


  return (
    <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 px-6 py-6 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div>
            <motion.h2 
              key={currentStep}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-heading text-xl font-semibold text-foreground"
            >
              {steps[currentStep - 1].title}
            </motion.h2>
            <motion.p
              key={`desc-${currentStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-muted-foreground mt-1"
            >
              {steps[currentStep - 1].description}
            </motion.p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm">
            <span className="text-2xl font-bold text-primary">{currentStep}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{steps.length}</span>
          </div>
        </div>

        {/* Step Indicators with Animation */}
        <div className="flex items-center gap-2 mt-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
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
                className={`form-step-indicator relative ${
                  currentStep >= step.id ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                {currentStep > step.id ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : (
                  step.id
                )}
                {/* Pulse for active step */}
                {currentStep === step.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1.5 mx-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: currentStep > step.id ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full bg-success rounded-full"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="age" className="text-foreground font-medium">
                    Your Age <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => updateField('age', e.target.value)}
                    className="mt-2"
                    min="1"
                    max="120"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Many schemes have age-based eligibility criteria
                  </p>
                  {errors.age && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" /> {errors.age}
                    </motion.p>
                  )}
                </div>

                <div>
                  <Label className="text-foreground font-medium">
                    Gender <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.gender} onValueChange={(v) => updateField('gender', v)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Some schemes are gender-specific (e.g., women empowerment schemes)
                  </p>
                  {errors.gender && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" /> {errors.gender}
                    </motion.p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Financial Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="income" className="text-foreground font-medium">
                    Annual Household Income (₹) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="e.g., 250000"
                    value={formData.annualIncome}
                    onChange={(e) => updateField('annualIncome', e.target.value)}
                    className="mt-2"
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Enter total annual income of your household from all sources
                  </p>
                  {errors.annualIncome && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" /> {errors.annualIncome}
                    </motion.p>
                  )}
                </div>

                <div>
                  <Label className="text-foreground font-medium">
                    Occupation <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.occupation} onValueChange={(v) => updateField('occupation', v)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select your occupation" />
                    </SelectTrigger>
                    <SelectContent>
                      {occupations.map((occ) => (
                        <SelectItem key={occ} value={occ}>
                          {occ}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Your occupation determines eligibility for sector-specific schemes
                  </p>
                  {errors.occupation && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" /> {errors.occupation}
                    </motion.p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Category & Location */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-foreground font-medium">
                    Social Category <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(v) => updateField('category', v)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select your category" />
                    </SelectTrigger>
                    <SelectContent>
                      {socialCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Select your social category as per government records
                  </p>
                  {errors.category && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" /> {errors.category}
                    </motion.p>
                  )}
                </div>

                <div>
                  <Label className="text-foreground font-medium">
                    State / UT <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.state} onValueChange={(v) => updateField('state', v)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    State-specific schemes require your domicile state
                  </p>
                  {errors.state && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" /> {errors.state}
                    </motion.p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Additional Info */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-foreground font-medium">
                    Education Level <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.education} onValueChange={(v) => updateField('education', v)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((edu) => (
                        <SelectItem key={edu} value={edu}>
                          {edu}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Scholarship schemes often have education-level requirements
                  </p>
                  {errors.education && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" /> {errors.education}
                    </motion.p>
                  )}
                </div>

                <motion.div 
                  initial={{ opacity: 0.8 }}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
                >
                  <Checkbox
                    id="disability"
                    checked={formData.hasDisability}
                    onCheckedChange={(checked) => updateField('hasDisability', !!checked)}
                  />
                  <div>
                    <Label htmlFor="disability" className="text-sm text-foreground cursor-pointer font-medium">
                      I have a disability
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Check this for disability-specific schemes
                    </p>
                  </div>
                </motion.div>

                <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="consent"
                      checked={formData.consent}
                      onCheckedChange={(checked) => updateField('consent', !!checked)}
                    />
                    <div>
                      <Label htmlFor="consent" className="text-sm font-medium text-foreground cursor-pointer">
                        I consent to the processing of my data <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your data will only be used to check scheme eligibility and will not be stored permanently.
                        By proceeding, you agree to our privacy policy.
                      </p>
                    </div>
                  </div>
                  {errors.consent && (
                    <p className="mt-2 text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.consent}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="px-6 py-4 bg-muted/30 border-t border-border flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>

        {currentStep < steps.length ? (
          <Button onClick={handleNext} className="gap-2">
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-success-foreground/30 border-t-success-foreground rounded-full animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" /> Check Eligibility
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EligibilityForm;
