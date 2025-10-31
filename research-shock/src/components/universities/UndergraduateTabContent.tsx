"use client";

import { useQuery } from '@tanstack/react-query';
import { websiteUniversityAPI } from '@/hooks/api/website/university.api';
import UniversitySkeleton from '@/components/universities/UniversitySkeleton';
import { RankingSection, SchoolsSection, AdmissionSection, TuitionSection } from './sections';
import { UniversitySidebar } from './UniversitySidebar'; // Shared sidebar
import { motion } from 'framer-motion';

export function UndergraduateTabContent({ universityId }: { universityId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['universityUndergraduate', universityId],
    queryFn: () => websiteUniversityAPI.fetchUndergraduateSectionData(universityId),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <UniversitySkeleton />;
  if (error) return <div className="text-center py-10 text-red-600">Failed to load undergraduate data.</div>;
  if (!data) return <div className="text-center py-10 text-gray-500">No undergraduate information available.</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="hidden lg:block w-72 flex-shrink-0 sticky top-20 self-start">
        <UniversitySidebar /> {/* Reusing general sidebar or create specific if needed */}
      </div>
      <motion.div 
        className="flex-1 min-w-0 space-y-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <RankingSection rankings={data.rankings || []} />
        <SchoolsSection departments={data.departments || []} level="UNDERGRADUATE" />
        <AdmissionSection admissionData={data.admissions?.find(adm => adm.level === 'undergraduate')} level="UNDERGRADUATE" />
        <TuitionSection tuitionData={data.tuition_fees?.find(t => t.level === 'undergraduate')} level="UNDERGRADUATE" />
      </motion.div>
    </div>
  );
}