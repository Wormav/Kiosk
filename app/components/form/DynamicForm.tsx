import { Button, Divider, Group, Stack } from "@mantine/core";
import { useForm } from "@tanstack/react-form";
import { useSubmit } from "react-router";
import type { QuestionNode } from "~/lib/types";
import { QuestionGroup } from "./QuestionGroup";

interface Props {
  questions: QuestionNode[];
  sessionId: string;
}

const flattenAnswers = (
  values: Record<string, unknown>,
): { questionId: string; value: string; rowIndex?: number }[] => {
  const results: { questionId: string; value: string; rowIndex?: number }[] =
    [];

  for (const [key, value] of Object.entries(values)) {
    if (Array.isArray(value)) {
      value.forEach((row, index) => {
        if (row && typeof row === "object") {
          for (const [fieldKey, fieldValue] of Object.entries(
            row as Record<string, unknown>,
          )) {
            results.push({
              questionId: fieldKey,
              value: String(fieldValue ?? ""),
              rowIndex: index,
            });
          }
        }
      });
    } else if (value !== undefined && value !== "" && value !== null) {
      results.push({
        questionId: key,
        value: String(value),
      });
    }
  }

  return results;
};

export const DynamicForm = ({ questions, sessionId }: Props) => {
  const submit = useSubmit();

  const form = useForm({
    defaultValues: {} as Record<string, unknown>,
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
