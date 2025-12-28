import { Textarea } from "@mantine/core";

interface Props {
  form: any;
  name: string;
}

export const TextField = ({ form, name }: Props) => (
  <form.Field name={name}>
    {(field: any) => (
      <Textarea
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        minRows={3}
        autosize
      />
    )}
  </form.Field>
);
