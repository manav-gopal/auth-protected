/*
  Warnings:

  - You are about to drop the column `details` on the `Categories` table. All the data in the column will be lost.
  - Added the required column `detail` to the `Categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "details",
ADD COLUMN     "detail" TEXT NOT NULL;
