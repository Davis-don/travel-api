import express from 'express';
import { PrismaClient } from '@prisma/client';
import e from 'express';

const router = express.Router();
const client = new PrismaClient();

// Add a new accommodation
// router.post('/add-accommodation', async (req, res) => {
//   const {
//     name,
//     description,
//     city,
//     county,
//     country,
//     circuit,
//     class: starClass,
//     serviceLevelId,
//     typeId,
//     imgUrl,
//     publicId,
//     roomTypeIds = [],
//     amenityIds = [],
//   } = req.body;

//   try {
//     // Validate required fields
//     if (
//       !name || !description || !city || !county || !country || !circuit ||
//       typeof starClass !== 'number' || !serviceLevelId || !typeId ||
//       !imgUrl || !publicId
//     ) {
//       return res.status(400).json({ message: 'Missing or invalid required fields.' });
//     }

//     // Create the accommodation
//     const newAccommodation = await client.accommodation.create({
//       data: {
//         name,
//         description,
//         city,
//         county,
//         country,
//         circuit,
//         class: starClass,
//         imgUrl,
//         publicId,
//         serviceLevel: { connect: { id: serviceLevelId } },
//         type: { connect: { id: typeId } },
//       },
//     });

//     // Add related room types
//     if (roomTypeIds.length) {
//       await client.accommodationRoom.createMany({
//         data: roomTypeIds.map((roomTypeId) => ({
//           accommodationId: newAccommodation.id,
//           roomTypeId,
//         })),
//         skipDuplicates: true,
//       });
//     }

//     // Add related amenities
//     if (amenityIds.length) {
//       await client.accommodationAmenity.createMany({
//         data: amenityIds.map((amenityId) => ({
//           accommodationId: newAccommodation.id,
//           amenityId,
//         })),
//         skipDuplicates: true,
//       });
//     }

//     // Fetch accommodation with corrected relations
//     const fullAccommodation = await client.accommodation.findUnique({
//       where: { id: newAccommodation.id },
//       include: {
//         serviceLevel: true,
//         type: true,
//         rooms: { include: { roomType: true } },
//         amenities: { include: { amenity: true } },
//       },
//     });

//     res.status(201).json({ message: 'Accommodation added successfully!', accommodation: fullAccommodation });
//   } catch (error) {
//     console.error('Error adding accommodation:', error);
//     res.status(500).json({ message: 'An error occurred while adding the accommodation.' });
//   }
// });

// // Fetch accommodation by ID
// router.get('/fetch-accommodation-by-id/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const accommodation = await client.accommodation.findUnique({
//       where: { id },
//       include: {
//         serviceLevel: true,
//         type: true,
//         rooms: { include: { roomType: true } },
//         amenities: { include: { amenity: true } },
//       },
//     });

//     if (!accommodation) {
//       return res.status(404).json({ message: `Accommodation with id ${id} not found.` });
//     }

//     res.status(200).json(accommodation);
//   } catch (error) {
//     console.error('Error fetching accommodation:', error);
//     res.status(500).json({ message: 'An error occurred while fetching the accommodation.' });
//   }
// });

// Fetch all accommodations


router.get('/fetch-all-accommodations', async (req, res) => {
  try {
    const data = await client.accommodation.findMany({
      include: {
        serviceLevel: true,
        type: true,
        rooms: {
          include: {
            roomType: true // This is valid inside AccommodationRoom
          }
        },
        amenities: {
          include: {
            amenity: true // This is valid inside AccommodationAmenity
          }
        }
      }
    });

    res.status(200).json(data.length ? data : []);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});




// // Delete accommodation by ID
// router.delete('/delete-accommodation-by-id', async (req, res) => {
//   const { id } = req.query;

//   if (!id) {
//     return res.status(400).json({ message: 'ID is required' });
//   }

//   try {
//     const deleted = await client.accommodation.delete({ where: { id: String(id) } });
//     res.json({
//       message: `Accommodation with id ${id} successfully deleted.`,
//       accommodation: deleted,
//     });
//   } catch (error) {
//     console.error('Error deleting accommodation:', error);
//     res.status(500).json({ message: `Failed to delete accommodation: ${error.message}` });
//   }
// });

// // Delete all accommodations
// router.delete('/delete-all-accommodations', async (req, res) => {
//   try {
//     const deleted = await client.accommodation.deleteMany();
//     res.json({
//       message: `Deleted ${deleted.count} accommodation(s) successfully.`,
//       count: deleted.count,
//     });
//   } catch (error) {
//     console.error('Error deleting all accommodations:', error);
//     res.status(500).json({ message: `Failed to delete all accommodations: ${error.message}` });
//   }
// });

export default router;

