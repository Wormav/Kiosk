import type { AnswerInput, QuestionNode } from "~/lib/types";
import { prisma } from "./db";

// Raw question type from database
interface RawQuestion {
  id: string;
  contentType: string | null;
  order: number;
  unit: string | null;
  parentId: string | null;
  labels: { locale: string; label: string }[];
  enumOptions: {
    id: string;
    order: number;
    labels: { locale: string; label: string }[];
  }[];
}

/**
 * Maps a raw question from database to a QuestionNode with its children.
 */
const mapQuestion = (
  question: RawQuestion,
  childrenMap: Map<string | null, RawQuestion[]>,
  locale: string,
): QuestionNode => {
  const label =
    question.labels.find((l) => l.locale === locale)?.label || question.id;

  const enumOptions = question.enumOptions.map((opt) => ({
    id: opt.id,
    label: opt.labels.find((l) => l.locale === locale)?.label || "",
  }));

  const children = childrenMap.get(question.id) || [];

  return {
    id: question.id,
    label,
    contentType: question.contentType as QuestionNode["contentType"],
    order: question.order,
    unit: question.unit,
    enumOptions: enumOptions.length > 0 ? enumOptions : undefined,
    children: children
      .sort((a, b) => a.order - b.order)
      .map((child) => mapQuestion(child, childrenMap, locale)),
  };
};

/**
 * Retrieves the hierarchy of questions from the database with arbitrary depth.
 * Fetches all questions in a single query and builds the tree in memory.
 *
 * @param locale - The locale to use for labels (default is "fr").
 * @returns A promise that resolves to an array of QuestionNode objects representing the question hierarchy.
 */
export const getQuestionsHierarchy = async (
  locale: string = "fr",
): Promise<QuestionNode[]> => {
  // Fetch all questions in a single query
  const allQuestions = await prisma.question.findMany({
    include: {
      labels: true,
      enumOptions: {
        include: { labels: true },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  // Build a map of parentId -> children for efficient tree construction
  const childrenMap = new Map<string | null, RawQuestion[]>();

  for (const question of allQuestions) {
    const parentId = question.parentId;
    if (!childrenMap.has(parentId)) {
      childrenMap.set(parentId, []);
    }
    childrenMap.get(parentId)!.push(question);
  }

  // Get root questions (those without a parent)
  const rootQuestions = childrenMap.get(null) || [];

  // Build the tree recursively
  return rootQuestions
    .sort((a, b) => a.order - b.order)
    .map((question) => mapQuestion(question, childrenMap, locale));
};

/**
 * Retrieves an existing form session by its ID, or creates a new one if it does not exist.
 *
 * @param sessionId - Optional session ID to look up.
 * @returns A promise that resolves to the form session object.
 */
export const getOrCreateSession = async (sessionId?: string) => {
  if (sessionId) {
    const session = await prisma.formSession.findUnique({
      where: { id: sessionId },
      include: { answers: true },
    });
    if (session) return session;
  }
  return prisma.formSession.create({ data: {} });
};

/**
 * Retrieves all answers for a given session and formats them for form default values.
 *
 * @param sessionId - The ID of the session to retrieve answers for.
 * @returns A promise that resolves to an object suitable for form defaultValues.
 */
export const getSessionAnswers = async (sessionId: string) => {
  const answers = await prisma.answer.findMany({
    where: { sessionId },
  });

  const result: Record<string, unknown> = {};

  // First, get all questions to know which ones belong to tables
  const questionIds = answers.map((a) => a.questionId);
  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
    select: { id: true, parentId: true },
  });

  // Get parent questions to check if they are tables
  const parentIds = questions
    .map((q) => q.parentId)
    .filter((id): id is string => id !== null);
  const parentQuestions = await prisma.question.findMany({
    where: { id: { in: parentIds } },
    select: { id: true, contentType: true },
  });
  const tableIds = new Set(
    parentQuestions.filter((p) => p.contentType === "table").map((p) => p.id),
  );

  // Map questionId -> parentId
  const questionParentMap = new Map(questions.map((q) => [q.id, q.parentId]));

  // Group table answers by parentId and rowLabel to reconstruct rows
  const tableRowsMap = new Map<string, Map<string, Record<string, unknown>>>();

  for (const answer of answers) {
    const parentId = questionParentMap.get(answer.questionId);
    const isTableField = parentId && tableIds.has(parentId);

    if (isTableField) {
      // This is a table field - group by parentId and rowLabel
      const tableId = parentId;
      const rowKey = answer.rowLabel || `row_${answer.rowIndex ?? 0}`;

      if (!tableRowsMap.has(tableId)) {
        tableRowsMap.set(tableId, new Map());
      }
      const rowsMap = tableRowsMap.get(tableId)!;

      if (!rowsMap.has(rowKey)) {
        rowsMap.set(rowKey, { _rowLabel: answer.rowLabel || "" });
      }

      rowsMap.get(rowKey)![answer.questionId] = answer.value || "";
    } else {
      // Simple field
      result[answer.questionId] = answer.value || "";
    }
  }

  // Convert tableRowsMap to arrays
  for (const [tableId, rowsMap] of tableRowsMap) {
    result[tableId] = Array.from(rowsMap.values());
  }

  return result;
};

/**
 * Saves a list of answers for a given session. Updates existing answers or creates new ones as needed.
 *
 * @param sessionId - The ID of the session to save answers for.
 * @param answers - An array of AnswerInput objects to be saved.
 * @returns A promise that resolves when all answers have been saved.
 */
export const saveAnswers = async (
  sessionId: string,
  answers: AnswerInput[],
) => {
  // Update session's updatedAt timestamp
  await prisma.formSession.update({
    where: { id: sessionId },
    data: { updatedAt: new Date() },
  });

  for (const answer of answers) {
    const rowIndex = answer.rowIndex ?? null;
    const rowLabel = answer.rowLabel || null;

    // Find existing answer by sessionId, questionId, and rowIndex
    const existing = await prisma.answer.findFirst({
      where: {
        sessionId,
        questionId: answer.questionId,
        rowIndex,
      },
    });

    if (existing) {
      await prisma.answer.update({
        where: { id: existing.id },
        data: {
          value: answer.value,
          rowLabel,
        },
      });
    } else {
      await prisma.answer.create({
        data: {
          sessionId,
          questionId: answer.questionId,
          value: answer.value,
          rowIndex,
          rowLabel,
        },
      });
    }
  }
};
