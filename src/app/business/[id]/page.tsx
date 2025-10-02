"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

// Dynamic imports for premium animations
const FadeInUp = dynamic(() => import("../../components/Animations/FadeInUp"), {
  ssr: false,
});

export default function BusinessProfilePage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params?.id as string;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data - in real app this would come from params and API
  // For now, we'll use the same mock data for any ID to prevent 404 errors
  const business = useMemo(() => {
    // In production, this would fetch from API based on businessId
    // For now, return mock data for development/testing
    return {
      id: businessId || "demo",
      name: "Mama's Kitchen",
      rating: 4.8,
      image: "/images/product-01.jpg", // Business photo
      images: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop"
      ],
      trust: 95,
      punctuality: 89,
      friendliness: 92,
      specials: [
        { id: 1, name: "2 for 1 Pizza", description: "Every day", icon: "pizza" },
        { id: 2, name: "Jazz Night", description: "Mondays", icon: "musical-notes" }
      ],
      reviews: [
        {
          id: 1,
          author: "Jess",
          rating: 5,
          text: "Loved the pizza, staff were so friendly. Food came fast & trustworthy. @on time @friendly",
          date: "Feb 2023",
          tags: ["trustworthy", "on time", "friendly"]
        },
        {
          id: 2,
          author: "Hilario",
          rating: 4,
          text: "Terrible anything but food came fast. @on time",
          date: "March 2023",
          tags: ["on time"]
        }
      ]
    };
  }, [businessId]);

  return (
    <div className="min-h-dvh bg-white/90 relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-sage/30 to-sage/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 0.8 }}
          transition={{ duration: 3, delay: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-br from-coral/20 to-coral/5 rounded-full blur-3xl"
        />
      </div>

      {/* Premium Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 bg-white/90 backdrop-blur-xl border-b border-sage/10 px-4 py-6 shadow-sm"
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/home" className="text-charcoal/60 hover:text-charcoal transition-colors duration-300 p-2 hover:bg-charcoal/5 rounded-full">
              <ion-icon name="arrow-back-outline" size="small"></ion-icon>
            </Link>
          </motion.div>

          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-urbanist text-xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-sage to-charcoal"
          >
            {business.name}
          </motion.h1>

          {/* Profile Picture Placeholder */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-sage/20">
              <Image
                src={business.image || 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=100&h=100&fit=crop'}
                alt={`${business.name} profile`}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized={!business.image}
              />
            </div>
          </motion.div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        {/* Premium Business Header */}
        <FadeInUp delay={0.2}>
            <div className="bg-white/90/90 backdrop-blur-lg rounded-[6px] shadow-xl border border-sage/10 p-8 mb-8 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-coral/10 to-transparent rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                  {/* Business Photo Carousel */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex-shrink-0"
                  >
                    <div className="relative w-full lg:w-auto">
                      {/* Main Image */}
                      <div className="w-full h-64 lg:w-96 lg:h-72 rounded-[6px] overflow-hidden ring-4 ring-sage/20">
                        <Image
                          src={business.images?.[currentImageIndex] || business.image || 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop'}
                          alt={`${business.name} photo ${currentImageIndex + 1}`}
                          width={384}
                          height={288}
                          className="w-full h-full object-cover"
                          priority
                          unoptimized
                        />
                      </div>

                      {/* Navigation Controls */}
                      {business.images && business.images.length > 1 && (
                        <>
                          {/* Previous Button */}
                          <button
                            onClick={() => setCurrentImageIndex((prev) => prev === 0 ? business.images.length - 1 : prev - 1)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg z-10"
                          >
                            <ion-icon name="chevron-back" style={{ fontSize: '20px', color: 'var(--charcoal)' }} />
                          </button>

                          {/* Next Button */}
                          <button
                            onClick={() => setCurrentImageIndex((prev) => prev === business.images.length - 1 ? 0 : prev + 1)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg z-10"
                          >
                            <ion-icon name="chevron-forward" style={{ fontSize: '20px', color: 'var(--charcoal)' }} />
                          </button>

                          {/* Dots Indicator */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                            {business.images.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  index === currentImageIndex
                                    ? 'bg-white w-8'
                                    : 'bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>

                  {/* Business Info */}
                  <div className="flex-1 text-center lg:text-left">
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="font-urbanist text-xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-sage to-charcoal mb-4"
                    >
                      {business.name}
                    </motion.h2>

                    {/* Rating */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="flex items-center justify-center lg:justify-start space-x-2 mb-6"
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg"
                      >
                        <ion-icon name="star" style={{ color: 'var(--white)', fontSize: '18px' }} />
                      </motion.div>
                      <span className="font-urbanist text-base font-700 text-charcoal">{business.rating}</span>
                    </motion.div>

                    {/* Trust Metrics */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      className="grid grid-cols-3 gap-6"
                    >
                      {[
                        { label: "Trust", value: business.trust, color: "sage" },
                        { label: "Punctuality", value: business.punctuality, color: "coral" },
                        { label: "Friendliness", value: business.friendliness, color: "sage" }
                      ].map((metric, index) => (
                        <motion.div
                          key={metric.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + (index * 0.1), duration: 0.5 }}
                          className="text-center"
                        >
                          <div className={`w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br ${
                            metric.color === 'sage' ? 'from-sage/20 to-sage/10' : 'from-coral/20 to-coral/10'
                          } flex items-center justify-center`}>
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                              className={`font-urbanist text-base font-700 ${
                                metric.color === 'sage' ? 'text-sage' : 'text-coral'
                              }`}
                            >
                              {metric.value}%
                            </motion.div>
                          </div>
                          <span className="font-urbanist text-sm font-500 text-charcoal/70 capitalize">
                            {metric.label}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
        </FadeInUp>

        {/* Specials & Events */}
        <FadeInUp delay={0.4}>
            <div className="bg-white/90/90 backdrop-blur-lg rounded-[6px] shadow-xl border border-sage/10 p-8 mb-8 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-coral/10 to-transparent rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="font-urbanist text-xl font-600 text-charcoal mb-6 flex items-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                    className="w-8 h-8 bg-gradient-to-br from-coral/20 to-coral/10 rounded-full flex items-center justify-center mr-3"
                  >
                    <ion-icon name="calendar-outline" style={{ color: 'var(--coral)', fontSize: '18px' }} />
                  </motion.div>
                  Specials & Events
                </motion.h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {business.specials.map((special, index) => (
                    <motion.div
                      key={special.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + (index * 0.1), duration: 0.5 }}
                      className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-[6px] p-6 border border-sage/10"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-sage/20 to-sage/10 rounded-[6px] flex items-center justify-center">
                          <ion-icon
                            name={special.icon}
                            style={{ color: 'var(--sage)', fontSize: '28px' }}
                          />
                        </div>
                        <div>
                          <h4 className="font-urbanist text-base font-600 text-charcoal mb-1">
                            {special.name}
                          </h4>
                          <p className="font-urbanist text-sm font-400 text-charcoal/70">
                            {special.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
        </FadeInUp>

        {/* Reviews */}
        <FadeInUp delay={0.6}>
            <div className="bg-white/90/90 backdrop-blur-lg rounded-[6px] shadow-xl border border-sage/10 p-8 mb-8 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="font-urbanist text-xl font-600 text-charcoal flex items-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="w-8 h-8 bg-gradient-to-br from-sage/20 to-sage/10 rounded-full flex items-center justify-center mr-3"
                    >
                      <ion-icon name="chatbubbles-outline" style={{ color: 'var(--sage)', fontSize: '18px' }} />
                    </motion.div>
                    Reviews
                  </motion.h3>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <Link
                      href="review"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-sage to-sage/90 text-white font-urbanist text-sm font-600 py-3 px-6 rounded-full"
                    >
                      <ion-icon name="create-outline" size="small" />
                      <span>Write a Review</span>
                    </Link>
                  </motion.div>
                </div>

                <div className="space-y-6">
                  {business.reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + (index * 0.1), duration: 0.5 }}
                      className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-[6px] p-6 border border-sage/5"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-br from-sage/20 to-sage/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-urbanist text-lg font-700 text-sage">
                            {review.author[0]}
                          </span>
                        </div>

                        <div className="flex-1">
                          {/* Header */}
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 space-y-2 md:space-y-0">
                            <div className="flex items-center space-x-3">
                              <span className="font-urbanist text-lg font-600 text-charcoal">
                                {review.author}
                              </span>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1 + (index * 0.1) + (i * 0.05), duration: 0.3 }}
                                  >
                                    <ion-icon
                                      name={i < review.rating ? "star" : "star-outline"}
                                      style={{
                                        color: i < review.rating ? "var(--coral)" : "#9ca3af",
                                        fontSize: '16px'
                                      }}
                                    />
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                            <span className="font-urbanist text-sm font-400 text-charcoal/60">
                              {review.date}
                            </span>
                          </div>

                          {/* Review Text */}
                          <p className="font-urbanist text-base font-400 text-charcoal/90 leading-relaxed mb-4">
                            {review.text}
                          </p>

                          {/* Tags */}
                          {review.tags && review.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {review.tags.map((tag, tagIndex) => (
                                <motion.span
                                  key={tag}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 1.1 + (index * 0.1) + (tagIndex * 0.05), duration: 0.3 }}
                                  className="inline-flex items-center px-3 py-1 bg-sage/10 text-sage text-sm font-500 rounded-full border border-sage/20"
                                >
                                  <span className="mr-1">@</span>
                                  {tag}
                                </motion.span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
        </FadeInUp>
      </div>
    </div>
  );
}