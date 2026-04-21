const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800',
    outline: 'border-2 border-slate-900 text-slate-900 hover:bg-slate-50',
    ghost: 'text-slate-900 hover:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;