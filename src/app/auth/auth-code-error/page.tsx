"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle, Home, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthCodeErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error') || 'Authentication failed';

  return (
    <div className="min-h-screen bg-brand-bg-50-50-50-50-50-50-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="bg-red-50 rounded-full p-6">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h1 className="text-lg md:text-lg lg:text-4xl font-bold text-charcoal tracking-tight">
              Authentication Error
            </h1>
            <p className="text-charcoal/70 leading-relaxed">
              {error}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-sage text-white font-semibold py-4 px-6 rounded-full hover:bg-sage/90 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sage/30 focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Login
            </button>

            <button
              onClick={() => router.push('/register')}
              className="w-full bg-cultured-1/50 text-charcoal font-semibold py-4 px-6 rounded-full hover:bg-cultured-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sage/20 focus:ring-offset-2 flex items-center justify-center gap-2 border border-light-gray/50"
            >
              <Mail className="w-5 h-5" />
              Try Registering Instead
            </button>
          </div>

          {/* Help Text */}
          <div className="pt-6 border-t border-light-gray/30">
            <p className="text-sm text-charcoal/60">
              If you continue to experience issues, please contact support at{" "}
              <a
                href="mailto:support@sayso.com"
                className="text-sage hover:text-sage/80 font-medium underline"
              >
                support@sayso.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
