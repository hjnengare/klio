"use client";

import Link from "next/link";
import { useState } from "react";
import {
    ArrowLeft,
    Store,
    Plus,
    BarChart3,
    MessageSquare,
} from "lucide-react";

// Import components
import { 
    BusinessStatsCard, 
    BusinessListCard, 
    QuickActionCard, 
    WelcomeSection,
    type Business 
} from "./components";

// CSS animations to match the design schema
const animations = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideInFromTop {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }
  
  .animate-slide-in-top {
    animation: slideInFromTop 0.5s ease-out forwards;
  }
  
  .animate-delay-100 { animation-delay: 0.1s; opacity: 0; }
  .animate-delay-200 { animation-delay: 0.2s; opacity: 0; }
  .animate-delay-300 { animation-delay: 0.3s; opacity: 0; }
`;

export default function ManageBusinessPage() {
    // Mock data for business owner's businesses
    const [businesses] = useState<Business[]>([
        {
            id: "1",
            name: "Mama's Kitchen",
            category: "Restaurant",
            status: "active",
            rating: 4.8,
            reviews: 127,
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
            lastUpdated: "2 hours ago",
            pendingReviews: 3,
            verificationStatus: "verified",
        },
        {
            id: "2",
            name: "Sunset Yoga Studio",
            category: "Wellness",
            status: "active",
            rating: 4.9,
            reviews: 89,
            image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
            lastUpdated: "1 day ago",
            pendingReviews: 1,
            verificationStatus: "verified",
        },
        {
            id: "3",
            name: "Artisan Bakery & Café",
            category: "Bakery",
            status: "pending",
            rating: 0,
            reviews: 0,
            image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop",
            lastUpdated: "3 days ago",
            pendingReviews: 0,
            verificationStatus: "pending",
        },
    ]);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: animations }} />
            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            {/* SF Pro Font Setup */}
            <style jsx global>{`
                .font-urbanist {
                    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
                        "SF Pro Display", "Helvetica Neue", Helvetica, Arial, system-ui,
                        sans-serif;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
                }
            `}</style>
            <div
                className="min-h-dvh bg-off-white relative overflow-hidden font-urbanist"
                style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                }}
            >
                {/* Fixed Premium Header */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-navbar-bg/95 backdrop-blur-sm border-b border-charcoal/10 animate-slide-in-top"
                    style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                    }}
                >
                    <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <Link
                                href="/home"
                                className="group flex items-center"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-charcoal/5 hover:border-sage/20 mr-3 sm:mr-4">
                                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-sage transition-colors duration-300" />
                                </div>
                                <h1 className="font-urbanist text-sm font-700 text-white transition-all duration-300 group-hover:text-white/80 relative">
                                    Manage Business
                                </h1>
                            </Link>

                            <Link
                                href="/claim-business"
                                className="bg-sage hover:bg-sage/90 text-white px-4 py-2 rounded-full text-sm font-600 font-urbanist transition-all duration-300 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Business
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="bg-gradient-to-b from-off-white/0 via-off-white/50 to-off-white">
                    <div className="py-1 pt-20">
                        <section
                            className="relative"
                            style={{
                                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
                            }}
                        >
                            <div className="container mx-auto max-w-[1300px] px-4 sm:px-6 relative z-10">
                                <div className="max-w-6xl mx-auto pt-8 pb-8">
                    <div className="space-y-6">
                        {/* Welcome Section */}
                        <WelcomeSection />

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <BusinessStatsCard
                                icon={Store}
                                label="Total Businesses"
                                value={businesses.length}
                                color="sage"
                                delay={200}
                            />
                            <BusinessStatsCard
                                icon={MessageSquare}
                                label="Pending Reviews"
                                value={businesses.reduce((sum, business) => sum + business.pendingReviews, 0)}
                                color="coral"
                                delay={200}
                            />
                            <BusinessStatsCard
                                icon={BarChart3}
                                label="Avg Rating"
                                value={businesses.filter(b => b.rating > 0).length > 0 
                                    ? (businesses.filter(b => b.rating > 0).reduce((sum, business) => sum + business.rating, 0) / businesses.filter(b => b.rating > 0).length).toFixed(1)
                                    : "N/A"
                                }
                                color="sage"
                                delay={200}
                            />
                        </div>

                        {/* Business List */}
                        <BusinessListCard businesses={businesses} />

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <QuickActionCard
                                href="/claim-business"
                                icon={Plus}
                                title="Claim Business"
                                description="Claim an existing business or add a new one to your portfolio."
                                color="sage"
                                delay={0}
                            />
                            <QuickActionCard
                                href="/analytics"
                                icon={BarChart3}
                                title="Analytics"
                                description="View detailed analytics and performance metrics for your businesses."
                                color="coral"
                                delay={0}
                            />
                        </div>
                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
