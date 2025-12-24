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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">{question.label}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-12">
                #
              </th>
              {question.children.map((child) => (
                <th
                  key={child.id}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600"
                >
                  {child.label}
                  {child.unit && (
                    <span className="text-gray-400 font-normal ml-1">
                      ({child.unit})
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.from({ length: rowCount }, (_, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500 font-medium">
                  {rowIndex + 1}
                </td>
                {question.children.map((child) => (
                  <td key={child.id} className="px-4 py-3">
                    <form.Field
                      name={`${question.id}[${rowIndex}].${child.id}`}
                    >
                      {(field: any) => (
                        <input
                          type={
                            child.contentType === "number" ? "number" : "text"
                          }
                          step={
                            child.contentType === "number" ? "any" : undefined
                          }
                          value={field.state.value ?? ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                        />
                      )}
                    </form.Field>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex gap-3">
        <button
          type="button"
          onClick={addRow}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          + Ajouter une ligne
        </button>
        {rowCount > 1 && (
          <button
            type="button"
            onClick={removeRow}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            - Supprimer une ligne
          </button>
        )}
      </div>
    </div>
  );
};
