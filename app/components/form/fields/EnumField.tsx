interface Props {
  form: any;
  name: string;
  options: { id: string; label: string }[];
}

export const EnumField = ({ form, name, options }: Props) => (
  <form.Field name={name}>
    {(field: any) => (
      <select
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
      >
        <option value="">-- Sélectionner --</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    )}
  </form.Field>
);
