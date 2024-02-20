const db = require('../config/dbConfig');

async function createRoomType(roomTypeData) {
    try {
        const { TypeName, Description } = roomTypeData;
        const [result] = await db.promise().query('INSERT INTO roomtypes (TypeName,	Description	) VALUES (?, ?)', [TypeName, Description]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getAllRoomTypes() {
    try {
        const [rows] = await db.promise().query('SELECT * FROM roomtypes ')
        return rows;
    } catch (error) {
        throw error;
    }
}

async function updateRoomType(roomTypeID, roomTypeData) {
    const { name, description } = roomTypeData;
    try {
        const [result] = await db.promise().query('UPDATE roomtypes SET Name = ?, Description = ? WHERE RoomTypeID = ?', [name, description, roomTypeID]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function deleteRoomType(roomTypeID) {
    try {
        const [result] = await db.promise().query('DELETE FROM roomtypes WHERE RoomTypeID = ?', [roomTypeID]);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createRoomType,
    getAllRoomTypes,
    updateRoomType,
    deleteRoomType
};
