import {
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  NumberInput,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import type { Locale } from "~/.server/locale.server";
import { t } from "~/lib/i18n";
import type { QuestionNode } from "~/lib/types";

interface Props {
  question: QuestionNode;
  form: any;
  locale: Locale;
}

// Mobile card view for a single row
const MobileRowCard = ({
  question,
  form,
  rowIndex,
  rowLabel,
  onDelete,
  onLabelChange,
  canDelete,
  locale,
}: {
  question: QuestionNode;
  form: any;
  rowIndex: number;
  rowLabel: string;
  onDelete: () => void;
  onLabelChange: (label: string) => void;
  canDelete: boolean;
  locale: Locale;
}) => (
  <Card withBorder padding="sm" radius="sm">
    <Group justify="space-between" mb="xs">
      <Text size="sm" fw={500} c="dimmed">
        {t("row", locale)} {rowIndex + 1}
      </Text>
      {canDelete && (
        <ActionIcon
          variant="light"
          color="red"
          size="sm"
          onClick={onDelete}
          aria-label="Delete row"
        >
          ✕
        </ActionIcon>
      )}
    </Group>
    <Stack gap="xs">
      <Box>
        <Text size="xs" fw={500} mb={4}>
          {t("label", locale)}
        </Text>
        <form.Field name={`${question.id}[${rowIndex}]._rowLabel`}>
          {(field: any) => (
            <TextInput
              placeholder={t("labelPlaceholder", locale)}
              value={field.state.value ?? rowLabel}
              onChange={(e) => {
                field.handleChange(e.target.value);
                onLabelChange(e.target.value);
              }}
              onBlur={field.handleBlur}
              size="sm"
            />
          )}
        </form.Field>
      </Box>
      {question.children.map((child) => (
        <Box key={child.id}>
          <Text size="xs" fw={500} mb={4}>
            {child.label}
            {child.unit && (
              <Text span c="dimmed" ml={4}>
                ({child.unit})
              </Text>
            )}
          </Text>
          <form.Field name={`${question.id}[${rowIndex}].${child.id}`}>
            {(field: any) =>
              child.contentType === "number" ? (
                <NumberInput
                  value={field.state.value ?? ""}
                  onChange={(val) => field.handleChange(val)}
                  onBlur={field.handleBlur}
                  hideControls
                  size="sm"
                />
              ) : (
                <TextInput
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  size="sm"
                />
              )
            }
          </form.Field>
        </Box>
      ))}
    </Stack>
  </Card>
);

export const TableField = ({ question, form, locale }: Props) => {
  // Initialize rows from form default values if they exist
  const getInitialRows = (): { id: number; label: string }[] => {
    const defaultData = form.state.values[question.id];
    if (Array.isArray(defaultData) && defaultData.length > 0) {
      return defaultData.map((row: Record<string, unknown>, index: number) => ({
        id: index,
        label: (row._rowLabel as string) || "",
      }));
    }
    return [{ id: 0, label: "" }];
  };

  const [rows, setRows] =
    useState<{ id: number; label: string }[]>(getInitialRows);
  const [nextId, setNextId] = useState(() => {
    const defaultData = form.state.values[question.id];
    return Array.isArray(defaultData) ? defaultData.length : 1;
  });

  const updateRowLabel = (rowId: number, label: string) => {
    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, label } : row)),
    );
  };

  const addRow = () => {
    setRows((prev) => [...prev, { id: nextId, label: "" }]);
    setNextId((prev) => prev + 1);
  };

  const removeRow = (rowId: number) => {
    if (rows.length > 1) {
      setRows((prev) => prev.filter((row) => row.id !== rowId));
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text fw={600} size="lg" mb="md">
        {question.label}
      </Text>

      {/* Desktop: Table view */}
      <Box visibleFrom="sm">
        <ScrollArea>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={50}>#</Table.Th>
                <Table.Th miw={180}>{t("label", locale)}</Table.Th>
                {question.children.map((child) => (
                  <Table.Th key={child.id} miw={150}>
                    {child.label}
                    {child.unit && (
                      <Text span c="dimmed" size="sm" ml={4}>
                        ({child.unit})
                      </Text>
                    )}
                  </Table.Th>
                ))}
                <Table.Th w={50}></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((row, rowIndex) => (
                <Table.Tr key={row.id}>
                  <Table.Td>
                    <Text c="dimmed" size="sm">
                      {rowIndex + 1}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <form.Field name={`${question.id}[${rowIndex}]._rowLabel`}>
                      {(field: any) => (
                        <TextInput
                          placeholder={t("labelPlaceholder", locale)}
                          value={field.state.value ?? row.label}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                            updateRowLabel(row.id, e.target.value);
                          }}
                          onBlur={field.handleBlur}
                          size="sm"
                        />
                      )}
                    </form.Field>
                  </Table.Td>
                  {question.children.map((child) => (
                    <Table.Td key={child.id}>
                      <form.Field
                        name={`${question.id}[${rowIndex}].${child.id}`}
                      >
                        {(field: any) =>
                          child.contentType === "number" ? (
                            <NumberInput
                              value={field.state.value ?? ""}
                              onChange={(val) => field.handleChange(val)}
                              onBlur={field.handleBlur}
                              hideControls
                              size="sm"
                            />
                          ) : (
                            <TextInput
                              value={field.state.value ?? ""}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              size="sm"
                            />
                          )
                        }
                      </form.Field>
                    </Table.Td>
                  ))}
                  <Table.Td>
                    {rows.length > 1 && (
                      <ActionIcon
                        variant="light"
                        color="red"
                        size="sm"
                        onClick={() => removeRow(row.id)}
                        aria-label="Delete row"
                      >
                        ✕
                      </ActionIcon>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Box>

      {/* Mobile: Card view */}
      <Stack gap="sm" hiddenFrom="sm">
        {rows.map((row, rowIndex) => (
          <MobileRowCard
            key={row.id}
            question={question}
            form={form}
            rowIndex={rowIndex}
            rowLabel={row.label}
            onDelete={() => removeRow(row.id)}
            onLabelChange={(label) => updateRowLabel(row.id, label)}
            canDelete={rows.length > 1}
            locale={locale}
          />
        ))}
      </Stack>

      {/* Desktop: left aligned */}
      <Group mt="md" gap="xs" visibleFrom="sm">
        <Button variant="light" size="xs" onClick={addRow}>
          {t("addRow", locale)}
        </Button>
      </Group>

      {/* Mobile: centered */}
      <Group mt="md" gap="xs" justify="center" hiddenFrom="sm">
        <Button variant="light" size="xs" onClick={addRow}>
          {t("addRow", locale)}
        </Button>
      </Group>
    </Card>
  );
};
