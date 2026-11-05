import React from 'react';
import { GraduationCap, Users } from 'lucide-react';

export default function Navbar({ studentCount = 0 }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Student Portal</h1>
            <p className="text-xs text-slate-500 font-medium">Student Records Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold">
          <Users className="w-3.5 h-3.5 text-indigo-600" />
          <span>Total Students:</span>
          <span className="px-1.5 py-0.5 bg-indigo-600 text-white rounded-full text-[11px]">
            {studentCount}
          </span>
        </div>
      </div>
    </header>
  );
}
