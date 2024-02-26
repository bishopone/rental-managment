const db = require('../config/dbConfig');

async function getAllProperties() {
  try {
    const [rows] = await db.promise().query('SELECT * FROM properties ');
    return rows;
  } catch (error) {
    throw error;
  }
}


async function getAllPropertiesWithAuthority(userId) {
  try {
    // Step 1: Query User Properties
    const userPropertiesQuery = `
      SELECT p.id AS propertyId, p.*, u.ProfilePicture AS UserProfile, u.Username, r.RoleName FROM properties p JOIN users u ON u.UserID = p.owner_id JOIN roles r ON r.RoleID = u.RoleID
          JOIN userproperty up ON p.id = up.PropertyID
          WHERE up.UserID = ?
          GROUP BY p.id
      `;
    const [propertyRows] = await db.promise().query(userPropertiesQuery, [userId]);

    // Step 2: Fetch Users and Rooms for Each Property
    const propertiesWithData = await Promise.all(propertyRows.map(async (propertyRow) => {
      const propertyId = propertyRow.propertyId;

      // Fetch Users for the Property
      const usersQuery = `
              SELECT u.*
              FROM users u
              JOIN userproperty up ON u.UserID = up.UserID
              WHERE up.PropertyID = ?
          `;
      const [userRows] = await db.promise().query(usersQuery, [propertyId]);

      // Fetch Rooms for the Property
      const roomsQuery = `
              SELECT *
              FROM rooms
              WHERE PropertyID = ?
          `;
      const [roomRows] = await db.promise().query(roomsQuery, [propertyId]);

      return {
        property: propertyRow,
        users: userRows,
        rooms: roomRows
      };
    }));

    // Step 3: Organize Data
    return propertiesWithData;
  } catch (error) {
    throw error;
  }
}

async function getPropertyDetailById(propertyId) {
  try {
    const propertyQuery = `SELECT p.*, u.ProfilePicture AS UserProfile, u.Username, r.RoleName FROM properties p JOIN users u ON u.UserID = p.owner_id JOIN roles r ON r.RoleID = u.RoleID WHERE id = ?`;
    const [propertyResults] = await db.promise().query(propertyQuery, [propertyId]);
    const propertyData = propertyResults[0];
    const userQuery = `SELECT u.UserID, u.Username, u.Email, u.PhoneNumber, u.ProfilePicture, u.RoleID, u.CreatedAt,  r.RoleName  FROM users u
    JOIN roles r ON r.RoleID = u.RoleID 
    JOIN userproperty up ON u.UserID = up.UserID 
    WHERE up.PropertyID = ?`;

    const [userResults] = await db.promise().query(userQuery, [propertyId]);
    const roomQuery = `SELECT * FROM rooms WHERE PropertyID = ?`;
    const [roomResults] = await db.promise().query(roomQuery, [propertyId]);
    const responseData = {
      property: propertyData,
      users: userResults,
      rooms: roomResults
    };

    return responseData;
  } catch (error) {
    throw error;
  }
}

async function getPropertyById(propertyId) {
  try {
    const [rows] = await db.promise().query('SELECT * FROM properties WHERE PropertyID = ?', [propertyId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function createProperty(owner, name, location, description, image, numFloors) {
  try {
    const [result] = await db.promise().query('INSERT INTO properties (owner_id, name, location, description, image_url, num_floors) VALUES (?, ?, ?, ?, ?, ?)', [owner, name, location, description, image, numFloors]);
    return result;
  } catch (error) {
    console.error(error)
    throw error;
  }
}
async function addManagerToProperty(proprtyid, userid) {
  try {
    const [result] = await db.promise().query('INSERT INTO properties (owner_id, name, location, description, image_url, num_floors) VALUES (?, ?, ?, ?, ?, ?)', [owner, name, location, description, image, numFloors]);
    return result;
  } catch (error) {
    console.error(error)
    throw error;
  }
}

async function updateProperty(property, propertyId) {
  try {
    const [result] = await db.promise().query('UPDATE properties SET ? WHERE PropertyID = ?', [property, propertyId]);
    return result;
  } catch (error) {
    throw error;
  }
}

async function deleteProperty(propertyId) {
  try {
    const [result] = await db.promise().query('DELETE FROM properties WHERE id = ?', [propertyId]);
    return result;
  } catch (error) {
    throw error;
  }
}

async function connectUserToProperty(userId, propertyId) {
  try {
    const query = 'INSERT INTO UserProperty (UserID, PropertyID) VALUES (?, ?)';
    await db.promise().query(query, [userId, propertyId]);
  } catch (error) {
    throw error;
  }
}

async function removeUserFromProperty(userId, propertyId) {
  try {
    const query = 'DELETE FROM UserProperty WHERE UserID = ? AND PropertyID = ?';
    await db.promise().query(query, [userId, propertyId]);
  } catch (error) {
    throw error;
  }
}
module.exports = {
    getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyDetailById,
  connectUserToProperty,
  removeUserFromProperty,
  getAllPropertiesWithAuthority
};
