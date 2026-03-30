import { RouterProvider } from 'react-router';
import { router } from '@/app/routes';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';
import { SplashScreen } from '@/app/components/SplashScreen';
import { isBackendConfigured } from '@/app/utils/api';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const backendConfigured = isBackendConfigured();

  useEffect(() => {
    // Show splash only on first visit in this browser.
    if (localStorage.getItem('splashScreenShown')) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    localStorage.setItem('splashScreenShown', 'true');
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <>
          {!backendConfigured && (
            <div className="bg-amber-500 px-4 py-3 text-sm font-medium text-black">
              Firebase is not configured for this deployment. Add valid{' '}
              <code className="rounded bg-black/10 px-1 py-0.5">
                VITE_FIREBASE_*
              </code>{' '}
              environment variables in Netlify to enable admin login, portfolio
              data, reels, testimonials, and contact form submissions.
            </div>
          )}
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors />
        </>
      )}
    </>
  );
}
