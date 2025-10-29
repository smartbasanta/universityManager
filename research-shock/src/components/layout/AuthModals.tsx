'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';

import {
  useAuthLogin,
  useEmailVerify,
} from '@/hooks/api/auth/auth.query';

export const AuthModals = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [signupType, setSignupType] =
    useState<'university' | 'institution' | 'student'>('student');   
  const [isStudentMode, setIsStudentMode] = useState(true);          
  const [signupEmail, setSignupEmail] = useState('');
  const [signupError, setSignupError] = useState('');


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const {
    setAccessToken,
    setRefreshToken,
    setRole,
    setIsAuth,
    setIsLoading,
    fetchUserInfo,
  } = useAuthStore();

  const router = useRouter();

  
  const loginMutation  = useAuthLogin();
  const verifyMutation = useEmailVerify();


  const openModal = (id: string) => {
    setError('');
    setSignupError('');
    setActiveModal(id);

    if (id === 'signup') {
      setIsStudentMode(true);             
      setSignupType('student');
      setSignupEmail('');
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setError('');
    setSignupError('');
    setEmail('');
    setPassword('');
    setIsStudentMode(true);
    setSignupType('student');
    setSignupEmail('');
  };


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: async ({ accessToken, refreshToken, role }) => {
          try {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setRole(role);
            setIsAuth(true);
            await fetchUserInfo();

            /* Redirect non-students */
            if (role !== 'student') router.push('/dashboard');
            closeModal();
          } catch {
            if (role !== 'student') router.push('/dashboard');
            closeModal();
          }
        },
        onError: (err: any) => setError(err?.message || 'Login failed'),
      }
    );
  };


  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email) throw new Error('Please enter your email');
      const res   = await fetch('/api/auth/forgot-password', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ email }),
      });
      const data  = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send reset link');
      setError('Password reset link sent to your email');
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };


  const handleEmailVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (!signupEmail) {
      setSignupError('Please enter your email address');
      return;
    }

    verifyMutation.mutate(
      { email: signupEmail, role: signupType },
      {
        onSuccess: () => {
          setSignupError(
            'Verification email sent! Please check your inbox to complete registration.'
          );
          setTimeout(closeModal, 3000);
        },
        onError: (err: any) =>
          setSignupError(err?.message || 'Verification failed'),
      }
    );
  };

 
  const showOrganizationMode = () => {
    setIsStudentMode(false);
    setSignupType('university'); 
    setSignupEmail('');
    setSignupError('');
  };

  const showStudentMode = () => {
    setIsStudentMode(true);
    setSignupType('student');
    setSignupEmail('');
    setSignupError('');
  };

  const handleUniversityToggle = () => {
    setSignupType('university');
    setSignupEmail('');
    setSignupError('');
  };

  const handleInstitutionToggle = () => {
    setSignupType('institution');
    setSignupEmail('');
    setSignupError('');
  };


  const loginPending  = loginMutation.isPending;
  const verifyPending = verifyMutation.isPending;


  return (
    <>

      <button
        onClick={() => openModal('signup')}
        className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
      >
        Sign Up
      </button>

      <button
        onClick={() => openModal('login')}
        className="text-gray-600 bg-gray-100 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
      >
        Log In
      </button>

      {/* SIGN-UP MODAL */}
      {activeModal === 'signup' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-black"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold text-center mb-4">
              {isStudentMode ? 'Student Sign Up' : 'Organization Sign Up'}
            </h2>

            {/* UNIVERSITY / INSTITUTION TOGGLES */}
            {!isStudentMode && (
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={handleUniversityToggle}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    signupType === 'university'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  University {signupType === 'university' && <span>✓</span>}
                </button>

                <button
                  type="button"
                  onClick={handleInstitutionToggle}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    signupType === 'institution'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Institution {signupType === 'institution' && <span>✓</span>}
                </button>
              </div>
            )}

            <p className="text-sm text-gray-600 mb-4 text-center">
              By continuing, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:underline">
                User Agreement
              </a>{' '}
              and acknowledge that you understand the{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              .
            </p>

            <form onSubmit={handleEmailVerify}>
              <div className="flex items-center gap-2 my-4">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="text-gray-500 text-sm">
                  Enter your email for {signupType}
                </span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>

              <input
                type="email"
                placeholder={`Enter your email address for ${signupType} registration`}
                className="w-full border px-3 py-2 mb-4 rounded-md"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 mb-3 disabled:opacity-50"
                disabled={verifyPending || !signupEmail.trim()}
              >
                {verifyPending
                  ? 'Sending...'
                  : `Send ${signupType} verification e-mail`}
              </button>

              {signupError && (
                <div
                  className={`text-sm mt-2 text-center ${
                    signupError.includes('sent')
                      ? 'text-green-600'
                      : 'text-red-500'
                  }`}
                >
                  {signupError}
                </div>
              )}

              {/* LINK TO SWITCH MODES */}
              <div className="text-sm text-center mt-3 pt-3 border-t border-gray-200">
                {isStudentMode ? (
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={showOrganizationMode}
                  >
                    Are you an organization?
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={showStudentMode}
                  >
                    Back to student registration
                  </button>
                )}
              </div>

              <div className="text-sm text-center mt-3">
                Already registered?{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => {
                    closeModal();
                    openModal('login');
                  }}
                >
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------- LOGIN MODAL ---------- */}
      {activeModal === 'login' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-black"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold text-center mb-4">Log In</h2>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email or phone number"
                className="w-full border px-3 py-2 mb-3 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border px-3 py-2 mb-4 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 mb-3 disabled:opacity-50"
                disabled={loginPending}
              >
                {loginPending ? 'Logging In...' : 'Log In'}
              </button>
            </form>

            {error && (
              <div className="text-red-500 text-sm mb-3 text-center">
                {error}
              </div>
            )}

            <div className="text-sm text-center">
              <button
                onClick={() => {
                  closeModal();
                  openModal('forgot');
                }}
                className="text-blue-600 hover:underline block mb-2"
              >
                Forgot password?
              </button>

              <span className="text-gray-600">
                New to Research Shock?{' '}
                <button
                  onClick={() => {
                    closeModal();
                    openModal('signup');
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Sign Up
                </button>
              </span>
            </div>
          </div>
        </div>
      )}

    
      {activeModal === 'forgot' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-black"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold text-center mb-4">
              Reset your password
            </h2>

            <form onSubmit={handlePasswordReset}>
              <input
                type="email"
                placeholder="Email or phone number"
                className="w-full border px-3 py-2 mb-4 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900"
              >
                Send Reset Link
              </button>
            </form>

            {error && (
              <div
                className={`text-sm mb-3 text-center ${
                  error.includes('sent') ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {error}
              </div>
            )}

            <div className="text-sm text-center">
              <a
                href="/help"
                className="text-blue-600 hover:underline block mb-2"
              >
                Need help?
              </a>

              <button
                onClick={() => {
                  closeModal();
                  openModal('login');
                }}
                className="text-blue-600 hover:underline"
              >
                Back to Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
