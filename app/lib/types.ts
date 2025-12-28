export type ContentType = "number" | "text" | "enum" | "table" | null;

export interface QuestionNode {
  id: string;
  label: string;
  contentType: ContentType;
  order: number;
  unit?: string | null;
  enumOptions?: { id: string; label: string }[];
  children: QuestionNode[];
}

export interface FormValues {
  [questionId: string]: string | number | FormValues[];
}

export interface AnswerInput {
  questionId: string;
  value: string;
  rowIndex?: number;
  rowLabel?: string;
}
