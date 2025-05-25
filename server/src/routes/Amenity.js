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
    const deleted = await client.amenity.delete({ where: { id: String(id) } });
    res.json({
      message: `Amenity with id ${id} successfully deleted`,
      amenity: deleted,
    });
  } catch (error) {
    console.error('Error deleting amenity:', error);
    res.status(500).json({ message: `Failed to delete amenity: ${error.message}` });
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
