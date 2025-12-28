// Generated with claude code

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
import { getLocale, type Locale } from "~/.server/locale.server";
import {
  deleteAllSessions,
  deleteSession,
  getAllSessions,
} from "~/.server/sessions.server";
import { t } from "~/lib/i18n";
import type { Route } from "./+types/sessions";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const locale = await getLocale(request);
  const sessions = await getAllSessions();
  return { sessions, locale };
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

const formatDate = (date: Date, locale: Locale) => {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

const SessionRow = ({
  session,
  locale,
}: {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    answerCount: number;
  };
  locale: Locale;
}) => {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  const handleDelete = () => {
    if (confirm(t("confirmDeleteSession", locale))) {
      fetcher.submit(
        { intent: "delete", sessionId: session.id },
        { method: "post" },
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
      <Table.Td>{formatDate(session.createdAt, locale)}</Table.Td>
      <Table.Td>{formatDate(session.updatedAt, locale)}</Table.Td>
      <Table.Td>
        <Badge
          variant="light"
          color={session.answerCount > 0 ? "green" : "gray"}
        >
          {session.answerCount}{" "}
          {session.answerCount !== 1
            ? t("answersPlural", locale)
            : t("answer", locale)}
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
  locale,
}: {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    answerCount: number;
  };
  locale: Locale;
}) => {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  const handleDelete = () => {
    if (confirm(t("confirmDeleteSession", locale))) {
      fetcher.submit(
        { intent: "delete", sessionId: session.id },
        { method: "post" },
      );
    }
  };

  return (
    <Card withBorder padding="md" style={{ opacity: isDeleting ? 0.5 : 1 }}>
      <Group justify="space-between" mb="xs">
        <Text size="sm" fw={500}>
          {session.id.slice(0, 8)}...
        </Text>
        <Badge
          variant="light"
          color={session.answerCount > 0 ? "green" : "gray"}
        >
          {session.answerCount}{" "}
          {session.answerCount !== 1
            ? t("answersPlural", locale)
            : t("answer", locale)}
        </Badge>
      </Group>
      <Text size="xs" c="dimmed">
        {t("created", locale)}: {formatDate(session.createdAt, locale)}
      </Text>
      <Text size="xs" c="dimmed" mb="md">
        {t("updated", locale)}: {formatDate(session.updatedAt, locale)}
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
  const { sessions, locale } = loaderData;
  const fetcher = useFetcher();

  const handleDeleteAll = () => {
    if (confirm(t("confirmDeleteAllSessions", locale))) {
      fetcher.submit({ intent: "deleteAll" }, { method: "post" });
    }
  };

  return (
    <Container size="lg" py="xl" px="md">
      <Group justify="space-between" mb="xl">
        <Title order={1}>{t("sessionsTitle", locale)}</Title>
        {sessions.length > 0 && (
          <Button
            color="red"
            onClick={handleDeleteAll}
            disabled={fetcher.state !== "idle"}
          >
            {t("deleteAllSessions", locale)}
          </Button>
        )}
      </Group>

      {sessions.length === 0 ? (
        <Text c="dimmed">{t("noSessionsFound", locale)}</Text>
      ) : (
        <>
          {/* Desktop: Table view */}
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            visibleFrom="sm"
          >
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t("id", locale)}</Table.Th>
                  <Table.Th>{t("createdAt", locale)}</Table.Th>
                  <Table.Th>{t("updatedAt", locale)}</Table.Th>
                  <Table.Th>{t("answers", locale)}</Table.Th>
                  <Table.Th>{t("actions", locale)}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {sessions.map((session) => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    locale={locale}
                  />
                ))}
              </Table.Tbody>
            </Table>
          </Card>

          {/* Mobile: Card view */}
          <Stack gap="sm" hiddenFrom="sm">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} locale={locale} />
            ))}
          </Stack>
        </>
      )}
    </Container>
  );
};

export default SessionsPage;
