/*
  Warnings:

  - You are about to drop the `_AccommodationAmenities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AccommodationRooms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Accommodation" DROP CONSTRAINT "Accommodation_serviceLevelId_fkey";

-- DropForeignKey
ALTER TABLE "Accommodation" DROP CONSTRAINT "Accommodation_typeId_fkey";

-- DropForeignKey
ALTER TABLE "_AccommodationAmenities" DROP CONSTRAINT "_AccommodationAmenities_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccommodationAmenities" DROP CONSTRAINT "_AccommodationAmenities_B_fkey";

-- DropForeignKey
ALTER TABLE "_AccommodationRooms" DROP CONSTRAINT "_AccommodationRooms_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccommodationRooms" DROP CONSTRAINT "_AccommodationRooms_B_fkey";

-- DropTable
DROP TABLE "_AccommodationAmenities";

-- DropTable
DROP TABLE "_AccommodationRooms";

-- CreateTable
CREATE TABLE "AccommodationRoom" (
    "accommodationId" TEXT NOT NULL,
    "roomTypeId" TEXT NOT NULL,

    CONSTRAINT "AccommodationRoom_pkey" PRIMARY KEY ("accommodationId","roomTypeId")
);

-- CreateTable
CREATE TABLE "AccommodationAmenity" (
    "accommodationId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,

    CONSTRAINT "AccommodationAmenity_pkey" PRIMARY KEY ("accommodationId","amenityId")
);

-- AddForeignKey
ALTER TABLE "Accommodation" ADD CONSTRAINT "Accommodation_serviceLevelId_fkey" FOREIGN KEY ("serviceLevelId") REFERENCES "ServiceLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accommodation" ADD CONSTRAINT "Accommodation_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "AccommodationType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccommodationRoom" ADD CONSTRAINT "AccommodationRoom_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "Accommodation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccommodationRoom" ADD CONSTRAINT "AccommodationRoom_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccommodationAmenity" ADD CONSTRAINT "AccommodationAmenity_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "Accommodation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccommodationAmenity" ADD CONSTRAINT "AccommodationAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
