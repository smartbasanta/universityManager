import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import BookingSlotForm from '@/components/mentors/BookSlotForm';

interface ApplyPageProps {
  params: {
    id: string;
  };
}

export default function AmbassadorApplyPage({ params }: ApplyPageProps) {
  return (
    <div 
      className="relative flex flex-col bg-slate-50 min-h-screen" 
      style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex flex-col">
        <Header />
        
        <div className="flex flex-1 justify-center py-8">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 px-4 sm:px-8 md:px-20 lg:px-40">
            <Suspense fallback={
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3f7fbf]"></div>
              </div>
            }>
              <BookingSlotForm 
                ambassadorId={params.id} 
                isAmbassadorBooking={true}
              />
            </Suspense>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}
