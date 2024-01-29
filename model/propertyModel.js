const db = require('../config/dbConfig');

async function getAllProperties() {
  try {
    const [rows] = await db.promise().query('SELECT * FROM Properties');
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getPropertyById(propertyId) {
  try {
    const [rows] = await db.promise().query('SELECT * FROM Properties WHERE PropertyID = ?', [propertyId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function createProperty(owner, name, location, description, image, numFloors) {
  try {
    const [result] = await db.promise().query('INSERT INTO Properties (owner_id, name, location, description, image_url, num_floors) VALUES (?, ?, ?, ?, ?, ?)', [owner, name, location, description, image, numFloors]);
    return result;
  } catch (error) {
    console.error(error)
    throw error;
  }
}

async function updateProperty(property, propertyId) {
  try {
    const [result] = await db.promise().query('UPDATE Properties SET ? WHERE PropertyID = ?', [property, propertyId]);
    return result;
  } catch (error) {
    throw error;
  }
}

async function deleteProperty(propertyId) {
  try {
    const [result] = await db.promise().query('DELETE FROM Properties WHERE PropertyID = ?', [propertyId]);
    return result;
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
};
