import { RouterProvider } from 'react-router';
import { router } from '@/app/routes';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';
import { SplashScreen } from '@/app/components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

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
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors />
        </>
      )}
    </>
  );
}