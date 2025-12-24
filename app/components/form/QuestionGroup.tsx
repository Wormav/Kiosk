import { Stack } from "@mantine/core";
import type { QuestionNode } from "~/lib/types";
import { QuestionField } from "./QuestionField";

interface Props {
  questions: QuestionNode[];
  form: any;
}

export const QuestionGroup = ({ questions, form }: Props) => (
  <Stack gap="lg">
    {questions.map((question) => (
      <QuestionField key={question.id} question={question} form={form} />
    ))}
  </Stack>
);
