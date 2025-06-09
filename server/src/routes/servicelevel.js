// routes/serviceLevel.js
import express from 'express';
import { PrismaClient } from '@prisma/client';


const router = express.Router();
const client = new PrismaClient();

// Add a new service level

router.post('/add-service-level', async (req, res) => {
  const { name } = req.body; // ✅ Define it before the try-catch

  try {
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'A valid "name" is required.' });
    }

    const serviceLevel = await client.serviceLevel.create({
      data: { name },
    });

    return res.status(201).json({
      message: 'Service level added successfully!',
      serviceLevel,
    });
  } catch (error) {
    console.error('Error adding service level:', error);

    let message = 'An error occurred while adding the service level.';
    if (error.code === 'P2002') {
      message = `Service level with name "${name}" already exists.`; // ✅ Now 'name' is defined
    }

    res.status(500).json({ message });
  }
});


// Delete service level by ID
router.delete('/delete-service-level', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  try {
    // Check if there are accommodations linked to this service level
    const linkedAccommodations = await client.accommodation.findMany({
      where: { serviceLevelId: String(id) },
      select: { id: true, name: true }
    });

    if (linkedAccommodations.length > 0) {
      return res.status(400).json({
        message: `Cannot delete service level with id ${id} because it is linked to ${linkedAccommodations.length} accommodation(s). Please delete them first.`,
        linkedAccommodations
      });
    }

    // No accommodations linked, proceed with deletion
    const deleted = await client.serviceLevel.delete({
      where: { id: String(id) }
    });

    res.json({
      message: `Service level with id ${id} successfully deleted`,
      serviceLevel: deleted,
    });
  } catch (error) {
    console.error('Error deleting service level:', error);
    res.status(500).json({ message: `Failed to delete service level: ${error.message}` });
  }
});

// Delete all service levels
router.delete('/delete-all-service-levels', async (req, res) => {
  try {
    const deleted = await client.serviceLevel.deleteMany();
    res.json({
      message: `Deleted ${deleted.count} service level(s) successfully.`,
      count: deleted.count,
    });
  } catch (error) {
    console.error('Error deleting all service levels:', error);
    res.status(500).json({ message: `Failed to delete all service levels: ${error.message}` });
  }
});

// Fetch service level by ID
router.get('/fetch-service-level-by-id/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const serviceLevel = await client.serviceLevel.findUnique({ where: { id } });

    if (!serviceLevel) {
      return res.status(404).json({ message: `Service level with id ${id} not found` });
    }

    res.status(200).json(serviceLevel);
  } catch (error) {
    console.error('Error fetching service level:', error);
    res.status(500).json({ message: 'An error occurred while fetching the service level.' });
  }
});

// Fetch all service levels
router.get('/fetch-all-service-levels', async (req, res) => {
  try {
    const serviceLevels = await client.serviceLevel.findMany();
    res.status(200).json(serviceLevels);
  } catch (error) {
    console.error('Error fetching service levels:', error);
    res.status(500).json({ message: 'An error occurred while fetching service levels.' });
  }
});

export default router;
