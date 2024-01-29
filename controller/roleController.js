// roleController.js
const roleModel = require('../model/roleModel');

async function getAllRoles(req, res) {
  try {
    const roles = await roleModel.getAllRoles();
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred while fetching roles. Please try again later.' });
  }
}

async function updateRolePermissions(req, res) {
  const roleId = req.params.roleId;
  const { permissions } = req.body;
  console.log("selm")
  try {
    await roleModel.updateRolePermissions(roleId, permissions);
    res.status(200).json({ message: 'Role permissions updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteRolePermissions(req, res) {
  const roleId = req.params.roleId;
  const permissions = req.params.permissions;
  try {
    await roleModel.deleteRolePermissions(roleId, permissions);
    res.status(200).json({ message: 'Role permissions deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getPermissionsByRole(req, res) {
  const roleId = req.params.roleId;
  try {
    const [permissions] = await roleModel.getPermissionsByRole(roleId);
    res.json(permissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
async function getRoleById(req, res) {
  const roleId = req.params.id;
  try {
    const role = await roleModel.getRoleById(roleId);
    if (!role) {
      res.status(404).json({ error: 'Role not found' });
    } else {
      res.json(role);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred while fetching the role. Please try again later.' });
  }
}

async function createRole(req, res) {
  const role = req.body.RoleName;
  try {
    if (!role || role === "") {
      res.status(500).json({ error: 'RoleName is not defined.' });
      return
    }
    const result = await roleModel.createRole(role);
    res.status(201).json({ message: 'Role created', roleId: result.insertId });
  } catch (error) {
    console.error(error);
    if (error.code == 'ER_DUP_ENTRY') {
      res.status(500).json({ error: `${role} is already in use !!` });
      return
    }
    res.status(500).json({ error: 'An unexpected error occurred while creating the role. Please try again later.' });
  }
}

async function updateRole(req, res) {
  const role = req.body;
  const roleId = req.params.id;
  try {
    const result = await roleModel.updateRole(role, roleId);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Role not found' });
    } else {
      res.status(200).json({ message: 'Role updated' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred while updating the role. Please try again later.' });
  }
}

async function deleteRole(req, res) {
  const roleId = req.params.id;
  try {
    const result = await roleModel.deleteRole(roleId);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Role not found' });
    } else {
      res.status(200).json({ message: 'Role deleted', roleId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred while deleting the role. Please try again later.' });
  }
}

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getPermissionsByRole,
  updateRolePermissions,
  deleteRolePermissions
};
