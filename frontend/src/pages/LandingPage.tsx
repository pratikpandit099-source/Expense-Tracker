import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar.js';
import { Button } from '../components/common/Button.js';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  PieChart,
  Lock,
  Layers,
  Sparkles,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-emerald-500" />,
      title: 'Sub-15-Second Logging',
      description:
        'Engineered for speed. Log any expenditure with smart category presets, validated amounts, and tags without cognitive friction.',
    },
    {
      icon: <PieChart className="w-6 h-6 text-indigo-500" />,
      title: 'Real-Time Aggregations',
      description:
        'MongoDB pipeline-powered analytics summarize category distributions, monthly comparisons, and rolling spending trends instantly.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-teal-500" />,
      title: 'Strict Tenant Isolation',
      description:
        'Every query is scoped strictly to your account at the database layer. Cross-tenant access is rejected with non-revealing 404s.',
    },
    {
      icon: <Lock className="w-6 h-6 text-amber-500" />,
      title: 'Dual-Token JWT Security',
      description:
        'Bcrypt-hashed credentials, short-lived in-memory access tokens, and rotated httpOnly refresh cookies defend against XSS and CSRF.',
    },
    {
      icon: <Layers className="w-6 h-6 text-purple-500" />,
      title: 'Integer Cents Precision',
      description:
        'Financial computations are calculated in minor currency units (cents), eliminating floating-point rounding errors and math drift.',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-rose-500" />,
      title: 'Multi-Dimension Filtering',
      description:
        'Debounced search, date-range bounding, category filtering, and customizable sorting on paginated transaction histories.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Glow background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wide animate-in fade-in-0 duration-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built for Modern Personal Finance Management</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Take command of your spending with <span className="text-emerald-500">ExpenseFlow</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The high-performance personal expense tracker built with clean architecture, enterprise-grade tenant isolation, and instant analytics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Create Free Account
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-slate-300 dark:border-slate-700 font-semibold"
              >
                Sign In to Account
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 pt-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Full Tenant Isolation
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free & Open
            </span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Architected for Precision, Speed, and Security
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Every layer of ExpenseFlow was designed following modern full-stack engineering standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 space-y-3"
              >
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to streamline your financial journey?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Join thousands of users tracking their daily spending with zero hassle. Set up your personal ledger in seconds.
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button size="lg" className="shadow-emerald-500/30">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ExpenseFlow. Built with React 19, TypeScript, Express, and MongoDB.</p>
          <p className="font-mono text-[11px]">Production-Ready Portfolio Edition</p>
        </div>
      </footer>
    </div>
  );
};
