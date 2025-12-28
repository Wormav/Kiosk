import { Select } from "@mantine/core";

interface Props {
  form: any;
  name: string;
  options: { id: string; label: string }[];
}

export const EnumField = ({ form, name, options }: Props) => (
  <form.Field name={name}>
    {(field: any) => (
      <Select
        value={field.state.value ?? null}
        onChange={(val) => field.handleChange(val)}
        onBlur={field.handleBlur}
        data={options.map((opt) => ({ value: opt.id, label: opt.label }))}
        placeholder="-- Sélectionner --"
        clearable
      />
    )}
  </form.Field>
);
