/**
 * GradientBackground - Usage Examples
 *
 * This file demonstrates how to use the GradientBackground component
 * across different pages and sections of your app.
 */

import GradientBackground from "./GradientBackground";

// ============================================================================
// EXAMPLE 1: Full Page Gradient (Subtle)
// ============================================================================
// Use case: Landing pages, onboarding, marketing pages
export function Example1_FullPageSubtle() {
  return (
    <div className="min-h-screen relative">
      {/* Gradient background */}
      <GradientBackground variant="full" intensity="subtle" color="sage" />

      {/* Your content */}
      <div className="relative z-10 p-8">
        <h1 className="text-4xl font-bold text-charcoal">Welcome to KLIO</h1>
        <p className="text-lg text-charcoal/70">
          Discover local gems with a subtle sage gradient background
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Decorative Blobs (Animated)
// ============================================================================
// Use case: Dashboard, content pages, forms with visual interest
export function Example2_AnimatedBlobs() {
  return (
    <div className="min-h-screen relative bg-white">
      {/* Animated gradient blobs */}
      <GradientBackground
        variant="blobs"
        intensity="medium"
        color="coral"
        animate={true}
      />

      {/* Your content */}
      <div className="relative z-10 max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-charcoal mb-4">
          Write a Review
        </h1>
        <p className="text-lg text-charcoal/70">
          Floating coral blobs add energy to your review form
        </p>
        {/* Form fields here */}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Radial Gradient (Strong Intensity)
// ============================================================================
// Use case: Hero sections, feature highlights, CTAs
export function Example3_RadialStrong() {
  return (
    <div className="min-h-[600px] relative bg-white">
      {/* Strong radial gradient from top-left */}
      <GradientBackground
        variant="radial"
        intensity="strong"
        color="sage"
        animate={false}
      />

      {/* Your content */}
      <div className="relative z-10 flex items-center justify-center h-full p-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-bold text-charcoal mb-6">
            Premium Feature
          </h1>
          <p className="text-xl text-charcoal/80 mb-8">
            Strong radial gradient draws attention to your hero content
          </p>
          <button className="px-8 py-4 bg-sage text-white rounded-full font-semibold hover:bg-sage/90 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Mesh Gradient (Subtle, No Animation)
// ============================================================================
// Use case: About pages, informational sections, subtle backgrounds
export function Example4_MeshSubtle() {
  return (
    <div className="min-h-screen relative bg-white">
      {/* Mesh gradient - multiple gradient points */}
      <GradientBackground
        variant="mesh"
        intensity="subtle"
        color="charcoal"
        animate={false}
      />

      {/* Your content */}
      <div className="relative z-10 max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-charcoal/10">
          <h2 className="text-2xl font-bold text-charcoal mb-4">About Us</h2>
          <p className="text-charcoal/70">
            Mesh gradients create depth without being overwhelming
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-charcoal/10">
          <h2 className="text-2xl font-bold text-charcoal mb-4">Our Mission</h2>
          <p className="text-charcoal/70">
            Perfect for content-heavy pages
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Multiple Colors Layered
// ============================================================================
// Use case: Complex layouts, multi-section pages
export function Example5_LayeredColors() {
  return (
    <div className="min-h-screen relative bg-white">
      {/* Layer 1: Sage blobs (subtle) */}
      <GradientBackground
        variant="blobs"
        intensity="subtle"
        color="sage"
        animate={true}
      />

      {/* Layer 2: Coral accent (medium) - positioned differently via custom class */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 right-10 w-64 h-64 rounded-full animate-float-delayed"
          style={{
            background:
              "radial-gradient(circle, rgba(214, 116, 105, 0.2) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Your content */}
      <div className="relative z-10 p-8">
        <h1 className="text-4xl font-bold text-charcoal mb-4">
          Layered Gradients
        </h1>
        <p className="text-lg text-charcoal/70">
          Combine multiple GradientBackground components for complex effects
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Section-Specific Gradient
// ============================================================================
// Use case: Individual sections within a page
export function Example6_SectionGradient() {
  return (
    <div className="min-h-screen bg-white">
      {/* Section 1: No gradient */}
      <section className="py-20 px-8">
        <h2 className="text-3xl font-bold text-charcoal mb-4">
          Standard Section
        </h2>
        <p className="text-charcoal/70">Clean white background</p>
      </section>

      {/* Section 2: With gradient */}
      <section className="py-20 px-8 relative overflow-hidden">
        <GradientBackground
          variant="full"
          intensity="medium"
          color="sage"
          animate={false}
        />

        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-charcoal mb-4">
            Featured Section
          </h2>
          <p className="text-charcoal/70">
            This section has a gradient background
          </p>
        </div>
      </section>

      {/* Section 3: Different gradient */}
      <section className="py-20 px-8 relative overflow-hidden">
        <GradientBackground
          variant="blobs"
          intensity="subtle"
          color="coral"
          animate={true}
        />

        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-charcoal mb-4">
            Another Section
          </h2>
          <p className="text-charcoal/70">With coral animated blobs</p>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Card/Component Background
// ============================================================================
// Use case: Individual cards, modals, panels
export function Example7_CardGradient() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      {/* Card with internal gradient */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden relative">
        {/* Gradient inside card */}
        <GradientBackground
          variant="radial"
          intensity="medium"
          color="sage"
          animate={false}
          className="rounded-2xl"
        />

        {/* Card content */}
        <div className="relative z-10 p-8">
          <h3 className="text-2xl font-bold text-charcoal mb-4">
            Premium Card
          </h3>
          <p className="text-charcoal/70 mb-6">
            Gradient adds depth to individual components
          </p>
          <button className="w-full px-6 py-3 bg-sage text-white rounded-full font-semibold hover:bg-sage/90 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// QUICK REFERENCE GUIDE
// ============================================================================
/**
 * PROPS QUICK REFERENCE:
 *
 * variant:
 *   - "full" → Linear gradient from top-left to bottom-right
 *   - "blobs" → Multiple floating gradient circles (recommended for most pages)
 *   - "radial" → Single radial gradient from top-left
 *   - "mesh" → Multi-point gradient for depth
 *
 * intensity:
 *   - "subtle" → 15% opacity (minimal, professional)
 *   - "medium" → 30% opacity (balanced, recommended)
 *   - "strong" → 50% opacity (bold, use sparingly)
 *
 * color:
 *   - "sage" → Brand green (primary)
 *   - "coral" → Brand coral/red (accent)
 *   - "charcoal" → Dark neutral (rare use)
 *
 * animate:
 *   - true → Gentle floating animation
 *   - false → Static (better performance, default)
 *
 * BEST PRACTICES:
 * 1. Use "blobs" variant for most pages (best visual interest)
 * 2. Start with "medium" intensity, adjust as needed
 * 3. Enable animation only on hero/landing pages
 * 4. Always set position: relative on parent container
 * 5. Add `relative z-10` to content to ensure it sits above gradient
 */
