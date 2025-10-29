import { VerifiedForm } from "@/components/form/verified-form";
import { Header } from "@/components/layout/Header"; 
import { Footer } from "@/components/layout/Footer"; 

export default function VerifiedPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-md p-8">
            <VerifiedForm />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
