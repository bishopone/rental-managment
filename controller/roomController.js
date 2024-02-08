const roomModel = require('../model/roomModel');

async function createRoom(req, res) {
    const propertyID = req.params.propertyID;
    const roomData = req.body;
    try {
        const result = await roomModel.createRoom(propertyID, roomData);
        res.status(201).json({ message: 'Room created', roomID: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred while creating the room. Please try again later.' });
    }
}

async function updateRoom(req, res) {
    const roomID = req.params.roomID;
    const roomData = req.body;
    try {
        const result = await roomModel.updateRoom(roomID, roomData);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Room not found' });
        } else {
            res.status(200).json({ message: 'Room updated' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred while updating the room. Please try again later.' });
    }
}

async function deleteRoom(req, res) {
    const roomID = req.params.roomID;
    try {
        const result = await roomModel.deleteRoom(roomID);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Room not found' });
        } else {
            res.status(200).json({ message: 'Room deleted', roomID });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred while deleting the room. Please try again later.' });
    }
}

module.exports = {
    createRoom,
    updateRoom,
    deleteRoom
};
