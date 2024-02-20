const db = require('../config/dbConfig');

async function createRoom(PropertyID, roomData) {
    const { RoomNumber, RoomType, Status, Price, Description, FloorNumber } = roomData;
    try {
        const query = 'INSERT INTO rooms ' +
            '(PropertyID, RoomNumber, RoomType, Status, Description, Price, FloorNumber)' +
            ' VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await db.promise().query(query,
            [PropertyID, RoomNumber, RoomType, Status, Description, Price, FloorNumber]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getRoomById(roomID) {
    try {
        const query = `SELECT 
                r.Description, 
                r.FloorNumber AS "Floor Number", 
                r.Price, 
                r.PropertyID, 
                r.RoomID, 
                r.RoomNumber AS "Room Number", 
                r.RoomType AS "Room Type", 
                rt.TypeName, 
                r.Status 
            FROM 
                rooms r 
            LEFT JOIN 
                roomtypes rt ON rt.RoomTypeID = r.RoomType 
            WHERE 
                r.RoomID = ?`;
        const [rows] = await db.promise().query(query, [roomID]);
        console.log(rows[0])
        return rows[0];
    } catch (error) {
        throw error;
    }
}
async function getAllRoomsInProperty(propertyID) {
    try {
        const query = 'SELECT * FROM rooms WHERE PropertyID = ?';
        const [rows, fields] = await db.promise().query(query, [propertyID]);
        return rows;
    } catch (error) {
        throw new Error('Error fetching rooms in property');
    }
}
async function getAllRoomsInPropertys(userid) {
    try {
        const query = `SELECT rooms.*,CONCAT(p.name, ' ', rooms.RoomNumber) AS RoomData FROM rooms 
                    JOIN properties p ON p.id = rooms.PropertyID
                    JOIN userproperty up ON rooms.PropertyID = up.PropertyID
                    WHERE up.UserID = ?`;
        const [rows] = await db.promise().query(query, [userid]);
        return rows;
    } catch (error) {
        console.log(error)
        throw new Error('Error fetching rooms in property');
    }
}

async function updateRoom(roomID, roomData) {
    const { RoomNumber,
        RoomType,
        Status,
        Description,
        Price,
        FloorNumber } = roomData;
    try {
        const [result] = await db.promise().query('UPDATE rooms SET RoomNumber = ?, RoomType = ?, Status = ?, Description = ?, Price = ?, FloorNumber = ? WHERE RoomID = ?', [RoomNumber,
            RoomType,
            Status,
            Description,
            Price,
            FloorNumber, roomID]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function deleteRoom(roomID) {
    try {
        const [result] = await db.promise().query('DELETE FROM rooms WHERE RoomID = ?', [roomID]);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllRoomsInProperty,
    getAllRoomsInPropertys,
    createRoom,
    getRoomById,
    updateRoom,
    deleteRoom
};
