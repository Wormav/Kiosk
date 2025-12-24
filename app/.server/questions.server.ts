import type { AnswerInput, QuestionNode } from "~/lib/types";
import { prisma } from "./db";

/**
 * Retrieves the hierarchy of questions from the database, including their labels, enum options, and children,
 * and maps them into a tree structure suitable for use in the application.
 *
 * @param locale - The locale to use for labels (default is "fr").
 * @returns A promise that resolves to an array of QuestionNode objects representing the question hierarchy.
 */
export const getQuestionsHierarchy = async (
  locale: string = "fr",
): Promise<QuestionNode[]> => {
  const questions = await prisma.question.findMany({
    include: {
      labels: true,
      enumOptions: {
        include: { labels: true },
        orderBy: { order: "asc" },
      },
      children: {
        include: {
          labels: true,
          enumOptions: {
            include: { labels: true },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
    where: { parentId: null },
    orderBy: { order: "asc" },
  });

  const mapQuestion = (q: (typeof questions)[0]): QuestionNode => {
    const label = q.labels.find((l) => l.locale === locale)?.label || q.id;
    const enumOptions = q.enumOptions.map((opt) => ({
      id: opt.id,
      label: opt.labels.find((l) => l.locale === locale)?.label || "",
    }));

    return {
      id: q.id,
      label,
      contentType: q.contentType as QuestionNode["contentType"],
      order: q.order,
      unit: q.unit,
      enumOptions: enumOptions.length > 0 ? enumOptions : undefined,
      children: (q.children || []).map((child) =>
        mapQuestion(child as (typeof questions)[0]),
      ),
    };
  };

  return questions.map(mapQuestion);
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
 * Retrieves all answers for a given session and organizes them into a structured object.
 *
 * @param sessionId - The ID of the session to retrieve answers for.
 * @returns A promise that resolves to an object mapping question IDs to their answers.
 */
export const getSessionAnswers = async (sessionId: string) => {
  const answers = await prisma.answer.findMany({
    where: { sessionId },
  });

  const result: Record<
    string,
    string | Record<number, Record<string, string>>
  > = {};

  for (const answer of answers) {
    if (answer.rowIndex !== null) {
      if (!result[answer.questionId]) {
        result[answer.questionId] = {};
      }
      const tableAnswers = result[answer.questionId] as Record<
        number,
        Record<string, string>
      >;
      if (!tableAnswers[answer.rowIndex]) {
        tableAnswers[answer.rowIndex] = {};
      }
      tableAnswers[answer.rowIndex][answer.questionId] = answer.value || "";
    } else {
      result[answer.questionId] = answer.value || "";
    }
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
  for (const answer of answers) {
    const rowIndex = answer.rowIndex ?? null;

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
        data: { value: answer.value },
      });
    } else {
      await prisma.answer.create({
        data: {
          sessionId,
          questionId: answer.questionId,
          value: answer.value,
          rowIndex,
        },
      });
    }
  }
};
