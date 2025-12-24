import { Container, Title } from "@mantine/core";
import {
  getOrCreateSession,
  getQuestionsHierarchy,
  saveAnswers,
} from "~/.server/questions.server";
import { DynamicForm } from "~/components/form/DynamicForm";
import type { Route } from "./+types/home";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session") || undefined;

  const [questions, session] = await Promise.all([
    getQuestionsHierarchy("fr"),
    getOrCreateSession(sessionId),
  ]);

  return { questions, session };
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
  const { questions, session } = loaderData;

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl">
        Formulaire ESG/CSRD
      </Title>
      <DynamicForm questions={questions} sessionId={session.id} />
    </Container>
  );
};

export default HomePage;
