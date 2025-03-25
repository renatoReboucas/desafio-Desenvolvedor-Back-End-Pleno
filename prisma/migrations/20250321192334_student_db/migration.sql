-- CreateTable
CREATE TABLE "Student" (
    "ra" SERIAL NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("ra")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_cpf_key" ON "Student"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");
