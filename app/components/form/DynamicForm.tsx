import { useForm } from "@tanstack/react-form";
import { useSubmit } from "react-router";
import type { QuestionNode } from "~/lib/types";
import { QuestionGroup } from "./QuestionGroup";

interface Props {
  questions: QuestionNode[];
  sessionId: string;
}

/**
 * Flattens the answers object into an array of answer objects.
 * Handles both simple and array-based (e.g., table) answers.
 *
 * @param values - The form values as a record of question IDs to answers.
 * @returns An array of objects each containing questionId, value, and optionally rowIndex.
 */
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

/**
 * Renders a dynamic form based on the provided questions.
 * Handles form submission and answer flattening before sending data.
 *
 * @param questions - The list of questions to render in the form.
 * @param sessionId - The session identifier to include in the submission.
 */
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
      className="space-y-8"
    >
      <QuestionGroup questions={questions} form={form} />

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Sauvegarder
        </button>
      </div>
    </form>
  );
};
