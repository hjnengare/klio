// src/components/Footer/Footer.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";
import Logo from "../Logo/Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About", href: "/about" }
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Safety", href: "/safety" },
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
    <footer className="relative overflow-hidden pb-safe-area-bottom bg-charcoal text-off-white">
   
      <div className="relative z-10 mx-auto w-full max-w-[2000px] px-2 pt-8 sm:pt-12 md:pt-16">
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
              <Link href="/" className="inline-block group">
                <div className="mb-4 group-hover:scale-105 transition-all duration-300">
                  <Logo variant="footer" />
                </div>
              </Link>
              <p className="font-urbanist text-6 text-off-white/70 leading-relaxed mb-6 max-w-sm">
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
                      className="w-10 h-10 bg-off-white/10 hover:bg-off-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-off-white hover:text-off-white/80 transition-all duration-300 border border-off-white/20 hover:border-off-white/30 shadow-lg hover:shadow-xl"
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
                <h3 className="font-urbanist text-5 font-600 text-off-white mb-4">Company</h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="font-urbanist text-6 text-off-white/70 hover:text-off-white transition-colors duration-300 group"
                      >
                        <span className="relative">
                          {link.name}
                          <div className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-off-white/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
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
                <h3 className="font-urbanist text-5 font-600 text-off-white mb-4">Support</h3>
                <ul className="space-y-3">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="font-urbanist text-6 text-off-white/70 hover:text-off-white transition-colors duration-300 group"
                      >
                        <span className="relative">
                          {link.name}
                          <div className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-off-white/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
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
                <h3 className="font-urbanist text-5 font-600 text-off-white mb-4">Legal</h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="font-urbanist text-6 text-off-white/70 hover:text-off-white transition-colors duration-300 group"
                      >
                        <span className="relative">
                          {link.name}
                          <div className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-off-white/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
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
          className="pt-6 md:pt-8 border-t border-off-white/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
              <p className="font-urbanist text-7 text-off-white/60">
                © {currentYear} sayso. All rights reserved.
              </p>
              <span className="hidden md:inline text-off-white/40">•</span>
              <p className="font-urbanist text-7 text-off-white/60">
                Product of ChitChat
              </p>
            </div>
          </div>
        </motion.div>
      </div>
       {/* ✅ SF Pro font setup */}
      <style jsx global>{`
        .font-urbanist {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
        }
      `}</style>
    </footer>
  );
}
