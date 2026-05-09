import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, FileText, ExternalLink, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SchemeCard } from '@/components/schemes/SchemeCard';
import { EligibilityResult, Scheme } from '@/types/scheme';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

interface ResultsDisplayProps {
  results: EligibilityResult;
  onReset: () => void;
}

const ResultsDisplay = ({ results, onReset }: ResultsDisplayProps) => {

  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  /**
   * ✅ UNIVERSAL SAFE PARSER
   * Handles:
   * string
   * array
   * JSON string
   * null
   * undefined
   */
  const safeArray = (value: any): string[] => {

    if (!value) return [];

    if (Array.isArray(value)) return value;

    if (typeof value === "string") {

      try {

        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) return parsed;

        return [value];

      } catch {

        return [value];

      }

    }

    return [];

  };

  return (

    <div className="space-y-8">

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl border-2 ${
          results.eligible
            ? 'bg-success/5 border-success/30'
            : 'bg-destructive/5 border-destructive/30'
        }`}
      >

        <div className="flex items-start gap-4">

          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              results.eligible ? 'bg-success/20' : 'bg-destructive/20'
            }`}
          >

            {results.eligible
              ? <CheckCircle2 className="w-6 h-6 text-success" />
              : <XCircle className="w-6 h-6 text-destructive" />
            }

          </div>

          <div className="flex-1">

            <h2 className="font-heading text-xl font-bold text-foreground mb-1">

              {results.eligible
                ? `Great News! You're Eligible for ${results.totalMatched} Scheme${results.totalMatched > 1 ? 's' : ''}`
                : 'No Matching Schemes Found'}

            </h2>

            <p className="text-muted-foreground text-sm">

              {results.eligible
                ? 'Based on your profile, we found schemes you can apply for.'
                : 'Try modifying your details or check back later.'}

            </p>

          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Check Again
          </Button>

        </div>

        {/* Profile Summary */}
        <div className="mt-6 pt-6 border-t border-border/50">

          <h3 className="text-sm font-medium text-foreground mb-3">
            Your Profile Summary
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            {[
              { label: 'Age', value: `${results.profileSummary.age} years` },
              { label: 'Gender', value: results.profileSummary.gender },
              { label: 'Income', value: `₹${(results.profileSummary.annualIncome / 100000).toFixed(1)}L` },
              { label: 'Category', value: results.profileSummary.category },
              { label: 'State', value: results.profileSummary.state },
              { label: 'Occupation', value: results.profileSummary.occupation },
            ].map((item, idx) => (

              <div key={idx} className="bg-background/50 rounded-lg p-3">

                <p className="text-xs text-muted-foreground">
                  {item.label}
                </p>

                <p className="text-sm font-medium text-foreground truncate">
                  {item.value}
                </p>

              </div>

            ))}

          </div>

        </div>

      </motion.div>


      {/* Schemes Grid */}
      {results.eligible && (

        <div>

          <h3 className="font-heading text-lg font-semibold mb-6">
            Eligible Schemes
          </h3>

          <div className="grid md:grid-cols-2 gap-6">

            {results.schemes.map((scheme, index) => (

              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >

                <SchemeCard
                  scheme={scheme}
                  onViewDetails={(s) => setSelectedScheme(s)}
                />

              </motion.div>

            ))}

          </div>

        </div>

      )}


      {/* Detail Dialog */}
      <Dialog
        open={!!selectedScheme}
        onOpenChange={() => setSelectedScheme(null)}
      >

        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">

          {selectedScheme && (

            <>

              <DialogHeader>

                <DialogTitle className="font-heading text-xl">
                  {selectedScheme.name}
                </DialogTitle>

              </DialogHeader>


              <div className="space-y-6 mt-4">

                <p className="text-muted-foreground">
                  {selectedScheme.description}
                </p>


                {/* Benefits */}
                <div>

                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    Benefits
                  </h4>

                  <ul className="space-y-2">

                    {safeArray(selectedScheme.benefits).map((benefit, idx) => (

                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >

                        <ArrowRight className="w-3 h-3 mt-1 text-primary" />

                        {benefit}

                      </li>

                    ))}

                  </ul>

                </div>


                {/* Documents */}
                <div>

                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Required Documents
                  </h4>

                  <div className="flex flex-wrap gap-2">

                    {safeArray(
                      selectedScheme.requiredDocuments ||
                      selectedScheme.documents_required
                    ).map((doc, idx) => (

                      <span key={idx} className="document-badge">
                        {doc}
                      </span>

                    ))}

                  </div>

                </div>


                {/* Apply Button */}
                <Button
                  variant="government"
                  className="w-full gap-2"
                  asChild
                >

                  <a
                    href={
                      selectedScheme.officialLink ||
                      selectedScheme.official_link
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >

                    Apply on Official Portal

                    <ExternalLink className="w-4 h-4" />

                  </a>

                </Button>

              </div>

            </>

          )}

        </DialogContent>

      </Dialog>

    </div>

  );

};

export default ResultsDisplay;