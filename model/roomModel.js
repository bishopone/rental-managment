const db = require('../config/dbConfig');

async function createRoom(propertyID, roomData) {
    const { roomNumber, roomType, capacity, status, description, price, amenities, floorNumber } = roomData;
    try {
        const [result] = await db.promise().query('INSERT INTO Room (PropertyID, RoomNumber, RoomType, Capacity, Status, Description, Price, Amenities, FloorNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [propertyID, roomNumber, roomType, capacity, status, description, price, amenities, floorNumber]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getRoomById(roomID) {
    try {
        const [rows] = await db.promise().query('SELECT * FROM Room WHERE RoomID = ?', [roomID]);
        return rows[0];
    } catch (error) {
        throw error;
    }
}

async function updateRoom(roomID, roomData) {
    const { roomNumber, roomType, capacity, status, description, price, amenities, floorNumber } = roomData;
    try {
        const [result] = await db.promise().query('UPDATE Room SET RoomNumber = ?, RoomType = ?, Capacity = ?, Status = ?, Description = ?, Price = ?, Amenities = ?, FloorNumber = ? WHERE RoomID = ?', [roomNumber, roomType, capacity, status, description, price, amenities, floorNumber, roomID]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function deleteRoom(roomID) {
    try {
        const [result] = await db.promise().query('DELETE FROM Room WHERE RoomID = ?', [roomID]);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createRoom,
    getRoomById,
    updateRoom,
    deleteRoom
};
