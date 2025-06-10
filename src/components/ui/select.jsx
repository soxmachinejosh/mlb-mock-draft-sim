export function Select({ value, onChange, children }) {
  return (
    <select value={value} onChange={onChange} className="p-2 rounded border">
      {children}
    </select>
  );
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}