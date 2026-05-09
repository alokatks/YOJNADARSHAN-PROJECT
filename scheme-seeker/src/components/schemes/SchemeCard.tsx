
import { motion } from 'framer-motion';
import { Search, Filter, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Scheme } from '@/types/scheme';
import { categories } from '@/data/schemes';

interface SchemeCardProps {
  scheme: Scheme;
  onViewDetails: (scheme: Scheme) => void;
}

export const SchemeCard = ({ scheme, onViewDetails }: SchemeCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -8,
        boxShadow: '0 20px 40px -12px hsla(220, 30%, 15%, 0.2)',
      }}
      transition={{ duration: 0.3 }}
      className="scheme-card cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={
                scheme.type === 'Central'
                  ? 'category-tag-central'
                  : 'category-tag-state'
              }
            >
              {scheme.type}
            </span>
            <span className="text-xs text-muted-foreground">
              {scheme.category}
            </span>
          </div>

          <h3 className="font-heading text-lg font-semibold text-foreground line-clamp-2">
            {scheme.name}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {scheme.description}
      </p>

      {/* Benefits */}
      <div className="mb-4">
        <p className="text-xs font-medium text-foreground mb-2">
          Key Benefits:
        </p>

        <ul className="text-xs text-muted-foreground space-y-1">
          {[scheme.benefits]
            .slice(0, 2)
            .map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span>
                <span className="line-clamp-1">{benefit}</span>
              </li>
            ))}
        </ul>
      </div>
{/* Documents */}
<div className="flex flex-wrap gap-1.5 mb-4">

  {scheme.requiredDocuments?.slice(0, 3).map((doc, idx) => (
    <span key={idx} className="document-badge">
      {doc}
    </span>
  ))}

  {scheme.requiredDocuments &&
    scheme.requiredDocuments.length > 3 && (
      <span className="document-badge">
        +{scheme.requiredDocuments.length - 3} more
      </span>
  )}

</div>

      {/* Footer */}
      <div className="flex items-center justify-end pt-4 border-t border-border">
        <Button
          variant="default"
          size="sm"
          onClick={() => onViewDetails(scheme)}
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
};




// ================= FILTER COMPONENT =================

interface SchemeFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  typeFilter: 'Central' | 'State' | 'all';
  onTypeChange: (value: 'Central' | 'State' | 'all') => void;
}

export const SchemeFilters = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  typeFilter,
  onTypeChange,
}: SchemeFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">

      {/* Search */}
      <input
        type="text"
        placeholder="Search schemes..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border p-2 rounded w-full md:w-1/3"
      />

      {/* Category */}
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="all">All Categories</option>
        <option value="Education">Education</option>
        <option value="Health">Health</option>
        <option value="Agriculture">Agriculture</option>
        <option value="Women">Women</option>
        <option value="MSME">MSME</option>
        <option value="Social Welfare">Social Welfare</option>
        <option value="Senior Citizens">Senior Citizens</option>
      </select>

      {/* Type */}
      <select
        value={typeFilter}
        onChange={(e) =>
          onTypeChange(e.target.value as 'Central' | 'State' | 'all')
        }
        className="border p-2 rounded"
      >
        <option value="all">All Types</option>
        <option value="Central">Central</option>
        <option value="State">State</option>
      </select>

    </div>
  );
};


// ================= SKELETON COMPONENT =================

export const SchemeCardSkeleton = () => {
  return (
    <div className="border rounded-lg p-4 shadow animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-5/6 mb-2"></div>
      <div className="h-8 bg-gray-300 rounded w-1/3 mt-4"></div>
    </div>
  );
};