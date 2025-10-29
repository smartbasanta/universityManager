'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { countries } from '@/lib/countries';

import { useActivateAccount } from '@/hooks/api/mentors/mentors.query';
import { useActivateStaffAccount } from '@/hooks/api/team-management/team.query';
import { useActivateAmbassadorAccount } from '@/hooks/api/ambassadors/ambassadors.query';
import {
  useRegisterUniversity,
  useRegisterInstitution,
  useRegisterStudent, // NEW: Import student registration hook
} from '@/hooks/api/auth/auth.query';

export default function AccountActivation() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = Array.isArray(params.token) ? params.token[0] : (params.token || '');
  
  // Enhanced role extraction
  const [role, setRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Form state - UPDATED to include student fields
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
 
  
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    name?: string;
    country?: string;
  }>({});

  // React Query hooks - UPDATED to include student
  const {
    mutate: activateMentorAccount,
    isPending: isMentorActivating,
  } = useActivateAccount();
  const {
    mutate: activateStaffAccount,
    isPending: isStaffActivating,
  } = useActivateStaffAccount();
  const {
    mutate: activateAmbassadorAccount,
    isPending: isAmbassadorActivating,
  } = useActivateAmbassadorAccount();
  const {
    mutate: registerUniversityAccount,
    isPending: isUniRegistering,
  } = useRegisterUniversity();
  const {
    mutate: registerInstitutionAccount,
    isPending: isInstRegistering,
  } = useRegisterInstitution();
  const {
    mutate: registerStudentAccount,
    isPending: isStudentRegistering,
  } = useRegisterStudent(); // NEW: Student registration hook

  const isActivating =
    isMentorActivating ||
    isStaffActivating ||
    isAmbassadorActivating ||
    isUniRegistering ||
    isInstRegistering ||
    isStudentRegistering; // NEW: Include student registration

  // FIXED: Enhanced role extraction with multiple methods - UPDATED to include student
  useEffect(() => {
    console.log("=== ACTIVATION PAGE DEBUG ===");
    console.log("Current URL:", window.location.href);
    console.log("Token from params:", token);
    console.log("Raw searchParams:", searchParams.toString());
    
    // Method 1: Direct searchParams.get()
    const roleFromGet = searchParams.get('role');
    console.log("Method 1 - searchParams.get('role'):", roleFromGet);
    
    // Method 2: From entries
    const allEntries = [...searchParams.entries()];
    console.log("Method 2 - All entries:", allEntries);
    const roleFromEntries = allEntries.find(([key]) => key === 'role')?.[1];
    console.log("Method 2 - Role from entries:", roleFromEntries);
    
    // Method 3: Parse URL manually as fallback
    let roleFromURL = null;
    try {
      const url = new URL(window.location.href);
      roleFromURL = url.searchParams.get('role');
      console.log("Method 3 - URL parsing:", roleFromURL);
    } catch (e) {
      console.error("URL parsing failed:", e);
    }
    
    // Method 4: Check if role is in hash or other parts
    const fullURL = window.location.href;
    const roleMatch = fullURL.match(/[?&]role=([^&]+)/);
    const roleFromRegex = roleMatch ? decodeURIComponent(roleMatch[1]) : null;
    console.log("Method 4 - Regex match:", roleFromRegex);
    
    // Try all methods and pick the first valid one
    const extractedRole = roleFromGet || roleFromEntries || roleFromURL || roleFromRegex;
    console.log("Final extracted role:", extractedRole);
    
    // Clean and validate the role
    const cleanRole = extractedRole ? extractedRole.trim().toLowerCase() : '';
    console.log("Cleaned role:", cleanRole);
    
    if (!token) {
      console.error("No token found in URL");
      toast.error('Invalid activation link. Token is missing.');
      router.push('/');
      return;
    }

    if (!cleanRole) {
      console.error("No role parameter found in URL");
      console.log("Available search params:", [...searchParams.entries()]);
      
      // Show more helpful error
      toast.error('Invalid activation link. Role parameter is missing. Please use the link from your email.');
      setIsLoading(false);
      return;
    }

    // Validate role parameter - UPDATED to include student
    const validRoles = ['mentor', 'staff', 'ambassador', 'university', 'institution', 'student'];
    if (!validRoles.includes(cleanRole)) {
      console.warn("Invalid role parameter:", cleanRole);
      toast.warn(`Invalid role "${cleanRole}" specified in activation link.`);
    }
    
    setRole(cleanRole);
    setIsLoading(false);
    console.log("Role successfully set to:", cleanRole);
    
  }, [token, searchParams, router]);

  // Wait for role extraction to complete
  useEffect(() => {
    // Additional debugging when component mounts
    console.log("Component mounted with:");
    console.log("- window.location.href:", window.location.href);
    console.log("- params:", params);
    console.log("- searchParams toString:", searchParams.toString());
    
    // Check if we're getting the role from the URL correctly
    const urlParams = new URLSearchParams(window.location.search);
    console.log("URLSearchParams entries:", [...urlParams.entries()]);
  }, []);

  // UPDATED validation to include student fields
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (role === 'university' || role === 'institution') {
      if (!name.trim()) {
        newErrors.name = role === 'university' ? 'University name is required' : 'Institution name is required';
      }
      if (!country) {
        newErrors.country = 'Country is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // UPDATED to include student
  const getAccountTypeDisplay = () => {
    switch (role) {
      case 'mentor': return 'Mentor';
      case 'staff': return 'Staff';
      case 'ambassador': return 'Ambassador';
      case 'university': return 'University';
      case 'institution': return 'Institution';
      case 'student': return 'Student'; // NEW
      default: return 'Account';
    }
  };

  // UPDATED to include student redirect
  const getRedirectPath = () => {
    switch (role) {
      case 'mentor': return "/dashboard/mentors";
      case 'staff': return "/dashboard/team-management";
      case 'ambassador': return "/dashboard/ambassadors";
      case 'university':
      case 'institution': return "/";
      case 'student': return "/"; // NEW: Student redirect
      default: return "/dashboard";
    }
  };

  // UPDATED handleSubmit to include student registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("=== FORM SUBMISSION DEBUG ===");
    console.log("Role:", role);
    console.log("Token:", token);
    
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    if (!token) {
      console.error("No token available for submission");
      toast.error("Invalid activation link. Please try again.");
      return;
    }

    if (!role) {
      console.error("No role available for submission");
      toast.error("Invalid activation link. Role is missing.");
      return;
    }

    try {
      if (role === 'university') {
        const requestData = {
          password: password.trim(),
          university_name: name.trim(),
          country: country,
        };
        
        console.log("Submitting university data:", requestData);
        console.log("With token:", token.trim());
        
        registerUniversityAccount(
          { data: requestData, token: token.trim() },
          {
            onSuccess: (data) => {
              console.log("University registration successful:", data);
              toast.success('University account registered successfully!');
              setTimeout(() => router.push(getRedirectPath()), 1500);
            },
            onError: (error: any) => {
              console.error("University registration failed:", error);
              console.error("Error response:", error.response?.data);
              console.error("Error status:", error.response?.status);
              toast.error("University registration failed. Please try again.");
            }
          }
        );
        return;
      }

      if (role === 'institution') {
        const requestData = {
          name: name.trim(),
          password: password.trim(),
          country: country,
        };
        
        console.log("Submitting institution data:", requestData);
        console.log("With token:", token.trim());
        
        registerInstitutionAccount(
          { data: requestData, token: token.trim() },
          {
            onSuccess: (data) => {
              console.log("Institution registration successful:", data);
              toast.success('Institution account registered successfully!');
              setTimeout(() => router.push(getRedirectPath()), 1500);
            },
            onError: (error: any) => {
              console.error("Institution registration failed:", error);
              console.error("Error response:", error.response?.data);
              console.error("Error status:", error.response?.status);
              toast.error("Institution registration failed. Please try again.");
            }
          }
        );
        return;
      }

      // NEW: Student registration
      if (role === 'student') {
        const requestData = {
          password: password.trim(),
          name: name.trim(),
        };
        
        console.log("Submitting student data:", requestData);
        console.log("With token:", token.trim());
        
        registerStudentAccount(
          { data: requestData, token: token.trim() },
          {
            onSuccess: (data) => {
              console.log("Student registration successful:", data);
              toast.success('Student account registered successfully!');
              setTimeout(() => router.push(getRedirectPath()), 1500);
            },
            onError: (error: any) => {
              console.error("Student registration failed:", error);
              console.error("Error response:", error.response?.data);
              console.error("Error status:", error.response?.status);
              toast.error("Student registration failed. Please try again.");
            }
          }
        );
        return;
      }

      // Handle other roles (mentor, staff, ambassador)
      const payload = { token: token.trim(), password: password.trim() };
      
      if (role === 'staff') {
        activateStaffAccount(payload, {
          onSuccess: () => {
            toast.success("Staff account activated successfully!");
            setTimeout(() => router.push(getRedirectPath()), 1500);
          },
          onError: (error: any) => {
            console.error("Staff activation failed:", error);
            toast.error("Staff activation failed. Please try again.");
          }
        });
      } else if (role === 'ambassador') {
        activateAmbassadorAccount(payload, {
          onSuccess: () => {
            toast.success("Ambassador account activated successfully!");
            setTimeout(() => router.push(getRedirectPath()), 1500);
          },
          onError: (error: any) => {
            console.error("Ambassador activation failed:", error);
            toast.error("Ambassador activation failed. Please try again.");
          }
        });
      } else {
        activateMentorAccount(payload, {
          onSuccess: () => {
            toast.success("Mentor account activated successfully!");
            setTimeout(() => router.push(getRedirectPath()), 1500);
          },
          onError: (error: any) => {
            console.error("Mentor activation failed:", error);
            toast.error("Mentor activation failed. Please try again.");
          }
        });
      }
    } catch (error) {
      console.error("Unexpected error during activation:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  // Show loading state while extracting role
  if (isLoading || !token) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-gray-500 mb-2">
            {isLoading ? 'Loading activation page...' : 'Invalid activation link'}
          </div>
          {!token && (
            <div className="text-red-500 text-sm">
              Token is missing from the activation link
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show error state if role extraction failed
  if (!role) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4 text-lg font-semibold">
            Invalid Activation Link
          </div>
          <div className="text-gray-600 mb-4">
            The role parameter is missing from your activation link. This usually means:
          </div>
          <ul className="text-sm text-gray-500 text-left mb-6">
            <li>• The email link was corrupted</li>
            <li>• You're using an old or invalid link</li>
            <li>• There was an issue with the email generation</li>
          </ul>
          <div className="text-sm text-gray-600">
            Please request a new verification email or contact support.
          </div>
          <button
            onClick={() => router.push('/')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {role === 'staff' 
              ? 'Create Staff Account' 
              : role === 'university'
              ? 'Complete University Registration'
              : role === 'institution'
              ? 'Complete Institution Registration'
              : role === 'student'
              ? 'Complete Student Registration' // NEW
              : `Activate Your ${getAccountTypeDisplay()} Account`}
          </h1>
          <p className="text-gray-600 mt-2">
            {role === 'university' || role === 'institution' || role === 'student'
              ? `Set up your ${getAccountTypeDisplay().toLowerCase()} account details`
              : `Set up your password to complete your ${getAccountTypeDisplay().toLowerCase()} registration`}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            Role: {role}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* University/Institution Name Field */}
          {(role === 'university' || role === 'institution') && (
            <>
              <div>
                <label className="text-gray-700 text-sm font-medium leading-normal pb-2 block">
                  {role === 'university' ? 'University Name *' : 'Institution Name *'}
                </label>
                <Input
                  type="text"
                  placeholder={role === 'university' ? 'Enter university name' : 'Enter institution name'}
                  className="bg-gray-50 border-gray-300 h-12 placeholder:text-gray-400 p-4 text-base font-normal leading-normal"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors(prev => ({...prev, name: undefined}));
                    }
                  }}
                  disabled={isActivating}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium leading-normal pb-2 block">
                  Country *
                </label>
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    if (errors.country) {
                      setErrors(prev => ({...prev, country: undefined}));
                    }
                  }}
                  disabled={isActivating}
                  className="w-full bg-gray-50 border border-gray-300 rounded-md h-12 px-4 text-base font-normal leading-normal"
                  required
                >
                  <option value="">Select your country</option>
                  {countries.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                )}
              </div>
            </>
          )}

          {/* NEW: Student-specific fields */}
          {role === 'student' && (
            <>
              <div>
                <label className="text-gray-700 text-sm font-medium leading-normal pb-2 block">
                  Full Name *
                </label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  className="bg-gray-50 border-gray-300 h-12 placeholder:text-gray-400 p-4 text-base font-normal leading-normal"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors(prev => ({...prev, name: undefined}));
                    }
                  }}
                  disabled={isActivating}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

             
            </>
          )}

          {/* Password Fields */}
          <div>
            <label className="text-gray-700 text-sm font-medium leading-normal pb-2 block">
              Create Password *
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              className="bg-gray-50 border-gray-300 h-12 placeholder:text-gray-400 p-4 text-base font-normal leading-normal"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors(prev => ({...prev, password: undefined}));
                }
              }}
              disabled={isActivating}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium leading-normal pb-2 block">
              Confirm Password *
            </label>
            <Input
              type="password"
              placeholder="Confirm your password"
              className="bg-gray-50 border-gray-300 h-12 placeholder:text-gray-400 p-4 text-base font-normal leading-normal"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) {
                  setErrors(prev => ({...prev, confirmPassword: undefined}));
                }
              }}
              disabled={isActivating}
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={
              isActivating || 
              !password.trim() || 
              !confirmPassword.trim() || 
              !token ||
              !role ||
              ((role === 'university' || role === 'institution') && (!name.trim() || !country)) ||
              (role === 'student' && (!name.trim())) 
            }
            className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-900 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isActivating 
              ? role === 'university' || role === 'institution' || role === 'student'
                ? "Registering Account..." 
                : "Activating Account..."
              : role === 'university' || role === 'institution' || role === 'student'
                ? "Complete Registration"
                : "Activate Account"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            By {role === 'university' || role === 'institution' || role === 'student' ? 'registering' : 'activating'} your account, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
