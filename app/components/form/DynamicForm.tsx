import { Button, Divider, Group, Stack } from "@mantine/core";
import { useForm } from "@tanstack/react-form";
import { useSubmit } from "react-router";
import type { QuestionNode } from "~/lib/types";
import { QuestionGroup } from "./QuestionGroup";

interface Props {
  questions: QuestionNode[];
  sessionId: string;
  defaultValues?: Record<string, unknown>;
}

const flattenAnswers = (
  values: Record<string, unknown>,
): {
  questionId: string;
  value: string;
  rowIndex?: number;
  rowLabel?: string;
}[] => {
  const results: {
    questionId: string;
    value: string;
    rowIndex?: number;
    rowLabel?: string;
  }[] = [];

  const processValue = (
    key: string,
    value: unknown,
    rowIndex?: number,
    rowLabel?: string,
  ) => {
    if (value === undefined || value === null || value === "") return;

    if (typeof value === "object" && !Array.isArray(value)) {
      // Nested object (e.g., table row fields)
      const rowObj = value as Record<string, unknown>;
      const currentRowLabel = rowObj["_rowLabel"] as string | undefined;

      for (const [nestedKey, nestedValue] of Object.entries(rowObj)) {
        // Skip _rowLabel as it's metadata, not a question answer
        if (nestedKey === "_rowLabel") continue;
        processValue(
          nestedKey,
          nestedValue,
          rowIndex,
          currentRowLabel || rowLabel,
        );
      }
    } else if (Array.isArray(value)) {
      // Array of rows (table data)
      value.forEach((row, index) => {
        if (row && typeof row === "object") {
          processValue(key, row, index);
        }
      });
    } else {
      // Primitive value
      results.push({
        questionId: key,
        value: String(value),
        rowIndex,
        rowLabel,
      });
    }
  };

  for (const [key, value] of Object.entries(values)) {
    processValue(key, value);
  }

  return results;
};

export const DynamicForm = ({
  questions,
  sessionId,
  defaultValues = {},
}: Props) => {
  const submit = useSubmit();

  const form = useForm({
    defaultValues: defaultValues as Record<string, unknown>,
    onSubmit: async ({ value }) => {
      const answers = flattenAnswers(value);
      const formData = new FormData();
      formData.set("sessionId", sessionId);
      formData.set("answers", JSON.stringify(answers));
      submit(formData, { method: "post" });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <Stack gap="xl">
        <QuestionGroup questions={questions} form={form} />

        <Divider />

        <Group justify="flex-end">
          <Button type="submit" size="md">
            Sauvegarder
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
