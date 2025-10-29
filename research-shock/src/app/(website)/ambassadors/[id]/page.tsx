'use client';

import { use as unwrap, useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AmbassadorProfile } from '@/components/ambassadors/AmbassadorProfile';
import { websiteStudentAmbassadorAPI } from '@/hooks/api/website/student-ambassador.api';
import { useGetAmbassadorAvailableSlots } from '@/hooks/api/ambassadors/ambassadors.query';
import type { Ambassador, SlotResponse } from '@/types/ambassadors/ambassador';

// interface PageProps {
//   params: { id: string };
// }

const transformAmbassadorForDisplay = (
  apiData: Ambassador,
  availableSlots: SlotResponse[] = []
) => ({
  id: apiData.id,
  name: apiData.name,
  email: apiData.auth?.email || undefined,
  linkedin: apiData.linkedin || 'No LinkedIn available',
  university: apiData.university?.university_name || apiData.school || 'Unknown University',
  major: apiData.department?.dept_name || 'Unknown Major',
  level: apiData.education === 'grad' ? 'Grad' : 'Undergrad',
  image: apiData.photo || apiData.image || '/ambassador-default.png',
  bio: apiData.about || 'No bio available',
  languages: apiData.languages || ['English'],
  expertiseAreas: apiData.expertiseArea || ['No expertise areas listed'],
  focusAreas: apiData.focusArea || ['No focus areas listed'],
  availableSlots
});

export default function AmbassadorPage({ params }:  { params: Promise<{ id: string }> }  ) {
  const { id } = unwrap(params);
  
  const [ambassador, setAmbassador] = useState<ReturnType<typeof transformAmbassadorForDisplay> | null>(null);
  const [ambassadorData, setAmbassadorData] = useState<Ambassador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch ambassador's available slots using the correct hook
  const { 
    data: availableSlots = [], 
    isLoading: slotsLoading, 
    error: slotsError 
  } = useGetAmbassadorAvailableSlots(id);

  useEffect(() => {
    async function loadAmbassadorData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch ambassador profile data
        const ambassadorProfile = await websiteStudentAmbassadorAPI.fetchAmbassadorById(id);
        setAmbassadorData(ambassadorProfile);

        // Transform ambassador data (slots will be added when they're loaded)
        const transformedAmbassador = transformAmbassadorForDisplay(ambassadorProfile, []);
        setAmbassador(transformedAmbassador);
      } catch (err) {
        console.error('Error loading ambassador:', err);
        setError('Failed to load ambassador data');
      } finally {
        setLoading(false);
      }
    }

    loadAmbassadorData();
  }, [id]);

  // Update ambassador with available slots when they're loaded
  useEffect(() => {
    if (ambassadorData && availableSlots && !slotsLoading) {
      const transformedAmbassador = transformAmbassadorForDisplay(ambassadorData, availableSlots);
      setAmbassador(transformedAmbassador);
    }
  }, [ambassadorData, availableSlots, slotsLoading]);

  // Show loading state
  if (loading || slotsLoading) {
    return (
      <ScreenShell>
        <Spinner label="Loading ambassador profile..." />
      </ScreenShell>
    );
  }

  // Show error state
  if (error || slotsError || !ambassador) {
    const errorMessage = error || 
      (slotsError ? "Failed to load ambassador's availability" : "Ambassador not found");
    
    return (
      <ScreenShell>
        <ErrorCard
          title="Ambassador Not Found"
          message={errorMessage}
          backHref="/ambassadors"
        />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <AmbassadorProfile {...ambassador} />
    </ScreenShell>
  );
}

// Layout / Loading / Error helpers

function ScreenShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex flex-col bg-slate-50 min-h-screen"
      style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex flex-col">
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
}

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex flex-1 justify-center items-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3f7fbf] mx-auto mb-4" />
        <p className="text-[#5c738a] text-lg">{label}</p>
      </div>
    </div>
  );
}

function ErrorCard({
  title,
  message,
  backHref
}: {
  title: string;
  message: string;
  backHref: string;
}) {
  return (
    <div className="flex flex-1 justify-center items-center py-20">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 
                 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 
                 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#101418] mb-2">{title}</h2>
        <p className="text-[#5c738a] text-base mb-4">{message}</p>
        <a href={backHref}
           className="inline-flex items-center px-4 py-2 bg-[#3f7fbf] 
                      text-white rounded-full hover:bg-[#2d5a87] transition-colors">
          Back to Ambassadors
        </a>
      </div>
    </div>
  );
}
