interface Props {
  form: any;
  name: string;
  unit?: string | null;
}

export const NumberField = ({ form, name, unit }: Props) => (
  <form.Field name={name}>
    {(field: any) => (
      <div className="relative">
        <input
          type="number"
          step="any"
          value={field.state.value ?? ""}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {unit}
          </span>
        )}
      </div>
    )}
  </form.Field>
);
