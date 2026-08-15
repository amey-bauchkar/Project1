import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../tanmay/context/AuthContext';
import AdminDashboard from '../purva/components/AdminDashboard';
import useIssues from '../purva/hooks/useIssues';
import { Hero, FeatureStrip, Card, Badge, Button, CategoryAnalyticsCard } from './components/ui';
import { BarChart3, Monitor, Shield, Sparkles, Building2, MapPin, CheckCircle2, LayoutDashboard, PlusCircle } from 'lucide-react';

export const UnifiedPortal = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { issues } = useIssues();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'admin'

  const handleHeroAction = () => {
    navigate('/report');
  };

  return (
    <div className="min-h-screen bg-gov-surface text-gov-text-body font-sans pb-20">
      
      {/* 1. Full-Width Corporate Hero Banner */}
      <Hero
        tag="GOVERNMENT OF JHARKHAND • OFFICIAL CIVIC PORTAL"
        title="Jharkhand Civic Issue Reporting & Resolution System"
        subtitle="Empowering citizens with direct, transparent reporting of civic infrastructure issues. Automated AI-triage routes real-time GPS reports directly to municipal departments for fast on-ground resolution."
        onPrimaryClick={handleHeroAction}
        primaryButtonText="Submit Grievance Report"
        onSecondaryClick={() => {
          const el = document.getElementById('portal-content-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        secondaryButtonText="Municipal Operations"
      />

      {/* 2. 4-Card Feature Strip */}
      <FeatureStrip
        onCardAction={(key) => {
          if (key === 'photo' || key === 'triage') navigate('/report');
          else {
            const el = document.getElementById('portal-content-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* 3. Main Interactive Command Console */}
      <section id="portal-content-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Section Header & View Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 mb-8 border-b border-gov-border">
          <div>
            <span className="text-[11px] font-bold text-gov-navy uppercase tracking-widest bg-gov-accent/20 px-2.5 py-1 rounded border border-gov-accent-dark/30">
              Interactive Command Console
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight mt-2 uppercase">
              Civic Operations & Analytics
            </h2>
            <p className="text-xs sm:text-sm text-gov-muted mt-1 font-medium">
              Real-time departmental grievance distribution, geospatial monitoring, and resolution Kanban triage.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <Button
              variant="accent"
              size="sm"
              onClick={() => navigate('/report')}
              icon={PlusCircle}
              className="font-extrabold uppercase tracking-wider text-xs shadow-soft"
            >
              Report New Issue
            </Button>
          </div>
        </div>

        {/* Content Layouts: Left Category Pie Chart Analytics, Right Municipal Triage Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Category Breakdown Pie Chart & Analytics (4.5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-gov-navy flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-gov-navy" />
                <span>Departmental Distribution</span>
              </span>
              <Badge variant="surface" size="xs">
                Live Data
              </Badge>
            </div>

            {/* Reusable Donut Pie Chart Component */}
            <CategoryAnalyticsCard issues={issues} />
          </div>

          {/* Right Column: Municipal Operations Dashboard (7.5 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-xl p-5 sm:p-7 shadow-card border border-gov-border">
            <AdminDashboard />
          </div>

        </div>

      </section>

    </div>
  );
};

export default UnifiedPortal;
