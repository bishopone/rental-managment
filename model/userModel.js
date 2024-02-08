// userModel.js
const config = require('../config/config');
const db = require('../config/dbConfig');
const bcrypt = require("bcrypt")

async function getAllUsers() {
  try {
    const [rows] = await db.promise().query(`SELECT * FROM users`);
    return rows;
  } catch (error) {
    throw error;
  }
}
async function getAllUsersInfo() {
  try {
    const [rows] = await db.promise().query(`SELECT * FROM users u JOIN roles r on u.RoleID = r.RoleID`);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const [rows] = await db.promise().query('SELECT * FROM users WHERE UserID = ?', [userId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function getUserRoleById(userId) {
  try {
    const [rows] = await db.promise().query('SELECT r.RoleName FROM users JOIN Roles r ON r.RoleID = users.UserType WHERE UserID = ?', [userId]);
    return rows[0] ? rows[0].RoleName : null;
  } catch (error) {
    throw error;
  }
}

async function getUserByEmailOrUsernameOrPhone(email, username, phoneNumber) {
  try {
    const [rows] = await db.promise().query('SELECT * FROM users WHERE Email = ? OR Username = ? OR PhoneNumber = ?', [email, username, phoneNumber]);
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

    const [result] = await db.promise().query('INSERT INTO users SET ?', [sanitizedUser]);
    return result;
  } catch (error) {
    throw error;
  }
}

async function updateUser(user, userId, profileImagePath = null) {
  try {
    // Validate Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.Email)) {
      throw new Error('Invalid email format.');
    }

    // Sanitize Data
    const sanitizedUser = {
      Username: user.Username.trim(),
      Email: user.Email.trim(),
      PhoneNumber: user.PhoneNumber.trim(),
      RoleID: user.RoleID.trim(),
    };

    // Update Profile Picture if provided
    if (profileImagePath) {
      sanitizedUser.ProfilePicture = profileImagePath;
    }
    if (user.Password && user.Password !== 'undefined') {
      const encodedPassword = await bcrypt.hash(user.Password.trim(), config.salt)
      sanitizedUser.Password = encodedPassword
    }
    const [result] = await db.promise().query('UPDATE users SET ? WHERE UserID = ?', [sanitizedUser, userId]);
    return result;
  } catch (error) {
    throw error;
  }
}

async function deleteUser(userId) {
  try {
    const [result] = await db.promise().query('DELETE FROM users WHERE UserID = ?', [userId]);
    return result;
  } catch (error) {
    throw error;
  }
}

async function loginAdmin(phoneNumber, password) {
  try {
    const [rows] = await db.promise().query('SELECT * FROM users WHERE PhoneNumber = ? AND Password = ?', [phoneNumber, password]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}
async function fetchUsersNotInProperty(propertyId) {
  try {
    const query = `
    SELECT * FROM users u JOIN roles r on u.RoleID = r.RoleID
    WHERE UserID NOT IN (
        SELECT UserID 
        FROM userproperty 
        WHERE PropertyID = ?
    )`;

    return await db.promise().query(query, [propertyId]);

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
  getAllUsersInfo,
  fetchUsersNotInProperty
};
