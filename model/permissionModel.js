const db = require('../config/dbConfig');

function getAllpermissions() {
  return db.promise().query('SELECT * FROM permissions');
}

function createpermission(permissions) {
  return db.promise().query('INSERT INTO permissions (permissionName) VALUES (?)', [ permissions.permissionName]);
}
function createpermissions(permissionsList) {
  // Using Promise.all to execute multiple queries concurrently
  const promises = permissionsList.map(permission => {
      return db.promise().query('INSERT INTO permissions (permissionName) VALUES (?)', [permission]);
  });

  return Promise.all(promises);
}
function getpermissionsById(permissionsId) {
  return db.promise().query('SELECT permissions.permissionName FROM users JOIN rolepermissions p ON p.roleID = users.UserType JOIN permissions ON permissions.permissionID = p.permissionID WHERE userID = ?', [permissionsId]);
}

function updatepermissions(permissionsId, updatedpermissions) {
  return db.promise().query('UPDATE permissions SET permissionName	 = ? WHERE id = ?', [updatedpermissions.permissionName	, permissionsId]);
}

function deletepermissions(permissionsId) {
  return db.promise().query('DELETE FROM permissions WHERE permissionID = ?', [permissionsId]);
}

module.exports = {
  getAllpermissions,
  createpermissions,
  createpermission,
  getpermissionsById,
  updatepermissions,
  deletepermissions,
};
