import type { QuestionNode } from "~/lib/types";
import { QuestionField } from "./QuestionField";

interface Props {
  questions: QuestionNode[];
  form: any;
}

export const QuestionGroup = ({ questions, form }: Props) => (
  <div className="space-y-6">
    {questions.map((question) => (
      <QuestionField key={question.id} question={question} form={form} />
    ))}
  </div>
);
