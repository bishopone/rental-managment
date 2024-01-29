const db = require('../config/dbConfig');

function getAllRolePermissions() {
  return db.promise().query('SELECT * FROM rolepermissions');
}

function createRolePermission(rolePermission) {
  return db.promise().query('INSERT INTO rolepermissions (roleID, permissionID) VALUES (?, ?)', [rolePermission.roleID, rolePermission.permissionID]);
}

function getRolePermissionById(rolePermissionId) {
  return db.promise().query('SELECT * FROM rolepermissions WHERE rolePermissionID = ?', [rolePermissionId]);
}

function deleteRolePermission(rolePermissionId) {
  return db.promise().query('DELETE FROM rolepermissions WHERE rolePermissionID = ?', [rolePermissionId]);
}

module.exports = {
  getAllRolePermissions,
  createRolePermission,
  getRolePermissionById,
  deleteRolePermission,
};
