import {
    ActionIcon,
    Badge,
    Button,
    Card,
    Container,
    Group,
    Stack,
    Table,
    Text,
    Title,
} from "@mantine/core";
import { Link, useFetcher } from "react-router";
import { deleteAllSessions, deleteSession, getAllSessions } from "~/.server/sessions.server";
import type { Route } from "./+types/sessions";

export const loader = async () => {
  const sessions = await getAllSessions();
  return { sessions };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const sessionId = formData.get("sessionId") as string;

  if (intent === "delete" && sessionId) {
    await deleteSession(sessionId);
  } else if (intent === "deleteAll") {
    await deleteAllSessions();
  }

  return { success: true };
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

const SessionRow = ({
  session,
}: {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    answerCount: number;
  };
}) => {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  const handleDelete = () => {
    if (confirm("Supprimer cette session ?")) {
      fetcher.submit(
        { intent: "delete", sessionId: session.id },
        { method: "post" }
      );
    }
  };

  return (
    <Table.Tr style={{ opacity: isDeleting ? 0.5 : 1 }}>
      <Table.Td>
        <Text size="sm" c="dimmed">
          {session.id.slice(0, 8)}...
        </Text>
      </Table.Td>
      <Table.Td>{formatDate(session.createdAt)}</Table.Td>
      <Table.Td>{formatDate(session.updatedAt)}</Table.Td>
      <Table.Td>
        <Badge variant="light" color={session.answerCount > 0 ? "green" : "gray"}>
          {session.answerCount} réponse{session.answerCount !== 1 ? "s" : ""}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            component={Link}
            to={`/?session=${session.id}`}
            variant="light"
            color="blue"
            aria-label="Edit session"
          >
            ✎
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="red"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Delete session"
          >
            ✕
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  );
};

// Mobile card view
const SessionCard = ({
  session,
}: {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    answerCount: number;
  };
}) => {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  const handleDelete = () => {
    if (confirm("Supprimer cette session ?")) {
      fetcher.submit(
        { intent: "delete", sessionId: session.id },
        { method: "post" }
      );
    }
  };

  return (
    <Card withBorder padding="md" style={{ opacity: isDeleting ? 0.5 : 1 }}>
      <Group justify="space-between" mb="xs">
        <Text size="sm" fw={500}>
          {session.id.slice(0, 8)}...
        </Text>
        <Badge variant="light" color={session.answerCount > 0 ? "green" : "gray"}>
          {session.answerCount} réponse{session.answerCount !== 1 ? "s" : ""}
        </Badge>
      </Group>
      <Text size="xs" c="dimmed">
        Créée: {formatDate(session.createdAt)}
      </Text>
      <Text size="xs" c="dimmed" mb="md">
        Modifiée: {formatDate(session.updatedAt)}
      </Text>
      <Group gap="xs">
        <ActionIcon
          component={Link}
          to={`/?session=${session.id}`}
          variant="light"
          color="blue"
          aria-label="Edit session"
        >
          ✎
        </ActionIcon>
        <ActionIcon
          variant="light"
          color="red"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Delete session"
        >
          ✕
        </ActionIcon>
      </Group>
    </Card>
  );
};

const SessionsPage = ({ loaderData }: Route.ComponentProps) => {
  const { sessions } = loaderData;
  const fetcher = useFetcher();

  const handleDeleteAll = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer TOUTES les sessions ?")) {
      fetcher.submit({ intent: "deleteAll" }, { method: "post" });
    }
  };

  return (
    <Container size="lg" py="xl" px="md">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Sessions</Title>
        {sessions.length > 0 && (
          <Button color="red" onClick={handleDeleteAll} disabled={fetcher.state !== "idle"}>
            Supprimer toutes les sessions
          </Button>
        )}
      </Group>

      {sessions.length === 0 ? (
        <Text c="dimmed">Aucune session trouvée.</Text>
      ) : (
        <>
          {/* Desktop: Table view */}
          <Card shadow="sm" padding="lg" radius="md" withBorder visibleFrom="sm">
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Créée le</Table.Th>
                  <Table.Th>Modifiée le</Table.Th>
                  <Table.Th>Réponses</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {sessions.map((session) => (
                  <SessionRow key={session.id} session={session} />
                ))}
              </Table.Tbody>
            </Table>
          </Card>

          {/* Mobile: Card view */}
          <Stack gap="sm" hiddenFrom="sm">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </Stack>
        </>
      )}
    </Container>
  );
};

export default SessionsPage;
