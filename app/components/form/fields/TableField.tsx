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
import type { QuestionNode } from "~/lib/types";

interface Props {
  question: QuestionNode;
  form: any;
}

// Mobile card view for a single row
const MobileRowCard = ({
  question,
  form,
  rowIndex,
  onDelete,
  canDelete,
}: {
  question: QuestionNode;
  form: any;
  rowIndex: number;
  onDelete: () => void;
  canDelete: boolean;
}) => (
  <Card withBorder padding="sm" radius="sm">
    <Group justify="space-between" mb="xs">
      <Text size="sm" fw={500} c="dimmed">
        Ligne {rowIndex + 1}
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

export const TableField = ({ question, form }: Props) => {
  const [rows, setRows] = useState<number[]>([0]);
  const [nextId, setNextId] = useState(1);

  const addRow = () => {
    setRows((prev) => [...prev, nextId]);
    setNextId((prev) => prev + 1);
  };

  const removeRow = (rowId: number) => {
    if (rows.length > 1) {
      setRows((prev) => prev.filter((id) => id !== rowId));
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
              {rows.map((rowId, rowIndex) => (
                <Table.Tr key={rowId}>
                  <Table.Td>
                    <Text c="dimmed" size="sm">
                      {rowIndex + 1}
                    </Text>
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
                        onClick={() => removeRow(rowId)}
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
        {rows.map((rowId, rowIndex) => (
          <MobileRowCard
            key={rowId}
            question={question}
            form={form}
            rowIndex={rowIndex}
            onDelete={() => removeRow(rowId)}
            canDelete={rows.length > 1}
          />
        ))}
      </Stack>

      {/* Desktop: left aligned */}
      <Group mt="md" gap="xs" visibleFrom="sm">
        <Button variant="light" size="xs" onClick={addRow}>
          + Ajouter une ligne
        </Button>
      </Group>

      {/* Mobile: centered */}
      <Group mt="md" gap="xs" justify="center" hiddenFrom="sm">
        <Button variant="light" size="xs" onClick={addRow}>
          + Ajouter une ligne
        </Button>
      </Group>
    </Card>
  );
};
