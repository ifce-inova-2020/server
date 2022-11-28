-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "campus" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ConsumerCSV" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" TEXT NOT NULL,
    "m_pa_p" REAL,
    "m_pa_fp" REAL,
    "m_pr_p" REAL,
    "m_pr_fp" REAL
);

-- CreateTable
CREATE TABLE "Wrist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pa_p" INTEGER NOT NULL,
    "pa_fp" INTEGER NOT NULL,
    "pr_p" INTEGER NOT NULL,
    "pr_fp" INTEGER NOT NULL,
    "consumerCSVId" TEXT NOT NULL,
    CONSTRAINT "Wrist_consumerCSVId_fkey" FOREIGN KEY ("consumerCSVId") REFERENCES "ConsumerCSV" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_email_key" ON "users"("id", "email");
