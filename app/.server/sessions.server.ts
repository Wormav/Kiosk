import { prisma } from "./db";

/**
 * Retrieves all form sessions with their answer count.
 * Only returns sessions that have at least one answer.
 */
export const getAllSessions = async () => {
  const sessions = await prisma.formSession.findMany({
    include: {
      _count: {
        select: { answers: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Filter out sessions with no answers
  return sessions
    .filter((session) => session._count.answers > 0)
    .map((session) => ({
      id: session.id,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      answerCount: session._count.answers,
    }));
};

/**
 * Deletes a session and all its answers.
 */
export const deleteSession = async (sessionId: string) => {
  await prisma.formSession.delete({
    where: { id: sessionId },
  });
};

/**
 * Deletes all form sessions.
 */
export const deleteAllSessions = async () => {
  await prisma.formSession.deleteMany();
};
