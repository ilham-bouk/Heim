import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

const Breadcrumb = ({ items, maxWidthClassName = 'max-w-7xl' }) => (
  <div className="bg-slate-50 border-b border-slate-200">
    <div className={`${maxWidthClassName} mx-auto px-4 lg:px-8 py-4`}>
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        {items.map((item) => (
          <span key={item.label} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
            {item.href ? (
              <Link to={item.href} className="hover:text-slate-900 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900 font-medium line-clamp-1">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </div>
  </div>
);

export default Breadcrumb;