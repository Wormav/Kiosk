-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "contentType" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionLabel" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "QuestionLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnumOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EnumOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnumOptionLabel" (
    "id" TEXT NOT NULL,
    "enumOptionId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "EnumOptionLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" TEXT,
    "rowIndex" INTEGER,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionLabel_questionId_locale_key" ON "QuestionLabel"("questionId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "EnumOptionLabel_enumOptionId_locale_key" ON "EnumOptionLabel"("enumOptionId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_sessionId_questionId_rowIndex_key" ON "Answer"("sessionId", "questionId", "rowIndex");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionLabel" ADD CONSTRAINT "QuestionLabel_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnumOption" ADD CONSTRAINT "EnumOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnumOptionLabel" ADD CONSTRAINT "EnumOptionLabel_enumOptionId_fkey" FOREIGN KEY ("enumOptionId") REFERENCES "EnumOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "FormSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
