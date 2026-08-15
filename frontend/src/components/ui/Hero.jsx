import React from 'react';
import { ArrowRight, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from './Button';

/**
 * Full-Width Corporate Government Hero Component
 */
export const Hero = ({
  tag = "GOVERNMENT OF JHARKHAND — OFFICIAL CIVIC PORTAL",
  title = "Jharkhand Civic Issue Reporting & Resolution System",
  subtitle = "Empowering citizens with direct, transparent reporting of civic infrastructure issues. Automated AI-triage routes real-time GPS reports directly to municipal departments for fast on-ground resolution.",
  onPrimaryClick,
  primaryButtonText = "Report an Issue",
  onSecondaryClick,
  secondaryButtonText = "Admin Dashboard",
}) => {
  return (
    <section className="relative bg-gov-navy text-white overflow-hidden border-b border-gov-navy-light">
      {/* Subtle geometric grid background overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          {/* Government Department Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-md text-xs font-bold tracking-widest text-gov-accent uppercase mb-6 backdrop-blur-xs">
            <Shield className="w-3.5 h-3.5 text-gov-accent" />
            <span>{tag}</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-none">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {subtitle}
          </p>

          {/* Action Row */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {onPrimaryClick && (
              <Button
                variant="accent"
                size="lg"
                onClick={onPrimaryClick}
                icon={ArrowRight}
                iconPosition="right"
                className="font-black"
              >
                {primaryButtonText}
              </Button>
            )}

            {onSecondaryClick && (
              <Button
                variant="outline"
                size="lg"
                onClick={onSecondaryClick}
                className="border-white/40 text-white hover:bg-white hover:text-gov-navy"
              >
                {secondaryButtonText}
              </Button>
            )}
          </div>

          {/* Key Bullet Highlights */}
          <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gov-accent flex-shrink-0" />
              <span>Real-Time GPS Tagging</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gov-accent flex-shrink-0" />
              <span>AI Auto-Categorization</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gov-accent flex-shrink-0" />
              <span>Live Municipal Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
