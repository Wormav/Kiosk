import type { QuestionNode } from "~/lib/types";
import { EnumField } from "./fields/EnumField";
import { NumberField } from "./fields/NumberField";
import { TableField } from "./fields/TableField";
import { TextField } from "./fields/TextField";
import { QuestionGroup } from "./QuestionGroup";

interface Props {
  question: QuestionNode;
  form: any;
}

export const QuestionField = ({ question, form }: Props) => {
  const { contentType, label, children } = question;

  // Grouping section (no contentType)
  if (!contentType && children.length > 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{label}</h2>
        <QuestionGroup questions={children} form={form} />
      </div>
    );
  }

  // Table
  if (contentType === "table") {
    return <TableField question={question} form={form} />;
  }

  // Simple fields
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {question.unit && (
          <span className="text-gray-500 ml-1">({question.unit})</span>
        )}
      </label>

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
    </div>
  );
};
