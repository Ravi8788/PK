import { RouterProvider } from 'react-router';
import { router } from '@/app/routes';
import { Toaster } from 'sonner';
import { useEffect, useState } from 'react';

export default function App() {
  const [backendConfigured, setBackendConfigured] = useState(true);

  useEffect(() => {
    let cancelled = false;
    import('@/app/utils/api').then((mod) => {
      if (!cancelled) setBackendConfigured(mod.isBackendConfigured());
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
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
  );
}
