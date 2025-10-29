import { SignupForm } from "@/components/form/signup-form";
import { GalleryVerticalEnd } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer"; 

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-md p-8">
             <h2 className="text-xl font-semibold text-center mb-4">University Sign Up</h2>
            
            {/* Signup Form */}
            <SignupForm />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
