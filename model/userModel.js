// userModel.js
const config = require('../config/config');
const db = require('../config/dbConfig');
const bcrypt = require("bcrypt")

async function getAllUsers() {
  try {
    const [rows] = await db.promise().query(`SELECT * FROM Users`);
    return rows;
  } catch (error) {
    throw error;
  }
}
async function getAllUsersInfo() {
  try {
    const [rows] = await db.promise().query(`SELECT * FROM Users u JOIN roles r on u.RoleID = r.RoleID`);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const [rows] = await db.promise().query('SELECT * FROM Users WHERE UserID = ?', [userId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function getUserRoleById(userId) {
  try {
    const [rows] = await db.promise().query('SELECT r.RoleName FROM Users JOIN Roles r ON r.RoleID = Users.UserType WHERE UserID = ?', [userId]);
    return rows[0] ? rows[0].RoleName : null;
  } catch (error) {
    throw error;
  }
}

async function getUserByEmailOrUsernameOrPhone(email, username, phoneNumber) {
  try {
    const [rows] = await db.promise().query('SELECT * FROM Users WHERE Email = ? OR Username = ? OR PhoneNumber = ?', [email, username, phoneNumber]);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function createUser(user) {
  try {
    // Data Validation
    if (!user.Email || !user.Username || !user.Password || !user.PhoneNumber) {
      throw new Error('Required fields are missing.');
    }

    // Validate Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.Email)) {
      throw new Error('Invalid email format.');
    }
    const encodedPassword = await bcrypt.hash(user.Password.trim(), config.salt)

    // Sanitize Data
    const sanitizedUser = {
      ...user,
      Email: user.Email.trim(),
      Username: user.Username.trim(),
      Password: encodedPassword, // You may want to hash the password
      PhoneNumber: user.PhoneNumber.trim(),
      // Add additional fields to sanitize
    };

    const [result] = await db.promise().query('INSERT INTO Users SET ?', [sanitizedUser]);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateUser(user, userId, profileImagePath = null) {
  try {
    // Data Validation
    if (!user.Email || !user.Username || !user.PhoneNumber || !user.FirstName || !user.LastName) {
      throw new Error('Required fields are missing.');
    }

    // Validate Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.Email)) {
      throw new Error('Invalid email format.');
    }

    // Sanitize Data
    const sanitizedUser = {
      ...user,
      Email: user.Email.trim(),
      Username: user.Username.trim(),
      PhoneNumber: user.PhoneNumber.trim(),
      FirstName: user.FirstName.trim(),
      LastName: user.LastName.trim(),
      // Add additional fields to sanitize
    };

    // Update Profile Picture if provided
    if (profileImagePath) {
      sanitizedUser.ProfilePicture = profileImagePath;
    }

    const [result] = await db.promise().query('UPDATE Users SET ? WHERE UserID = ?', [sanitizedUser, userId]);
    return result;
  } catch (error) {
    throw error;
  }
}

async function deleteUser(userId) {
  try {
    const [result] = await db.promise().query('DELETE FROM Users WHERE UserID = ?', [userId]);
    return result;
  } catch (error) {
    throw error;
  }
}

async function loginAdmin(phoneNumber, password) {
  try {
    const [rows] = await db.promise().query('SELECT * FROM Users WHERE PhoneNumber = ? AND Password = ?', [phoneNumber, password]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserRoleById,
  getUserByEmailOrUsernameOrPhone,
  createUser,
  updateUser,
  deleteUser,
  loginAdmin,
  getAllUsersInfo
};
