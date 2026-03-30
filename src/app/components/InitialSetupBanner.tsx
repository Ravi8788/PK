import { motion } from 'motion/react';
import { Settings, ArrowRight } from 'lucide-react';

interface InitialSetupBannerProps {
  hasContent: boolean;
}

export function InitialSetupBanner({ hasContent }: InitialSetupBannerProps) {
  if (hasContent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Settings className="animate-spin-slow" size={24} />
            <div>
              <p className="font-semibold">Welcome to PK Graphics!</p>
              <p className="text-sm text-white/90">
                Get started by adding your portfolio items, reels, and testimonials in the admin dashboard.
              </p>
            </div>
          </div>
          <a
            href="/admin/login"
            className="flex items-center gap-2 px-6 py-2 bg-white text-amber-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Go to Admin
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
