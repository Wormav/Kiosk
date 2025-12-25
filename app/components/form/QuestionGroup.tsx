import { Stack } from "@mantine/core";
import type { Locale } from "~/.server/locale.server";
import type { QuestionNode } from "~/lib/types";
import { QuestionField } from "./QuestionField";

interface Props {
  questions: QuestionNode[];
  form: any;
  locale: Locale;
}

export const QuestionGroup = ({ questions, form, locale }: Props) => (
  <Stack gap="lg">
    {questions.map((question) => (
      <QuestionField
        key={question.id}
        question={question}
        form={form}
        locale={locale}
      />
    ))}
  </Stack>
);
