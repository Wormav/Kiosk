import { Card, Stack, Text } from "@mantine/core";
import type { Locale } from "~/.server/locale.server";
import type { QuestionNode } from "~/lib/types";
import { EnumField } from "./fields/EnumField";
import { NumberField } from "./fields/NumberField";
import { TableField } from "./fields/TableField";
import { TextField } from "./fields/TextField";
import { QuestionGroup } from "./QuestionGroup";

interface Props {
  question: QuestionNode;
  form: any;
  locale: Locale;
}

export const QuestionField = ({ question, form, locale }: Props) => {
  const { contentType, label, children } = question;

  // Grouping section (no contentType)
  if (!contentType && children.length > 0) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={600} size="xl" mb="md">
          {label}
        </Text>
        <QuestionGroup questions={children} form={form} locale={locale} />
      </Card>
    );
  }

  // Table
  if (contentType === "table") {
    return <TableField question={question} form={form} locale={locale} />;
  }

  // Simple fields
  return (
    <Stack gap="xs">
      <Text fw={500} size="sm">
        {label}
        {question.unit && (
          <Text span c="dimmed" ml={4}>
            ({question.unit})
          </Text>
        )}
      </Text>

      {contentType === "number" && (
        <NumberField form={form} name={question.id} unit={question.unit} />
      )}

      {contentType === "text" && <TextField form={form} name={question.id} />}

      {contentType === "enum" && (
        <EnumField
          form={form}
          name={question.id}
          options={question.enumOptions || []}
        />
      )}
    </Stack>
  );
};
