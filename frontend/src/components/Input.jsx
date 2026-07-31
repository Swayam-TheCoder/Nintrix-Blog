function Input({
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="
      w-full
      rounded-xl
      border
      border-slate-700
      bg-slate-900/80
      px-4
      py-3
      text-white
      placeholder:text-slate-400
      backdrop-blur-md
      transition-all
      duration-300

      focus:border-emerald-400
      focus:ring-2
      focus:ring-emerald-400/30
      focus:outline-none

      hover:border-slate-500
      "
    />
  );
}

export default Input;