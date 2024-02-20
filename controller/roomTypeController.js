const roomTypeModel = require('../model/roomTypeModel');

async function createRoomType(req, res) {
    try {
        const roomTypeData = req.body;
        const result = await roomTypeModel.createRoomType(roomTypeData);
        res.status(201).json({ message: 'Room type created', roomTypeID: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred while creating the room type. Please try again later.' });
    }
}

async function updateRoomType(req, res) {
    try {
        const roomTypeID = req.params.roomTypeID;
        const roomTypeData = req.body;
        const result = await roomTypeModel.updateRoomType(roomTypeID, roomTypeData);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Room type not found' });
        } else {
            res.status(200).json({ message: 'Room type updated' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred while updating the room type. Please try again later.' });
    }
}

async function deleteRoomType(req, res) {
    const roomTypeID = req.params.roomTypeID;
    try {
        const result = await roomTypeModel.deleteRoomType(roomTypeID);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Room type not found' });
        } else {
            res.status(200).json({ message: 'Room type deleted', roomTypeID });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred while deleting the room type. Please try again later.' });
    }
}


async function getAllRoomTypes(req, res) {
    try {
        const roomTypes = await roomTypeModel.getAllRoomTypes();
        res.json(roomTypes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred while fetching room types. Please try again later.' });
    }
}

module.exports = {
    getAllRoomTypes,
    createRoomType,
    updateRoomType,
    deleteRoomType
};