import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  SchemeCard,
  SchemeFilters,
  SchemeCardSkeleton
} from '@/components/schemes/SchemeCard';
import { searchSchemes } from '@/lib/eligibilityEngine';
import { Scheme } from '@/types/scheme';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

import {
  CheckCircle2,
  ExternalLink,
  FolderSearch,
  FileText
} from 'lucide-react';


const SchemesPage = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] =
    useState<'Central' | 'State' | 'all'>('all');

  const [selectedScheme, setSelectedScheme] =
    useState<Scheme | null>(null);

  const [allSchemes, setAllSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  // ✅ Fetch schemes from backend
  useEffect(() => {

    const fetchSchemes = async () => {

      try {

        const response =
          await fetch("http://127.0.0.1:8000/api/schemes");

        if (!response.ok)
          throw new Error("Failed to fetch schemes");

        const data = await response.json();

// ✅ map backend fields → frontend fields
const mappedSchemes = data.map((scheme: any) => ({
  id: scheme.id.toString(),
  name: scheme.name,
  description: scheme.description,
  benefits: scheme.benefits,
  category: scheme.category,

  // backend: scheme_type → frontend: type
  type: scheme.scheme_type,

  // backend: documents_required → frontend: requiredDocuments
  requiredDocuments: scheme.documents_required || [],

  // backend: official_link → frontend: applicationLink
  applicationLink: scheme.official_link || "",

  // optional fields safe defaults
  state: scheme.state || null,
}));

setAllSchemes(mappedSchemes);

      }
      catch (error) {

        console.error("Error fetching schemes:", error);

      }
      finally {

        setIsLoading(false);

      }

    };

    fetchSchemes();

  }, []);



  // ✅ Apply filters
  const schemes = useMemo(() => {

    return searchSchemes(
      searchQuery,
      categoryFilter,
      typeFilter,
      allSchemes
    );

  }, [searchQuery, categoryFilter, typeFilter, allSchemes]);



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

            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Scheme Directory
            </span>

            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Browse Government Schemes
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore Central and State welfare schemes across various categories.
            </p>

          </motion.div>



          {/* Filters */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >

            <SchemeFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              typeFilter={typeFilter}
              onTypeChange={setTypeFilter}
            />

          </motion.div>



          {/* Results count */}

          <p className="text-sm mb-6">

            Found
            <span className="font-semibold">
              {" "} {schemes.length} {" "}
            </span>
            scheme(s)

          </p>



          {/* Schemes Grid */}

          {isLoading ? (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SchemeCardSkeleton key={i} />
              ))}

            </div>

          ) : schemes.length > 0 ? (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {schemes.map((scheme) => (

                <SchemeCard
                  key={scheme.id}
                  scheme={scheme}
                  onViewDetails={(s) =>
                    setSelectedScheme(s)
                  }
                />

              ))}

            </div>

          ) : (

            <div className="text-center py-16">

              <FolderSearch className="mx-auto mb-4" size={40} />

              <p>No schemes found</p>

            </div>

          )}


        </div>

      </main>



      <Footer />



      {/* ✅ DETAILS DIALOG */}
<Dialog
  open={!!selectedScheme}
  onOpenChange={() => setSelectedScheme(null)}
>
  <DialogContent className="max-w-2xl">

    {selectedScheme && (

      <>
        <DialogHeader>

          <DialogTitle className="text-xl font-bold">
            {selectedScheme.name}
          </DialogTitle>

        </DialogHeader>


        <div className="space-y-6">

          {/* Type + Category */}

          <div className="flex gap-3">

            <span className={
              selectedScheme.type === 'Central'
                ? 'category-tag-central'
                : 'category-tag-state'
            }>
              {selectedScheme.type}
            </span>

            <span className="text-muted-foreground">
              {selectedScheme.category}
            </span>

          </div>


          {/* Description */}

          <div>

            <h3 className="font-semibold mb-1">
              Description
            </h3>

            <p className="text-muted-foreground">
              {selectedScheme.description}
            </p>

          </div>


          {/* Benefits */}

          <div>

            <h3 className="font-semibold mb-2 flex items-center gap-2">

              <CheckCircle2 size={18} className="text-green-500" />

              Benefits

            </h3>

            <ul className="space-y-1">

              {[selectedScheme.benefits].map((benefit, i) => (

                <li key={i} className="flex gap-2">

                  <CheckCircle2 size={16}
                    className="text-green-500 mt-1" />

                  {benefit}

                </li>

              ))}

            </ul>

          </div>


          {/* Documents */}

          {selectedScheme.requiredDocuments?.length > 0 && (

            <div>

              <h3 className="font-semibold mb-2 flex gap-2 items-center">

                <FileText size={18} />

                Required Documents

              </h3>

              <ul className="space-y-1">

                {selectedScheme.requiredDocuments.map((doc, i) => (

                  <li key={i}>
                    • {doc}
                  </li>

                ))}

              </ul>

            </div>

          )}


          {/* Buttons */}

          <div className="flex gap-3 pt-4">

            {/* Apply Button */}

            {selectedScheme.applicationLink && (

              <Button
                className="flex-1"
                onClick={() =>
                  window.open(
                    selectedScheme.applicationLink,
                    "_blank"
                  )
                }
              >

                Apply Now

                <ExternalLink size={16} className="ml-2" />

              </Button>

            )}


            {/* Close Button */}

            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                setSelectedScheme(null)
              }
            >

              Close

            </Button>

          </div>


        </div>

      </>

    )}

  </DialogContent>

</Dialog>


    </div>

  );

};

export default SchemesPage;
