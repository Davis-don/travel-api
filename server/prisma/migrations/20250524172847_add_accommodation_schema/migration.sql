-- CreateTable
CREATE TABLE "Accommodation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "circuit" TEXT NOT NULL,
    "class" INTEGER NOT NULL,
    "serviceLevelId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Accommodation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccommodationType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AccommodationType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceLevel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ServiceLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "RoomType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amenity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AccommodationRooms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AccommodationRooms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AccommodationAmenities" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AccommodationAmenities_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccommodationType_name_key" ON "AccommodationType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceLevel_name_key" ON "ServiceLevel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Amenity_name_key" ON "Amenity"("name");

-- CreateIndex
CREATE INDEX "_AccommodationRooms_B_index" ON "_AccommodationRooms"("B");

-- CreateIndex
CREATE INDEX "_AccommodationAmenities_B_index" ON "_AccommodationAmenities"("B");

-- AddForeignKey
ALTER TABLE "Accommodation" ADD CONSTRAINT "Accommodation_serviceLevelId_fkey" FOREIGN KEY ("serviceLevelId") REFERENCES "ServiceLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accommodation" ADD CONSTRAINT "Accommodation_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "AccommodationType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccommodationRooms" ADD CONSTRAINT "_AccommodationRooms_A_fkey" FOREIGN KEY ("A") REFERENCES "Accommodation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccommodationRooms" ADD CONSTRAINT "_AccommodationRooms_B_fkey" FOREIGN KEY ("B") REFERENCES "RoomType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccommodationAmenities" ADD CONSTRAINT "_AccommodationAmenities_A_fkey" FOREIGN KEY ("A") REFERENCES "Accommodation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccommodationAmenities" ADD CONSTRAINT "_AccommodationAmenities_B_fkey" FOREIGN KEY ("B") REFERENCES "Amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
