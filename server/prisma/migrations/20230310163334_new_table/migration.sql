-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVED', 'DELETED', 'PAID');

-- CreateEnum
CREATE TYPE "InterestType" AS ENUM ('PERCENTS_PER_MONTH', 'PERCENTS_PER_DAY', 'AMOUNT_PER_MONTH', 'AMOUNT_PER_DAY');

-- CreateTable
CREATE TABLE "Loan" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVED',
    "interest" DOUBLE PRECISION NOT NULL,
    "interestType" "InterestType" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paidAmount" INTEGER,
    "paidAt" TIMESTAMP(3),
    "userPhone" TEXT,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "int" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("int")
);
