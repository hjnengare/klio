"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate newsletter subscription
    setTimeout(() => {
      setSubmitMessage("Thank you for subscribing!");
      setIsSubmitting(false);
      setTimeout(() => {
        onClose();
        setSubmitMessage("");
        setEmail("");
      }, 2000);
    }, 1000);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-off-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-charcoal/10 hover:bg-charcoal/20 transition-colors"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-charcoal"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Newsletter Content */}
            <div className="newsletter p-8">
              <form onSubmit={handleSubmit}>
                <div className="newsletter-header mb-6">
                  <h3 className="newsletter-title font-sf text-5 font-700 text-charcoal mb-3">
                    Subscribe Newsletter.
                  </h3>
                  <p className="newsletter-desc font-sf text-6 font-400 text-charcoal/70 leading-relaxed">
                    Subscribe to <b className="text-sage font-600">KLIO</b> to get latest products and discount updates.
                  </p>
                </div>

                {submitMessage ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4 text-sage font-sf text-6 font-500"
                  >
                    {submitMessage}
                  </motion.div>
                ) : (
                  <>
                    <input
                      type="email"
                      name="email"
                      className="email-field w-full px-4 py-3 mb-4 rounded-lg border-2 border-charcoal/10 bg-white font-sf text-6 text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-sage transition-colors"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />

                    <button
                      type="submit"
                      className="btn-newsletter w-full py-3 rounded-lg bg-sage text-off-white font-sf text-6 font-600 hover:bg-sage/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Subscribing..." : "Subscribe"}
                    </button>
                  </>
                )}
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
