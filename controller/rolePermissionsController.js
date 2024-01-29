const rolePermissionsModel = require('../model/rolePermissionsModel');

async function getAllRolePermissions(req, res) {
  try {
    const [rows] = await rolePermissionsModel.getAllRolePermissions();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createRolePermission(req, res) {
  const rolePermission = req.body;
  try {
    const [result] = await rolePermissionsModel.createRolePermission(rolePermission);
    const createdRolePermissionId = result.insertId;
    res.status(201).json({ message: 'Role permission created', rolePermissionId: createdRolePermissionId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getRolePermissionById(req, res) {
  const rolePermissionId = req.params.id;
  try {
    const [rows] = await rolePermissionsModel.getRolePermissionById(rolePermissionId);
    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ error: 'Role permission not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteRolePermission(req, res) {
  const rolePermissionId = req.params.id;
  try {
    const [result] = await rolePermissionsModel.deleteRolePermission(rolePermissionId);
    if (result.affectedRows > 0) {
      res.json({ message: 'Role permission deleted' });
    } else {
      res.status(404).json({ error: 'Role permission not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllRolePermissions,
  createRolePermission,
  getRolePermissionById,
  deleteRolePermission,
};
