import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button.js';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="p-5 rounded-3xl bg-emerald-500/10 text-emerald-500 mb-6">
        <Compass className="w-16 h-16 animate-pulse" />
      </div>
      <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-slate-100 mb-3 tracking-tight font-mono">
        404
      </h1>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
        Page Not Found
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8">
        The financial coordinates you entered do not exist or may have moved.
      </p>
      <Link to="/dashboard">
        <Button leftIcon={<Home className="w-4 h-4" />}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
