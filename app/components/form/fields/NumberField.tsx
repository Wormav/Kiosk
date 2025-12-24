import { NumberInput } from "@mantine/core";

interface Props {
  form: any;
  name: string;
  unit?: string | null;
}

export const NumberField = ({ form, name, unit }: Props) => (
  <form.Field name={name}>
    {(field: any) => (
      <NumberInput
        value={field.state.value ?? ""}
        onChange={(val) => field.handleChange(val)}
        onBlur={field.handleBlur}
        suffix={unit || undefined}
        decimalScale={2}
        allowDecimal
        hideControls
      />
    )}
  </form.Field>
);
