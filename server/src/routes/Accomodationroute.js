import express from 'express';
import { PrismaClient } from '@prisma/client';
import { deleteCloudinaryImage } from '../controllers/deletefromClaudinary.js';

const router = express.Router();
const client = new PrismaClient();

router.post('/add-accommodation', async (req, res) => {
  const {
    name,
    description,
    city,
    county,
    country,
    circuit,
    class: starClass,
    serviceLevelId,
    typeId,
    imgUrl,
    publicId,
    rooms = [],      // array of { roomTypeId }
    amenities = [],  // array of { amenityId }
  } = req.body;

  try {
    if (
      !name || !description || !city || !county || !country || !circuit ||
      typeof starClass !== 'number' || !serviceLevelId || !typeId ||
      !imgUrl || !publicId
    ) {
      return res.status(400).json({ message: 'Missing or invalid required fields.' });
    }

    // Create the accommodation
    const newAccommodation = await client.accommodation.create({
      data: {
        name,
        description,
        city,
        county,
        country,
        circuit,
        class: starClass,
        imgUrl,
        publicId,
        serviceLevel: { connect: { id: serviceLevelId } },
        type: { connect: { id: typeId } },
      },
    });

    // Add related room types
    if (rooms && rooms.length > 0) {
      await client.accommodationRoom.createMany({
        data: rooms.map(({ roomTypeId }) => ({
          accommodationId: newAccommodation.id,
          roomTypeId,
        })),
        skipDuplicates: true,
      });
    }

    // Add related amenities
    if (amenities && amenities.length > 0) {
      await client.accommodationAmenity.createMany({
        data: amenities.map(({ amenityId }) => ({
          accommodationId: newAccommodation.id,
          amenityId,
        })),
        skipDuplicates: true,
      });
    }

    // Fetch accommodation with relations
    const fullAccommodation = await client.accommodation.findUnique({
      where: { id: newAccommodation.id },
      include: {
        serviceLevel: true,
        type: true,
        rooms: { include: { roomType: true } },
        amenities: { include: { amenity: true } },
      },
    });

    res.status(201).json({ message: 'Accommodation added successfully!', accommodation: fullAccommodation });
  } catch (error) {
    console.error('Error adding accommodation:', error);
    res.status(500).json({ message: 'An error occurred while adding the accommodation.' });
  }
});

router.get('/fetch-accommodation-by-id/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const accommodation = await client.accommodation.findUnique({
      where: { id },
      include: {
        serviceLevel: true,
        type: true,
        rooms: { include: { roomType: true } },
        amenities: { include: { amenity: true } },
      },
    });

    if (!accommodation) {
      return res.status(404).json({ message: `Accommodation with id ${id} not found.` });
    }

    res.status(200).json(accommodation);
  } catch (error) {
    console.error('Error fetching accommodation:', error);
    res.status(500).json({ message: 'An error occurred while fetching the accommodation.' });
  }
});

router.get('/fetch-all-accommodations', async (req, res) => {
  try {
    const data = await client.accommodation.findMany({
      include: {
        serviceLevel: true,
        type: true,
        rooms: {
          include: {
            roomType: true 
          }
        },
        amenities: {
          include: {
            amenity: true 
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

router.delete('/delete-accommodation-by-id', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  try {
    const accommodation = await client.accommodation.findUnique({
      where: { id: String(id) },
      select: { publicId: true }
    });

    if (!accommodation) {
      return res.status(404).json({ message: `Accommodation with id ${id} not found.` });
    }

    console.log(`Public ID for accommodation ${id}: ${accommodation.publicId}`);
    const deleteClaudinaryNow = await deleteCloudinaryImage(accommodation.publicId);
    if (!deleteClaudinaryNow) {
      return res.status(500).json({ message: 'Failed to delete image from Cloudinary.' });
    }

    const deleted = await client.accommodation.delete({ where: { id: String(id) } });

    res.json({
      message: `Accommodation successfully deleted.`,
      accommodation: deleted,
    });
  } catch (error) {
    console.error('Error deleting accommodation:', error);
    res.status(500).json({ message: `Failed to delete accommodation` });
  }
});

router.delete('/delete-all-accommodations', async (req, res) => {
  try {
    const deleted = await client.accommodation.deleteMany();
    res.json({
      message: `Deleted ${deleted.count} accommodation(s) successfully.`,
      count: deleted.count,
    });
  } catch (error) {
    console.error('Error deleting all accommodations:', error);
    res.status(500).json({ message: `Failed to delete all accommodations: ${error.message}` });
  }
});

export default router;