import { Link } from 'react-router';
import { ShoppingBag } from 'lucide-react';

const AuthLayout = ({ quote, subtext, children }) => {
  return (
    <div className="min-h-screen bg-white flex">

      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-slate-800 flex-col justify-between p-14 xl:p-20 relative overflow-hidden shrink-0">        
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Decorative rings */}
        <div className="absolute -bottom-40 -right-40 w-120 h-120 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute top-24 -left-20 w-56 h-56 rounded-full border border-white/10 pointer-events-none" />

        {/* Brand */}
        <Link to="/" className="relative z-10 flex items-center gap-3 w-fit">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <ShoppingBag className="w-5 h-5 text-slate-900" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Heim</span>
        </Link>

        {/* Quote */}
        <div className="relative z-10">
          <div className="w-10 h-px bg-white/30 mb-6" />
          <blockquote className="text-white/90 text-2xl xl:text-3xl font-light leading-relaxed mb-5">
            "{quote}"
          </blockquote>
          <p className="text-white/45 text-sm">{subtext}</p>
        </div>

        {/* Trust signals */}
        <div className="relative z-10 space-y-3">
          {[
            'Free shipping on orders over $100',
            '30-day hassle-free returns',
            '2-year warranty on all products',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
              <span className="text-white/50 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-14 sm:px-10 lg:px-14 xl:px-20 overflow-y-auto">
        <div className="w-full max-w-105">

          {/* Mobile brand */}
          <Link to="/" className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-900 font-bold text-lg tracking-tight">Heim</span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;