import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse/sync";
import "dotenv/config";
import fs from "fs";
import path from "path";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

interface CsvRow {
  ID: string;
  "question label en": string;
  "question label fr": string;
  content: string;
  "relatedQuestion ID": string;
  order: string;
  unit: string;
  "enum en": string;
  "enum fr": string;
}

async function main() {
  const csvPath = path.join(process.cwd(), "questions.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");

  const records: CsvRow[] = parse(csvContent, {
    columns: true,
    delimiter: ";",
    skip_empty_lines: true,
  });

  // Delete all existing data in the right order to respect foreign key constraints
  await prisma.answer.deleteMany({});
  await prisma.question.deleteMany({});

  // First pass: create all questions without parent relations
  for (const row of records) {
    const id = row["ID"]?.trim();
    if (!id) continue;

    const content = row["content"]?.trim().toLowerCase() || null;
    const order = parseInt(row["order"]) || 0;
    const unit = row["unit"]?.trim() || null;

    await prisma.question.upsert({
      where: { id },
      update: {
        contentType: content,
        order,
        unit,
      },
      create: {
        id,
        contentType: content,
        order,
        unit,
      },
    });
  }

  // Second pass: update parent relations and create labels/enums
  for (const row of records) {
    const id = row["ID"]?.trim();
    if (!id) continue;

    const labelEn = row["question label en"]?.trim();
    const labelFr = row["question label fr"]?.trim();
    const content = row["content"]?.trim().toLowerCase() || null;
    const parentId = row["relatedQuestion ID"]?.trim() || null;
    const enumEn = row["enum en"]?.trim();
    const enumFr = row["enum fr"]?.trim();

    // Update parentId
    if (parentId) {
      await prisma.question.update({
        where: { id },
        data: { parentId },
      });
    }

    // Create labels
    if (labelEn) {
      await prisma.questionLabel.upsert({
        where: { questionId_locale: { questionId: id, locale: "en" } },
        update: { label: labelEn },
        create: { questionId: id, locale: "en", label: labelEn },
      });
    }
    if (labelFr) {
      await prisma.questionLabel.upsert({
        where: { questionId_locale: { questionId: id, locale: "fr" } },
        update: { label: labelFr },
        create: { questionId: id, locale: "fr", label: labelFr },
      });
    }

    // Create enum options
    if (content === "enum" && enumEn && enumFr) {
      const optionsEn = enumEn.split(",").map((s: string) => s.trim());
      const optionsFr = enumFr.split(",").map((s: string) => s.trim());

      // Delete old options
      await prisma.enumOption.deleteMany({ where: { questionId: id } });

      for (let i = 0; i < optionsEn.length; i++) {
        const option = await prisma.enumOption.create({
          data: {
            questionId: id,
            order: i,
          },
        });

        await prisma.enumOptionLabel.createMany({
          data: [
            { enumOptionId: option.id, locale: "en", label: optionsEn[i] },
            {
              enumOptionId: option.id,
              locale: "fr",
              label: optionsFr[i] || optionsEn[i],
            },
          ],
        });
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
