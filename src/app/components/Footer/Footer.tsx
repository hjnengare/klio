// src/components/Footer/Footer.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  ShieldCheck,
  Heart,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Blog", href: "/blog" }
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Safety", href: "/safety" },
      { name: "Community", href: "/community" },
      { name: "Contact", href: "/contact" }
    ],
    legal: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Cookies", href: "/cookies" },
      { name: "Accessibility", href: "/accessibility" }
    ]
  };

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" }
  ];

  return (
    <footer className="bg-white border-t border-charcoal/10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-gradient-to-br from-coral/8 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="inline-block">
                <h2 className="font-sf text-3xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-sage to-charcoal mb-4">
                  KLIO
                </h2>
              </Link>
              <p className="font-sf text-6 text-charcoal/70 leading-relaxed mb-6 max-w-sm">
                Discover trusted local businesses and authentic experiences in your community.
              </p>

              {/* Social links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="w-10 h-10 bg-sage/10 hover:bg-sage/20 rounded-full flex items-center justify-center text-sage hover:text-sage/80 transition-all duration-300"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Links sections */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {/* Company */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-sf text-5 font-600 text-charcoal mb-4">Company</h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="font-sf text-6 text-charcoal/70 hover:text-sage transition-colors duration-300 group"
                      >
                        <span className="relative">
                          {link.name}
                          <div className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-sage/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="font-sf text-5 font-600 text-charcoal mb-4">Support</h3>
                <ul className="space-y-3">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="font-sf text-6 text-charcoal/70 hover:text-sage transition-colors duration-300 group"
                      >
                        <span className="relative">
                          {link.name}
                          <div className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-sage/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Legal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h3 className="font-sf text-5 font-600 text-charcoal mb-4">Legal</h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="font-sf text-6 text-charcoal/70 hover:text-sage transition-colors duration-300 group"
                      >
                        <span className="relative">
                          {link.name}
                          <div className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-sage/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="pt-6 md:pt-8 border-t border-sage/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="font-sf text-7 text-charcoal/60">
              © {currentYear} KLIO. All rights reserved.
            </p>

            {/* Trust indicators */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-sage/10 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-sage" />
                <span className="font-sf text-8 font-500 text-sage">Secure</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-coral/10 rounded-full">
                <Heart className="w-3.5 h-3.5 text-coral" fill="currentColor" />
                <span className="font-sf text-8 font-500 text-coral">Trusted</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
       {/* ✅ Inline SF Pro setup */}
      <style jsx global>{`
        .font-sf {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
            "SF Pro Display", "Helvetica Neue", Helvetica, Arial, system-ui,
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
        }
      `}</style>
    </footer>
  );
}
