/**
 * Base text input primitive — thin wrapper applying the design system's
 * border/focus styles. Spread native input props (type, value, onChange...) onto it.
 * @param {string} [className] - extra classes appended after the defaults
 */
const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${className}`}
      {...props}
    />
  );
}

export default Input;