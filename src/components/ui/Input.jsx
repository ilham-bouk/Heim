const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all ${className}`}
      {...props}
    />
  );
}

export default Input;