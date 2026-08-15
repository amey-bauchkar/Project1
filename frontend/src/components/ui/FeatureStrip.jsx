import React from 'react';
import { Camera, MapPin, Cpu, CheckCircle, ArrowRight } from 'lucide-react';
import Card from './Card';

/**
 * 4-Card Corporate Feature Strip Component
 */
export const FeatureStrip = ({ onCardAction }) => {
  const features = [
    {
      icon: Camera,
      title: "Mobile Evidence Capture",
      description: "Direct camera upload with high-resolution photo evidence verification.",
      variant: "navy",
      actionText: "Snap Photo",
      actionKey: "photo",
    },
    {
      icon: MapPin,
      title: "High-Precision GPS",
      description: "Automated geofence coordinates mapped directly for on-ground field personnel.",
      variant: "white",
      actionText: "View Map",
      actionKey: "map",
    },
    {
      icon: Cpu,
      title: "Groq AI Auto-Triage",
      description: "Vision AI model classifies department and assigns urgency scores in under 2 seconds.",
      variant: "mutedBlue",
      actionText: "Triage Engine",
      actionKey: "triage",
    },
    {
      icon: CheckCircle,
      title: "Transparent Resolution",
      description: "Live Kanban workflow tracking from submission to verified departmental completion.",
      variant: "white",
      actionText: "Track Status",
      actionKey: "status",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          const isDark = feature.variant === 'navy' || feature.variant === 'mutedBlue';
          
          return (
            <Card
              key={idx}
              variant={feature.variant}
              padding="md"
              hoverable
              className="flex flex-col justify-between"
              onClick={() => onCardAction && onCardAction(feature.actionKey)}
            >
              <div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                  feature.variant === 'navy' 
                    ? 'bg-white/10 text-gov-accent' 
                    : feature.variant === 'mutedBlue'
                    ? 'bg-white/15 text-white'
                    : 'bg-gov-surface text-gov-navy border border-gov-border'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className={`text-base font-bold tracking-tight mb-1.5 ${isDark ? 'text-white' : 'text-gov-navy'}`}>
                  {feature.title}
                </h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-gov-text-body'}`}>
                  {feature.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-current/10 flex items-center gap-1 text-xs font-bold">
                <span className={feature.variant === 'navy' ? 'text-gov-accent' : isDark ? 'text-white' : 'text-gov-navy'}>
                  {feature.actionText}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureStrip;
