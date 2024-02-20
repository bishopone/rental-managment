const roomModel = require('../model/roomModel');

async function getAllRoomsInPropertys (req, res) {

    try {
        console.log("selam")
        console.log(req.userId)
        const rooms = await roomModel.getAllRoomsInPropertys(req.userId);
        res.status(200).json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch rooms in property' });
    }
}
async function getAllRoomsInProperty (req, res) {
    const { PropertyID } = req.params;

    try {
        const rooms = await roomModel.getAllRoomsInProperty(PropertyID);
        res.status(200).json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch rooms in property' });
    }
}

async function getRoomById (req, res) {
    try {
        const roomID = req.params.roomID
        const room = await roomModel.getRoomById(roomID);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json(room);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
async function createRoom(req, res) {
    const PropertyID = req.params.PropertyID;
    const roomData = req.body;
    try {
        const result = await roomModel.createRoom(PropertyID, roomData);
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
        console.log("selam", roomID,roomData);
        const result = await roomModel.updateRoom(roomID, roomData);
        // if (result.affectedRows === 0) {
        //     res.status(404).json({ error: 'Room not found' });
        // } else {
        // }
        res.status(200).json({ message: 'Room updated' });
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
    getAllRoomsInProperty,
    getAllRoomsInPropertys,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom
};
