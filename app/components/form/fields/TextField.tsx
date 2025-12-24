interface Props {
  form: any;
  name: string;
}

export const TextField = ({ form, name }: Props) => (
  <form.Field name={name}>
    {(field: any) => (
      <textarea
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-y"
      />
    )}
  </form.Field>
);
