/*
  Warnings:

  - You are about to drop the column `pw` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[firebase_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firebase_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_user_id_fkey";

-- DropForeignKey
ALTER TABLE "RecipeTags" DROP CONSTRAINT "RecipeTags_recipe_id_fkey";

-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "pw",
ADD COLUMN     "firebase_id" TEXT NOT NULL,
ADD COLUMN     "username" TEXT DEFAULT 'anonymouse';

-- CreateIndex
CREATE UNIQUE INDEX "User_firebase_id_key" ON "User"("firebase_id");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("firebase_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTags" ADD CONSTRAINT "RecipeTags_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
