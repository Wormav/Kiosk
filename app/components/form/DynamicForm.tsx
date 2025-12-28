import {
  Alert,
  Button,
  Collapse,
  Divider,
  Group,
  Stack,
  Transition,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBinaryTree, IconX } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { Link, useFetcher } from "react-router";
import type { Locale } from "~/.server/locale.server";
import { t } from "~/lib/i18n";
import type { QuestionNode } from "~/lib/types";
import { QuestionGroup } from "./QuestionGroup";
import { TreeVisualization } from "./TreeVisualization";

interface Props {
  questions: QuestionNode[];
  sessionId: string;
  defaultValues?: Record<string, unknown>;
  locale: Locale;
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
  locale,
}: Props) => {
  const fetcher = useFetcher<{ success?: boolean }>();
  const [showSuccess, setShowSuccess] = useState(false);
  const [treeOpened, { toggle: toggleTree }] = useDisclosure(false);
  const isSubmitting = fetcher.state === "submitting";

  // Reset success state when session changes
  useEffect(() => {
    setShowSuccess(false);
  }, [sessionId]);

  // Show success message when action completes
  useEffect(() => {
    console.log("Fetcher state:", fetcher.state, "data:", fetcher.data);
    if (fetcher.state === "idle" && fetcher.data?.success) {
      console.log("Setting showSuccess to true");
      setShowSuccess(true);
    }
  }, [fetcher.state, fetcher.data]);

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
        {/* Toggle button for tree visualization */}
        <Button
          variant={treeOpened ? "filled" : "light"}
          color={treeOpened ? "red" : "blue"}
          leftSection={
            treeOpened ? <IconX size={18} /> : <IconBinaryTree size={18} />
          }
          onClick={toggleTree}
          size="sm"
          style={{ alignSelf: "flex-start" }}
        >
          {treeOpened ? t("hideTree", locale) : t("showTree", locale)}
        </Button>

        {/* Collapsible tree visualization */}
        <Collapse in={treeOpened}>
          <TreeVisualization questions={questions} locale={locale} />
        </Collapse>

        <QuestionGroup questions={questions} form={form} locale={locale} />

        <Divider />

        <Transition mounted={showSuccess} transition="fade" duration={300}>
          {(styles) => (
            <Alert
              style={styles}
              color="green"
              title={t("formSaved", locale)}
              withCloseButton
              onClose={() => setShowSuccess(false)}
            >
              <Stack gap="md">
                <span>{t("formSavedMessage", locale)}</span>
                <Group gap="sm">
                  <Button
                    component={Link}
                    to="/"
                    variant="filled"
                    color="blue"
                    size="sm"
                  >
                    {t("newForm", locale)}
                  </Button>
                  <Button
                    component={Link}
                    to="/sessions"
                    variant="light"
                    size="sm"
                  >
                    {t("viewSessions", locale)}
                  </Button>
                </Group>
              </Stack>
            </Alert>
          )}
        </Transition>

        <Group justify="flex-end">
          <Button type="submit" size="md" loading={isSubmitting}>
            {t("save", locale)}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
