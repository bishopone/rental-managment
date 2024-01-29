const db = require('../config/dbConfig');

function getAllUserRoles() {
  return db.promise().query('SELECT * FROM userRoles');
}

function createUserRole(userRole) {
  return db.promise().query('INSERT INTO userRoles (userID, roleID) VALUES (?, ?)', [userRole.userID, userRole.roleID]);
}

function getUserRoleById(userid) {
  return db.promise().query('SELECT r.roleName FROM userRoles JOIN roles r ON r.roleID = userRoles.roleID  WHERE userID = ?', [userid]);
}

function deleteUserRole(userRoleId) {
  return db.promise().query('DELETE FROM userRoles WHERE userRoleID = ?', [userRoleId]);
}

module.exports = {
  getAllUserRoles,
  createUserRole,
  getUserRoleById,
  deleteUserRole,
};
