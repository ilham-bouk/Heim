import { useState } from 'react';
import { Menu, X, Search, User, ShoppingBag, House } from 'lucide-react';
import { Link } from 'react-router';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    // 
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5" >
            <span className="text-2xl font-bold tracking-tight text-foreground">Heim</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navLinks.map((item) => (
            <div key={item.name} className="relative group">
              <Link
                to={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Right side icons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <button className="font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-accent/50">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </button>
          <button className="font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-accent/50">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </button>
          <button className="font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center px-3 py-2 text-sm relative text-foreground/80 hover:text-foreground hover:bg-accent/50">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-medium text-accent-foreground flex items-center justify-center">
              3
            </span>
            <span className="sr-only">Cart</span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-4 pb-4">
            {navLinks.map((item) => (
              <div key={item.name}>
                <Link
                  to={item.href}
                  className="block py-2 text-base font-medium text-foreground/80 hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </div>
            ))}

            <div className="flex gap-4 pt-4 border-t border-border">
              <button className="font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center text-slate-900 hover:bg-accent/50 px-3 py-2 text-sm">
                <Search className="h-5 w-5" />
              </button>
              <button className="font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center text-slate-900 hover:bg-accent/50 px-3 py-2 text-sm">
                <User className="h-5 w-5" />
              </button>
              <button className="relative font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center text-slate-900 hover:bg-accent/50 px-3 py-2 text-sm">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-medium text-accent-foreground flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;