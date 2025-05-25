/*
  Warnings:

  - You are about to drop the column `image` on the `Accommodation` table. All the data in the column will be lost.
  - The primary key for the `_AccommodationAmenities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_AccommodationRooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_AccommodationAmenities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_AccommodationRooms` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imgUrl` to the `Accommodation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `Accommodation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Accommodation" DROP COLUMN "image",
ADD COLUMN     "imgUrl" TEXT NOT NULL,
ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "_AccommodationAmenities" DROP CONSTRAINT "_AccommodationAmenities_AB_pkey";

-- AlterTable
ALTER TABLE "_AccommodationRooms" DROP CONSTRAINT "_AccommodationRooms_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_AccommodationAmenities_AB_unique" ON "_AccommodationAmenities"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_AccommodationRooms_AB_unique" ON "_AccommodationRooms"("A", "B");
