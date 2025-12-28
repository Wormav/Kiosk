import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Get all questions to know their IDs
  const questions = await prisma.question.findMany({
    select: { id: true, contentType: true, parentId: true },
  });

  console.log(
    `Loaded ${questions.length} questions from database`,
  );
  console.log(
    `CUSTOM questions:`,
    questions.filter((q) => q.id.startsWith("CUSTOM")),
  );

  // Find table questions and their children
  const enumQuestions = questions.filter((q) => q.contentType === "enum");

  // Get enum options for enum questions
  const enumOptions = await prisma.enumOption.findMany({
    where: { questionId: { in: enumQuestions.map((q) => q.id) } },
    include: { labels: true },
  });

  // === SESSION 1: French company "TechCorp France" ===
  const session1 = await prisma.formSession.upsert({
    where: { id: "session-techcorp-france" },
    update: {},
    create: { id: "session-techcorp-france" },
  });

  // Delete existing answers for this session to avoid duplicates
  await prisma.answer.deleteMany({ where: { sessionId: session1.id } });

  // Answers for session 1
  const session1Answers: {
    questionId: string;
    value: string;
    rowIndex?: number;
    rowLabel?: string;
  }[] = [];

  // Find specific questions
  const globalEmployeesTable = questions.find((q) => q.id === "S1-6_01");
  const employeesByCountryTable = questions.find((q) => q.id === "S1-6_04");
  const employeesByContractTable = questions.find((q) => q.id === "S1-6_07");
  const revenueByRegionTable = questions.find((q) => q.id === "CUSTOM_03");

  // Global employees (S1-6_01) - children: S1-6_02, S1-6_03, S1-6_11
  if (globalEmployeesTable) {
    // Row 1: Total
    session1Answers.push(
      { questionId: "S1-6_02", value: "1250", rowIndex: 0, rowLabel: "Total" },
      { questionId: "S1-6_03", value: "1180", rowIndex: 0, rowLabel: "Total" },
      { questionId: "S1-6_11", value: "85", rowIndex: 0, rowLabel: "Total" },
    );
  }

  // Employees by country (S1-6_04) - children: S1-6_05, S1-6_06
  if (employeesByCountryTable) {
    // Row 1: France
    session1Answers.push(
      { questionId: "S1-6_05", value: "850", rowIndex: 0, rowLabel: "France" },
      { questionId: "S1-6_06", value: "820", rowIndex: 0, rowLabel: "France" },
    );
    // Row 2: Germany
    session1Answers.push(
      {
        questionId: "S1-6_05",
        value: "250",
        rowIndex: 1,
        rowLabel: "Allemagne",
      },
      {
        questionId: "S1-6_06",
        value: "230",
        rowIndex: 1,
        rowLabel: "Allemagne",
      },
    );
    // Row 3: Spain
    session1Answers.push(
      { questionId: "S1-6_05", value: "150", rowIndex: 2, rowLabel: "Espagne" },
      { questionId: "S1-6_06", value: "130", rowIndex: 2, rowLabel: "Espagne" },
    );
  }

  // Employees by contract (S1-6_07) - children: S1-6_08, S1-6_09, S1-6_10
  if (employeesByContractTable) {
    // Row 1: CDI Hommes
    session1Answers.push(
      {
        questionId: "S1-6_08",
        value: "520",
        rowIndex: 0,
        rowLabel: "CDI Hommes",
      },
      {
        questionId: "S1-6_09",
        value: "500",
        rowIndex: 0,
        rowLabel: "CDI Hommes",
      },
      {
        questionId: "S1-6_10",
        value: "25",
        rowIndex: 0,
        rowLabel: "CDI Hommes",
      },
    );
    // Row 2: CDI Femmes
    session1Answers.push(
      {
        questionId: "S1-6_08",
        value: "480",
        rowIndex: 1,
        rowLabel: "CDI Femmes",
      },
      {
        questionId: "S1-6_09",
        value: "460",
        rowIndex: 1,
        rowLabel: "CDI Femmes",
      },
      {
        questionId: "S1-6_10",
        value: "30",
        rowIndex: 1,
        rowLabel: "CDI Femmes",
      },
    );
    // Row 3: CDD
    session1Answers.push(
      { questionId: "S1-6_08", value: "250", rowIndex: 2, rowLabel: "CDD" },
      { questionId: "S1-6_09", value: "220", rowIndex: 2, rowLabel: "CDD" },
      { questionId: "S1-6_10", value: "30", rowIndex: 2, rowLabel: "CDD" },
    );
  }

  // Revenue by region (CUSTOM_03) - children: CUSTOM_04, CUSTOM_05, CUSTOM_06
  if (revenueByRegionTable) {
    console.log("Found CUSTOM_03 table, adding revenue by region data...");
    // Get enum options for CUSTOM_06
    const custom06Options = enumOptions.filter((o) => o.questionId === "CUSTOM_06");
    console.log(`Found ${custom06Options.length} options for CUSTOM_06`);

    // Row 1: Île-de-France
    session1Answers.push(
      {
        questionId: "CUSTOM_04",
        value: "12500000",
        rowIndex: 0,
        rowLabel: "Île-de-France",
      },
      {
        questionId: "CUSTOM_05",
        value: "850",
        rowIndex: 0,
        rowLabel: "Île-de-France",
      },
    );
    if (custom06Options.length > 0) {
      session1Answers.push({
        questionId: "CUSTOM_06",
        value: custom06Options[0].id, // Headquarters
        rowIndex: 0,
        rowLabel: "Île-de-France",
      });
    }

    // Row 2: Auvergne-Rhône-Alpes
    session1Answers.push(
      {
        questionId: "CUSTOM_04",
        value: "4800000",
        rowIndex: 1,
        rowLabel: "Auvergne-Rhône-Alpes",
      },
      {
        questionId: "CUSTOM_05",
        value: "250",
        rowIndex: 1,
        rowLabel: "Auvergne-Rhône-Alpes",
      },
    );
    if (custom06Options.length > 1) {
      session1Answers.push({
        questionId: "CUSTOM_06",
        value: custom06Options[1].id, // Branch
        rowIndex: 1,
        rowLabel: "Auvergne-Rhône-Alpes",
      });
    }

    // Row 3: Nouvelle-Aquitaine
    session1Answers.push(
      {
        questionId: "CUSTOM_04",
        value: "2300000",
        rowIndex: 2,
        rowLabel: "Nouvelle-Aquitaine",
      },
      {
        questionId: "CUSTOM_05",
        value: "150",
        rowIndex: 2,
        rowLabel: "Nouvelle-Aquitaine",
      },
    );
    if (custom06Options.length > 2) {
      session1Answers.push({
        questionId: "CUSTOM_06",
        value: custom06Options[2].id, // Remote
        rowIndex: 2,
        rowLabel: "Nouvelle-Aquitaine",
      });
    }
  }

  // Enum questions - find first option for each (excluding CUSTOM_06 as it's handled in table)
  for (const enumQ of enumQuestions) {
    // Skip CUSTOM_06 as it's already handled in the CUSTOM_03 table section
    if (enumQ.id === "CUSTOM_06") continue;

    const options = enumOptions.filter((o) => o.questionId === enumQ.id);
    if (options.length > 0) {
      session1Answers.push({
        questionId: enumQ.id,
        value: options[0].id,
      });
    }
  }

  console.log(`Total answers for session 1: ${session1Answers.length}`);
  console.log(
    `CUSTOM answers:`,
    session1Answers.filter((a) => a.questionId.startsWith("CUSTOM")),
  );

  // Insert session 1 answers
  for (const answer of session1Answers) {
    await prisma.answer.create({
      data: {
        sessionId: session1.id,
        questionId: answer.questionId,
        value: answer.value,
        rowIndex: answer.rowIndex ?? null,
        rowLabel: answer.rowLabel ?? null,
      },
    });
  }

  // === SESSION 2: UK company "GreenTech UK" ===
  const session2 = await prisma.formSession.upsert({
    where: { id: "session-greentech-uk" },
    update: {},
    create: { id: "session-greentech-uk" },
  });

  // Delete existing answers for this session to avoid duplicates
  await prisma.answer.deleteMany({ where: { sessionId: session2.id } });

  const session2Answers: {
    questionId: string;
    value: string;
    rowIndex?: number;
    rowLabel?: string;
  }[] = [];

  // Global employees
  if (globalEmployeesTable) {
    session2Answers.push(
      { questionId: "S1-6_02", value: "3500", rowIndex: 0, rowLabel: "Total" },
      { questionId: "S1-6_03", value: "3200", rowIndex: 0, rowLabel: "Total" },
      { questionId: "S1-6_11", value: "420", rowIndex: 0, rowLabel: "Total" },
    );
  }

  // Employees by country
  if (employeesByCountryTable) {
    session2Answers.push(
      {
        questionId: "S1-6_05",
        value: "2100",
        rowIndex: 0,
        rowLabel: "United Kingdom",
      },
      {
        questionId: "S1-6_06",
        value: "1950",
        rowIndex: 0,
        rowLabel: "United Kingdom",
      },
    );
    session2Answers.push(
      { questionId: "S1-6_05", value: "800", rowIndex: 1, rowLabel: "Ireland" },
      { questionId: "S1-6_06", value: "750", rowIndex: 1, rowLabel: "Ireland" },
    );
    session2Answers.push(
      {
        questionId: "S1-6_05",
        value: "600",
        rowIndex: 2,
        rowLabel: "Netherlands",
      },
      {
        questionId: "S1-6_06",
        value: "500",
        rowIndex: 2,
        rowLabel: "Netherlands",
      },
    );
  }

  // Employees by contract
  if (employeesByContractTable) {
    session2Answers.push(
      {
        questionId: "S1-6_08",
        value: "1800",
        rowIndex: 0,
        rowLabel: "Permanent Male",
      },
      {
        questionId: "S1-6_09",
        value: "1700",
        rowIndex: 0,
        rowLabel: "Permanent Male",
      },
      {
        questionId: "S1-6_10",
        value: "180",
        rowIndex: 0,
        rowLabel: "Permanent Male",
      },
    );
    session2Answers.push(
      {
        questionId: "S1-6_08",
        value: "1400",
        rowIndex: 1,
        rowLabel: "Permanent Female",
      },
      {
        questionId: "S1-6_09",
        value: "1300",
        rowIndex: 1,
        rowLabel: "Permanent Female",
      },
      {
        questionId: "S1-6_10",
        value: "150",
        rowIndex: 1,
        rowLabel: "Permanent Female",
      },
    );
    session2Answers.push(
      {
        questionId: "S1-6_08",
        value: "300",
        rowIndex: 2,
        rowLabel: "Fixed-term",
      },
      {
        questionId: "S1-6_09",
        value: "200",
        rowIndex: 2,
        rowLabel: "Fixed-term",
      },
      {
        questionId: "S1-6_10",
        value: "90",
        rowIndex: 2,
        rowLabel: "Fixed-term",
      },
    );
  }

  // Revenue by region (CUSTOM_03) for session 2
  if (revenueByRegionTable) {
    // Get enum options for CUSTOM_06
    const custom06Options = enumOptions.filter((o) => o.questionId === "CUSTOM_06");

    // Row 1: London
    session2Answers.push(
      {
        questionId: "CUSTOM_04",
        value: "45000000",
        rowIndex: 0,
        rowLabel: "London",
      },
      {
        questionId: "CUSTOM_05",
        value: "2100",
        rowIndex: 0,
        rowLabel: "London",
      },
    );
    if (custom06Options.length > 0) {
      session2Answers.push({
        questionId: "CUSTOM_06",
        value: custom06Options[0].id, // Headquarters
        rowIndex: 0,
        rowLabel: "London",
      });
    }

    // Row 2: Dublin
    session2Answers.push(
      {
        questionId: "CUSTOM_04",
        value: "18500000",
        rowIndex: 1,
        rowLabel: "Dublin",
      },
      {
        questionId: "CUSTOM_05",
        value: "800",
        rowIndex: 1,
        rowLabel: "Dublin",
      },
    );
    if (custom06Options.length > 1) {
      session2Answers.push({
        questionId: "CUSTOM_06",
        value: custom06Options[1].id, // Branch
        rowIndex: 1,
        rowLabel: "Dublin",
      });
    }

    // Row 3: Amsterdam
    session2Answers.push(
      {
        questionId: "CUSTOM_04",
        value: "14200000",
        rowIndex: 2,
        rowLabel: "Amsterdam",
      },
      {
        questionId: "CUSTOM_05",
        value: "600",
        rowIndex: 2,
        rowLabel: "Amsterdam",
      },
    );
    if (custom06Options.length > 1) {
      session2Answers.push({
        questionId: "CUSTOM_06",
        value: custom06Options[1].id, // Branch
        rowIndex: 2,
        rowLabel: "Amsterdam",
      });
    }
  }

  // Enum questions - use second option if available (excluding CUSTOM_06 as it's handled in table)
  for (const enumQ of enumQuestions) {
    // Skip CUSTOM_06 as it's already handled in the CUSTOM_03 table section
    if (enumQ.id === "CUSTOM_06") continue;

    const options = enumOptions.filter((o) => o.questionId === enumQ.id);
    if (options.length > 1) {
      session2Answers.push({
        questionId: enumQ.id,
        value: options[1].id,
      });
    } else if (options.length > 0) {
      session2Answers.push({
        questionId: enumQ.id,
        value: options[0].id,
      });
    }
  }

  // Insert session 2 answers
  for (const answer of session2Answers) {
    await prisma.answer.create({
      data: {
        sessionId: session2.id,
        questionId: answer.questionId,
        value: answer.value,
        rowIndex: answer.rowIndex ?? null,
        rowLabel: answer.rowLabel ?? null,
      },
    });
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
