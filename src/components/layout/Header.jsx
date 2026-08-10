import { useState } from 'react';
import { Menu, X, Heart, User, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'About Us', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

/* Badge dot shared by cart and wishlist icons */
const Badge = ({ count }) =>
  count > 0 ? (
    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-semibold text-accent-foreground flex items-center justify-center leading-none">
      {count > 99 ? '99+' : count}
    </span>
  ) : null;

/* ─── Header ──────────────────────────────────────────────────────────── */
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const { itemCount }      = useCart();
  const { wishlistCount }  = useWishlist();

  const isActive = (href) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  const closeMobile = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">

        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link
            to="/"
            className="-m-1.5 p-1.5 text-2xl font-bold tracking-tight text-foreground"
          >
            Heim
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(prev => !prev)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop nav links */}
        <div className="hidden lg:flex lg:gap-x-8">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`relative text-sm font-medium transition-colors pb-0.5 ${
                isActive(item.href)
                  ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground after:rounded-full'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop icon actions */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-1">

          <Link
            to="/wishlist"
            aria-label={`Wishlist (${wishlistCount} items)`}
            className="relative inline-flex items-center justify-center p-2.5 rounded-lg text-foreground/60 hover:text-foreground hover:bg-accent/5 transition-all"
          >
            <Heart className="h-5 w-5" />
            <Badge count={wishlistCount} />
          </Link>

          <Link
            to="/signin"
            aria-label="Account"
            className="relative inline-flex items-center justify-center p-2.5 rounded-lg text-foreground/60 hover:text-foreground hover:bg-accent/5 transition-all"
          >
            <User className="h-5 w-5" />
          </Link>

          <Link
            to="/cart"
            aria-label={`Cart (${itemCount} items)`}
            className="relative inline-flex items-center justify-center p-2.5 rounded-lg text-foreground/60 hover:text-foreground hover:bg-accent/5 transition-all"
          >
            <ShoppingBag className="h-5 w-5" />
            <Badge count={itemCount} />
          </Link>

        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-border">
          <div className="px-4 pt-3 pb-5 space-y-0.5">

            {/* Nav links */}
            {NAV_LINKS.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeMobile}
                className={`flex items-center py-2.5 text-base font-medium transition-colors rounded-md px-2 ${
                  isActive(item.href)
                    ? 'text-foreground bg-accent/5'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent/5'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Icon actions */}
            <div className="flex items-center gap-2 pt-4 mt-2 border-t border-border">
              <Link
                to="/wishlist"
                onClick={closeMobile}
                aria-label={`Wishlist (${wishlistCount} items)`}
                className="relative inline-flex items-center justify-center p-2.5 rounded-lg text-foreground/70 hover:text-foreground hover:bg-accent/5 transition-all"
              >
                <Heart className="h-5 w-5" />
                <Badge count={wishlistCount} />
              </Link>

              <Link
                to="/signin"
                onClick={closeMobile}
                aria-label="Account"
                className="relative inline-flex items-center justify-center p-2.5 rounded-lg text-foreground/70 hover:text-foreground hover:bg-accent/5 transition-all"
              >
                <User className="h-5 w-5" />
              </Link>

              <Link
                to="/cart"
                onClick={closeMobile}
                aria-label={`Cart (${itemCount} items)`}
                className="relative inline-flex items-center justify-center p-2.5 rounded-lg text-foreground/70 hover:text-foreground hover:bg-accent/5 transition-all"
              >
                <ShoppingBag className="h-5 w-5" />
                <Badge count={itemCount} />
              </Link>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;