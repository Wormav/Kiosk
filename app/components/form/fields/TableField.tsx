import {
  Button,
  Card,
  Group,
  NumberInput,
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

export const TableField = ({ question, form }: Props) => {
  const [rowCount, setRowCount] = useState(1);

  const addRow = () => setRowCount((c) => c + 1);
  const removeRow = () => setRowCount((c) => Math.max(1, c - 1));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text fw={600} size="lg" mb="md">
        {question.label}
      </Text>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={50}>#</Table.Th>
            {question.children.map((child) => (
              <Table.Th key={child.id}>
                {child.label}
                {child.unit && (
                  <Text span c="dimmed" size="sm" ml={4}>
                    ({child.unit})
                  </Text>
                )}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Array.from({ length: rowCount }, (_, rowIndex) => (
            <Table.Tr key={rowIndex}>
              <Table.Td>
                <Text c="dimmed" size="sm">
                  {rowIndex + 1}
                </Text>
              </Table.Td>
              {question.children.map((child) => (
                <Table.Td key={child.id}>
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
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group mt="md">
        <Button variant="light" size="xs" onClick={addRow}>
          + Ajouter une ligne
        </Button>
        {rowCount > 1 && (
          <Button variant="light" color="red" size="xs" onClick={removeRow}>
            - Supprimer une ligne
          </Button>
        )}
      </Group>
    </Card>
  );
};
