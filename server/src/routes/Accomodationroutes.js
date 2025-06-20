// routes/accommodationType.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const client = new PrismaClient();

// Add one or multiple accommodation types
router.post('/add-accommodation-type', async (req, res) => {
  const { name } = req.body; // ✅ Move this outside try

  try {
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'A valid "name" is required.' });
    }

    const accommodationType = await client.accommodationType.create({
      data: { name },
    });

    return res.status(201).json({
      message: 'Accommodation type added successfully!',
      accommodationType,
    });
  } catch (error) {
    console.error('Error adding accommodation type:', error);

    let message = 'An error occurred while adding the accommodation type.';
    if (error.code === 'P2002') {
      message = `Accommodation type with name "${name}" already exists.`; // ✅ 'name' now in scope
    }

    res.status(500).json({ message });
  }
});


// Delete accommodation type by ID
router.delete('/delete-accommodation-type', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  try {
    // 1. Check if the accommodation type exists
    const accommodationType = await client.accommodationType.findUnique({
      where: { id: String(id) }
    });

    if (!accommodationType) {
      return res.status(404).json({
        message: `Accommodation type with id ${id} does not exist.`
      });
    }

    // 2. Check for linked accommodations
    const linkedAccommodations = await client.accommodation.findMany({
      where: { typeId: String(id) },
      select: { id: true, name: true }
    });

    if (linkedAccommodations.length > 0) {
      return res.status(400).json({
        message: `Cannot delete accommodation type because it is linked to ${linkedAccommodations.length} accommodation(s).`,
        details: {
          actionRequired: "Please delete or reassign these accommodations first.",
          linkedAccommodations
        }
      });
    }

    // 3. No links — safe to delete
    const deleted = await client.accommodationType.delete({
      where: { id: String(id) }
    });

    return res.json({
      message: `Accommodation type successfully deleted`,
      accommodationType: deleted,
    });

  } catch (error) {
    console.error('Error deleting accommodation type:', error);
    return res.status(500).json({
      message: 'Internal server error while deleting accommodation type',
      error: error.message
    });
  }
});


// Delete all
router.delete('/delete-all-accommodation-types', async (req, res) => {
  try {
    const deleted = await client.accommodationType.deleteMany();
    res.json({
      message: `Deleted ${deleted.count} accommodation type(s) successfully.`,
      count: deleted.count,
    });
  } catch (error) {
    console.error('Error deleting all accommodation types:', error);
    res.status(500).json({ message: `Failed to delete all types: ${error.message}` });
  }
});

// Fetch by ID
router.get('/fetch-accommodation-type-by-id/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const accommodationType = await client.accommodationType.findUnique({ where: { id } });

    if (!accommodationType) {
      return res.status(404).json({ message: `AccommodationType with id ${id} not found` });
    }

    res.status(200).json(accommodationType);
  } catch (error) {
    console.error('Error fetching accommodation type:', error);
    res.status(500).json({ message: 'An error occurred while fetching the accommodation type.' });
  }
});

// Fetch all
router.get('/accommodation-types', async (req, res) => {
  try {
    const types = await client.accommodationType.findMany();
    res.status(200).json(types);
  } catch (error) {
    console.error('Error fetching accommodation types:', error);
    res.status(500).json({ message: 'An error occurred while fetching accommodation types.' });
  }
});

export default router;
