
import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 max-w-2xl animate-pulse">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-32 bg-slate-200 rounded"></div>
        <div className="h-4 w-4 bg-slate-200 rounded-full"></div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
      </div>
      <div className="bg-slate-100/50 rounded-xl p-4 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-3 bg-slate-200 rounded w-full"></div>
      </div>
      <div className="flex justify-center text-xs text-slate-400 font-medium tracking-wide italic">
        Consulting medical guidelines and meta-analyses...
      </div>
    </div>
  );
};

export default SkeletonLoader;
