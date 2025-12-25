import {
  Alert,
  Button,
  Divider,
  Group,
  Stack,
  Transition,
} from "@mantine/core";
import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { Link, useFetcher } from "react-router";
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
  const fetcher = useFetcher<{ success?: boolean }>();
  const [showSuccess, setShowSuccess] = useState(false);
  const isSubmitting = fetcher.state === "submitting";

  // Show success message when action completes
  useEffect(() => {
    if (fetcher.data?.success) {
      setShowSuccess(true);
    }
  }, [fetcher.data]);

  const form = useForm({
    defaultValues: defaultValues as Record<string, unknown>,
    onSubmit: async ({ value }) => {
      setShowSuccess(false);
      const answers = flattenAnswers(value);
      const formData = new FormData();
      formData.set("sessionId", sessionId);
      formData.set("answers", JSON.stringify(answers));
      fetcher.submit(formData, { method: "post" });
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

        <Transition mounted={showSuccess} transition="fade" duration={300}>
          {(styles) => (
            <Alert
              style={styles}
              color="green"
              title="Formulaire enregistré"
              withCloseButton
              onClose={() => setShowSuccess(false)}
            >
              <Stack gap="md">
                <span>Vos réponses ont été sauvegardées avec succès.</span>
                <Group gap="sm">
                  <Button
                    component={Link}
                    to="/"
                    variant="filled"
                    color="blue"
                    size="sm"
                  >
                    Nouveau formulaire
                  </Button>
                  <Button
                    component={Link}
                    to="/sessions"
                    variant="light"
                    size="sm"
                  >
                    Voir les sessions
                  </Button>
                </Group>
              </Stack>
            </Alert>
          )}
        </Transition>

        <Group justify="flex-end">
          <Button type="submit" size="md" loading={isSubmitting}>
            Sauvegarder
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
