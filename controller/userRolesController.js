const userRolesModel = require('../model/userRolesModel');

async function getAllUserRoles(req, res) {
  try {
    const [rows] = await userRolesModel.getAllUserRoles();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createUserRole(req, res) {
  const userRole = req.body;
  try {
    const [result] = await userRolesModel.createUserRole(userRole);
    const createdUserRoleId = result.insertId;
    res.status(201).json({ message: 'User role created', userRoleId: createdUserRoleId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUserRoleById(req, res) {
  const userRoleId = req.params.id;
  try {
    const [rows] = await userRolesModel.getUserRoleById(userRoleId);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'User role not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteUserRole(req, res) {
  const userRoleId = req.params.id;
  try {
    const [result] = await userRolesModel.deleteUserRole(userRoleId);
    if (result.affectedRows > 0) {
      res.json({ message: 'User role deleted' });
    } else {
      res.status(404).json({ error: 'User role not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllUserRoles,
  createUserRole,
  getUserRoleById,
  deleteUserRole,
};
