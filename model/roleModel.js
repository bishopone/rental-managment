// roleModel.js
const db = require('../config/dbConfig');

async function getAllRoles() {
  try {
    const [rows] = await db.promise().query('SELECT * FROM Roles');
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getRoleById(roleId) {
  try {
    const [rows] = await db.promise().query('SELECT * FROM Roles WHERE RoleID = ?', [roleId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function createRole(role) {
  try {
    const [result] = await db.promise().query('INSERT INTO Roles (RoleName) VALUES (?)', [role]);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateRole(role, roleId) {
  try {
    const [result] = await db.promise().query('UPDATE Roles SET ? WHERE RoleID = ?', [role, roleId]);
    return result;
  } catch (error) {
    throw error;
  }
}

async function deleteRole(roleId) {
  try {
    const [result] = await db.promise().query('DELETE FROM Roles WHERE RoleID = ?', [roleId]);
    return result;
  } catch (error) {
    throw error;
  }
}
function getPermissionsByRole(roleId) {
  return db.promise().query('SELECT * FROM rolepermissions WHERE roleID = ?', [roleId]);
}
function updateRolePermissions(roleId, permissions) {
  const query = `INSERT INTO rolepermissions (roleID, permissionID) VALUES (?,?)`;
  return db.promise().query(query, [roleId, permissions]);
}
function deleteRolePermissions(roleId, permissions) {
  const query = `DELETE FROM rolepermissions WHERE roleId = ? AND permissionID = ?`;
  return db.promise().query(query, [roleId, permissions]);
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
