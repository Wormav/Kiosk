import {
  getOrCreateSession,
  getQuestionsHierarchy,
  saveAnswers,
} from "~/.server/questions.server";
import { DynamicForm } from "~/components/form/DynamicForm";
import type { Route } from "./+types/form";

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

const FormPage = ({ loaderData }: Route.ComponentProps) => {
  const { questions, session } = loaderData;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Formulaire ESG/CSRD
        </h1>
        <DynamicForm questions={questions} sessionId={session.id} />
      </div>
    </div>
  );
};

export default FormPage;
