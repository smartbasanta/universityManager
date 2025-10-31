import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  containerClassName?: string;
}


export const PageLayout = ({ 
  children, 
  title, 
  description,
  showHeader = true,
  showFooter = true,
  containerClassName = ''
}: PageLayoutProps) => {
  return (
    <div className="bg-white text-gray-800 min-h-screen flex flex-col font-sans">
      {showHeader && <Header />}
      
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-40 py-8">
          <div className={`layout-content-container flex flex-col max-w-[1600px] flex-1 mx-auto ${containerClassName}`}>
            {(title || description) && (
              <div className="text-center mb-8">
                {title && (
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                    {description}
                  </p>
                )}
              </div>
            )}
            
            {/* Page Content */}
            {children}
          </div>
        </div>
      </main>

      {showFooter && <Footer />}
    </div>
  );
};


export const PageContent = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => {
  return (
    <div className={`px-4 sm:px-6 lg:px-40 py-8 ${className}`}>
      <div className="layout-content-container flex flex-col max-w-[1600px] flex-1 mx-auto">
        {children}
      </div>
    </div>
  );
};