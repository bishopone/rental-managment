const permissionModel = require('../model/permissionModel');

async function getAllpermissions(req, res) {
  try {
    const [rows] = await permissionModel.getAllpermissions();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createpermission(req, res) {
  const permissions = req.body;
  try {
    const [result] = await permissionModel.createpermission(permissions);
    const createdpermissionsId = result.insertId;
    res.status(201).json({ message: 'accept reason created', permissionsId: createdpermissionsId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
async function createpermissions(req, res) {
  const permissionsList = req.body.permissions; // Assuming req.body is an array of permissions
  try {
    const [results] = await permissionModel.createpermissions(permissionsList);
    const createdPermissionsIds = results.map(result => result.insertId);
    res.status(201).json({ message: 'Permissions created', permissionsIds: createdPermissionsIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
async function getpermissionsById(req, res) {
  const permissionsId = req.params.id;
  try {
    const [rows] = await permissionModel.getpermissionsById(permissionsId);
    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ error: 'accept reason not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updatepermissions(req, res) {
  const permissionsId = req.params.id;
  const updatedpermissions = req.body;
  try {
    const [result] = await permissionModel.updatepermissions(permissionsId, updatedpermissions);
    if (result.affectedRows > 0) {
      res.json({ message: 'accept reason updated' });
    } else {
      res.status(404).json({ error: 'accept reason not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deletepermissions(req, res) {
  const permissionsId = req.params.id;
  try {
    const [result] = await permissionModel.deletepermissions(permissionsId);
    if (result.affectedRows > 0) {
      res.json({ message: 'accept reason deleted' });
    } else {
      res.status(404).json({ error: 'accept reason not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllpermissions,
  createpermission,
  createpermissions,
  getpermissionsById,
  updatepermissions,
  deletepermissions,
};
