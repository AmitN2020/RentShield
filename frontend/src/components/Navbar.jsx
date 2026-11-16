import React from 'react';
import { Shield } from 'lucide-react';

export default function Navbar({ onReset }) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div
          onClick={onReset}
          className="flex items-center space-x-3 cursor-pointer group"
          id="nav-brand-logo"
        >
          {/* Minimalist Monochrome Shield Logo */}
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-zinc-200 transition-colors">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-white">
                RentShield
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
