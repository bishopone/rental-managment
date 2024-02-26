const db = require('../config/dbConfig');

function getAllUserRoles() {
  return db.promise().query('SELECT * FROM userroles');
}

function createUserRole(userRole) {
  return db.promise().query('INSERT INTO userroles (userID, roleID) VALUES (?, ?)', [userRole.userID, userRole.roleID]);
}

function getUserRoleById(userid) {
  return db.promise().query('SELECT r.roleName FROM userroles JOIN roles r ON r.roleID = userroles.roleID  WHERE userID = ?', [userid]);
}

function deleteUserRole(userRoleId) {
  return db.promise().query('DELETE FROM userroles WHERE userRoleID = ?', [userRoleId]);
}

module.exports = {
  getAllUserRoles,
  createUserRole,
  getUserRoleById,
  deleteUserRole,
};
