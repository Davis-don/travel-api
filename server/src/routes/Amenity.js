// routes/amenity.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const client = new PrismaClient();

// ✅ Add a new amenity
router.post('/add-amenity', async (req, res) => {
  const { name } = req.body;

  try {
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'A valid "name" is required.' });
    }

    const amenity = await client.amenity.create({
      data: { name },
    });

    return res.status(201).json({
      message: 'Amenity added successfully!',
      amenity,
    });
  } catch (error) {
    console.error('Error adding amenity:', error);

    let message = 'An error occurred while adding the amenity.';
    if (error.code === 'P2002') {
      message = `Amenity with name "${name}" already exists.`;
    }

    res.status(500).json({ message });
  }
});

// ✅ Delete amenity by ID
router.delete('/delete-amenity-by-id', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  try {
    // 1. Check if the amenity exists
    const amenity = await client.amenity.findUnique({
      where: { id: String(id) }
    });

    if (!amenity) {
      return res.status(404).json({
        message: `Amenity with id ${id} does not exist.`
      });
    }

    // 2. Check if the amenity is linked to any accommodations
    const linkedAmenities = await client.accommodationAmenity.findMany({
      where: { amenityId: String(id) },
      select: {
        id: true,
        accommodation: {
          select: { id: true, name: true }
        }
      }
    });

    if (linkedAmenities.length > 0) {
      return res.status(400).json({
        message: `Cannot delete amenity because it is linked to ${linkedAmenities.length} accommodation(s).`,
        details: {
          actionRequired: "Please delete or unlink these accommodation associations first.",
          linkedAccommodations: linkedAmenities.map(link => ({
            accommodationId: link.accommodation.id,
            accommodationName: link.accommodation.name
          }))
        }
      });
    }

    // 3. No links — safe to delete
    const deleted = await client.amenity.delete({
      where: { id: String(id) }
    });

    return res.json({
      message: `Amenity successfully deleted.`,
      amenity: deleted,
    });

  } catch (error) {
    console.error('Error deleting amenity:', error);
    return res.status(500).json({
      message: 'Internal server error while deleting amenity',
      error: error.message
    });
  }
});


// ✅ Delete all amenities
router.delete('/delete-all-amenities', async (req, res) => {
  try {
    const deleted = await client.amenity.deleteMany();
    res.json({
      message: `Deleted ${deleted.count} amenity(ies) successfully.`,
      count: deleted.count,
    });
  } catch (error) {
    console.error('Error deleting all amenities:', error);
    res.status(500).json({ message: `Failed to delete all amenities: ${error.message}` });
  }
});

// ✅ Fetch amenity by ID
router.get('/fetch-amenity-by-id/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const amenity = await client.amenity.findUnique({ where: { id } });

    if (!amenity) {
      return res.status(404).json({ message: `Amenity with id ${id} not found` });
    }

    res.status(200).json(amenity);
  } catch (error) {
    console.error('Error fetching amenity:', error);
    res.status(500).json({ message: 'An error occurred while fetching the amenity.' });
  }
});

// ✅ Fetch all amenities
router.get('/fetch-all-amenities', async (req, res) => {
  try {
    const amenities = await client.amenity.findMany();
    res.status(200).json(amenities);
  } catch (error) {
    console.error('Error fetching amenities:', error);
    res.status(500).json({ message: 'An error occurred while fetching amenities.' });
  }
});

export default router;
