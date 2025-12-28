// Generated with claude code

import {
  Badge,
  Box,
  Card,
  Code,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconFolder,
  IconFolderOpen,
  IconHash,
  IconList,
  IconTable,
  IconTextSize,
} from "@tabler/icons-react";
import type { Locale } from "~/.server/locale.server";
import { t } from "~/lib/i18n";
import type { QuestionNode } from "~/lib/types";

interface TreeNodeProps {
  node: QuestionNode;
  depth: number;
  locale: Locale;
}

const getContentTypeIcon = (contentType: QuestionNode["contentType"]) => {
  switch (contentType) {
    case "number":
      return <IconHash size={14} />;
    case "text":
      return <IconTextSize size={14} />;
    case "enum":
      return <IconList size={14} />;
    case "table":
      return <IconTable size={14} />;
    default:
      return null;
  }
};

const getContentTypeColor = (contentType: QuestionNode["contentType"]) => {
  switch (contentType) {
    case "number":
      return "blue";
    case "text":
      return "green";
    case "enum":
      return "violet";
    case "table":
      return "orange";
    default:
      return "gray";
  }
};

const TreeNode = ({ node, depth, locale }: TreeNodeProps) => {
  const hasChildren = node.children.length > 0;
  const isGroup = !node.contentType && hasChildren;
  const color = getContentTypeColor(node.contentType);

  return (
    <Box>
      <Group gap="xs" wrap="nowrap" align="flex-start">
        {/* Indentation */}
        {depth > 0 && (
          <Box
            style={{
              width: depth * 20,
              borderLeft: "2px solid var(--mantine-color-gray-3)",
              marginLeft: 8,
              paddingLeft: 8,
            }}
          />
        )}

        {/* Folder/Leaf icon */}
        <ThemeIcon
          size="sm"
          variant="light"
          color={isGroup ? "blue" : color}
          style={{ flexShrink: 0, marginTop: 2 }}
        >
          {isGroup ? (
            <IconFolderOpen size={14} />
          ) : hasChildren ? (
            <IconFolder size={14} />
          ) : (
            getContentTypeIcon(node.contentType) || <IconFolder size={14} />
          )}
        </ThemeIcon>

        {/* Node content */}
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Group gap="xs" wrap="nowrap">
            <Code c="gray">{node.id}</Code>
            <Badge size="xs" color="pink" variant="light">
              depth: {depth}
            </Badge>
            {node.contentType && (
              <Badge size="xs" color={color} variant="filled">
                {node.contentType}
              </Badge>
            )}
            {!node.contentType && hasChildren && (
              <Badge size="xs" color="gray" variant="outline">
                {t("group", locale)}
              </Badge>
            )}
          </Group>
          <Text size="sm" lineClamp={1} c="dimmed">
            {node.label}
          </Text>
        </Stack>

        {/* Children count */}
        {hasChildren && (
          <Badge size="xs" variant="dot" color="blue">
            {node.children.length}{" "}
            {node.children.length > 1
              ? t("children", locale)
              : t("child", locale)}
          </Badge>
        )}
      </Group>

      {/* Recursive children */}
      {hasChildren && (
        <Stack gap={4} mt={4}>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              locale={locale}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

interface Props {
  questions: QuestionNode[];
  locale: Locale;
}

export const TreeVisualization = ({ questions, locale }: Props) => {
  // Calculate stats
  const countNodes = (nodes: QuestionNode[]): number =>
    nodes.reduce((acc, node) => acc + 1 + countNodes(node.children), 0);

  const getMaxDepth = (nodes: QuestionNode[], currentDepth = 0): number =>
    nodes.reduce(
      (max, node) =>
        Math.max(
          max,
          currentDepth,
          getMaxDepth(node.children, currentDepth + 1),
        ),
      currentDepth,
    );

  const totalNodes = countNodes(questions);
  const maxDepth = getMaxDepth(questions);

  return (
    <Card withBorder shadow="sm" radius="md">
      <Stack gap="md">
        {/* Header with stats */}
        <Group justify="space-between" align="center">
          <Text fw={600} size="lg">
            {t("treeTitle", locale)}
          </Text>
          <Group gap="xs">
            <Badge color="blue" variant="light">
              {totalNodes} {t("questions", locale)}
            </Badge>
            <Badge color="pink" variant="light">
              {t("maxDepth", locale)}: {maxDepth}
            </Badge>
          </Group>
        </Group>

        {/* Legend */}
        <Group gap="xs">
          <Text size="xs" c="dimmed">
            {t("legend", locale)}:
          </Text>
          <Badge
            size="xs"
            color="blue"
            variant="filled"
            leftSection={<IconHash size={10} />}
          >
            number
          </Badge>
          <Badge
            size="xs"
            color="green"
            variant="filled"
            leftSection={<IconTextSize size={10} />}
          >
            text
          </Badge>
          <Badge
            size="xs"
            color="violet"
            variant="filled"
            leftSection={<IconList size={10} />}
          >
            enum
          </Badge>
          <Badge
            size="xs"
            color="orange"
            variant="filled"
            leftSection={<IconTable size={10} />}
          >
            table
          </Badge>
          <Badge size="xs" color="gray" variant="outline">
            {t("group", locale)}
          </Badge>
        </Group>

        {/* Tree */}
        <Box
          style={{
            maxHeight: 500,
            overflowY: "auto",
            padding: 8,
            backgroundColor: "var(--mantine-color-gray-0)",
            borderRadius: 8,
          }}
        >
          <Stack gap={8}>
            {questions.map((question) => (
              <TreeNode
                key={question.id}
                node={question}
                depth={0}
                locale={locale}
              />
            ))}
          </Stack>
        </Box>

        {/* Proof of recursivity */}
        <Card withBorder bg="blue.0" radius="sm">
          <Stack gap="xs">
            <Text size="sm" fw={500} c="blue.8">
              {t("recursivityProof", locale)}
            </Text>
            <Text size="xs" c="blue.7">
              {t("recursivityExplanation", locale)} <strong>{maxDepth}</strong>
              {t("recursivityConclusion", locale)}
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Card>
  );
};
