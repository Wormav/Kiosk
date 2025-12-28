import { Container, Title } from "@mantine/core";
import { getLocale } from "~/.server/locale.server";
import {
  getOrCreateSession,
  getQuestionsHierarchy,
  getSessionAnswers,
  saveAnswers,
} from "~/.server/questions.server";
import { DynamicForm } from "~/components/form/DynamicForm";
import { t } from "~/lib/i18n";
import type { Route } from "./+types/home";

// Don't revalidate (re-run loader) after a fetcher action
// This prevents creating a new session after saving
export const shouldRevalidate = ({ formAction }: { formAction?: string }) => {
  return !formAction;
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session") || undefined;
  const locale = await getLocale(request);

  const [questions, session] = await Promise.all([
    getQuestionsHierarchy(locale),
    getOrCreateSession(sessionId),
  ]);

  const defaultValues = await getSessionAnswers(session.id);

  return { questions, session, defaultValues, locale };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const sessionId = formData.get("sessionId") as string;
  const answersJson = formData.get("answers") as string;
  const answers = JSON.parse(answersJson);

  await saveAnswers(sessionId, answers);

  return { success: true };
};

const HomePage = ({ loaderData }: Route.ComponentProps) => {
  const { questions, session, defaultValues, locale } = loaderData;

  return (
    <Container size="lg" py="xl" px="md">
      <Title order={1} mb="xl">
        {t("formTitle", locale)}
      </Title>
      <DynamicForm
        key={session.id}
        questions={questions}
        sessionId={session.id}
        defaultValues={defaultValues}
        locale={locale}
      />
    </Container>
  );
};

export default HomePage;
