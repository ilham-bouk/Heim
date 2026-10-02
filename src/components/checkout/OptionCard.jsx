/**
 * A selectable card built on a native radio input (keyboard + screen-reader
 * friendly). Render several inside a <fieldset> that shares the same `name`.
 */
const OptionCard = ({ name, value, checked, onChange, children }) => (
  <label
    className={`relative block cursor-pointer rounded-lg border p-5 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-primary ${
      checked ? 'border-primary bg-secondary' : 'border-border hover:border-muted-foreground'
    }`}
  >
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="absolute top-4 right-4 h-4 w-4 accent-primary"
    />
    {children}
  </label>
);

export default OptionCard;