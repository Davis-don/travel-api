// routes/roomType.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const client = new PrismaClient();

// Add a new room type
router.post('/add-room-type', async (req, res) => {
  const { name, capacity } = req.body;

  try {
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'A valid "name" is required.' });
    }

    if (!capacity || typeof capacity !== 'number' || capacity <= 0) {
      return res.status(400).json({ message: 'A valid "capacity" (positive integer) is required.' });
    }

    const roomType = await client.roomType.create({
      data: { name, capacity },
    });

    res.status(201).json({
      message: 'Room type added successfully!',
      roomType,
    });
  } catch (error) {
    console.error('Error adding room type:', error);
    res.status(500).json({ message: 'An error occurred while adding the room type.' });
  }
});

// Delete room type by ID
router.delete('/delete-room-type-by-id', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  try {
    // 1. Check if the room type exists
    const roomType = await client.roomType.findUnique({
      where: { id: String(id) }
    });

    if (!roomType) {
      return res.status(404).json({
        message: `Room type with id ${id} does not exist.`
      });
    }

    // 2. Check if the room type is linked to any accommodations
    const linkedRooms = await client.accommodationRoom.findMany({
      where: { roomTypeId: String(id) },
      select: {
        id: true,
        accommodation: {
          select: { id: true, name: true }
        }
      }
    });

    if (linkedRooms.length > 0) {
      return res.status(400).json({
        message: `Cannot delete room type because it is linked to ${linkedRooms.length} accommodation(s).`,
        details: {
          actionRequired: "Please delete or unlink these room associations first.",
          linkedRooms: linkedRooms.map(room => ({
            accommodationId: room.accommodation.id,
            accommodationName: room.accommodation.name
          }))
        }
      });
    }

    // 3. No links — safe to delete
    const deleted = await client.roomType.delete({
      where: { id: String(id) }
    });

    return res.json({
      message: `Room type successfully deleted.`,
      roomType: deleted,
    });

  } catch (error) {
    console.error('Error deleting room type:', error);
    return res.status(500).json({
      message: 'Internal server error while deleting room type',
      error: error.message
    });
  }
});


// Delete all room types
router.delete('/delete-all-room-types', async (req, res) => {
  try {
    const deleted = await client.roomType.deleteMany();

    res.json({
      message: `Deleted ${deleted.count} room type(s) successfully.`,
      count: deleted.count,
    });
  } catch (error) {
    console.error('Error deleting all room types:', error);
    res.status(500).json({ message: `Failed to delete all room types: ${error.message}` });
  }
});

// Fetch room type by ID
router.get('/fetch-room-type-by-id/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const roomType = await client.roomType.findUnique({ where: { id } });

    if (!roomType) {
      return res.status(404).json({ message: `Room type with id ${id} not found.` });
    }

    res.status(200).json(roomType);
  } catch (error) {
    console.error('Error fetching room type:', error);
    res.status(500).json({ message: 'An error occurred while fetching the room type.' });
  }
});

// Fetch all room types
router.get('/fetch-all-room-types', async (req, res) => {
  try {
    const roomTypes = await client.roomType.findMany();
    res.status(200).json(roomTypes);
  } catch (error) {
    console.error('Error fetching room types:', error);
    res.status(500).json({ message: 'An error occurred while fetching room types.' });
  }
});

export default router;
