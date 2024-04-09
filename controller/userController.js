// userController.js
const config = require('../config/config');
const userModel = require('../model/userModel');
const permissionModel = require('../model/permissionModel');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/profiles'); // Destination folder for profile pictures
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep the original file name
  }
});
const upload = multer({ storage: storage });

async function getAllUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
async function fetchUsersNotInProperty(req, res) {
  try {
    const { propertyId } = req.params; // Extract the property ID from the request parameters

    const [users] = await userModel.fetchUsersNotInProperty(propertyId);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
async function getAllUsersInfo(req, res) {
  try {
    const users = await userModel.getAllUsersInfo();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUserById(req, res) {
  const userId = req.params.id;
  try {
    const user = await userModel.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      delete user.Password
      res.json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


async function createUser(req, res) {
  try {
    const user = req.body;
    const ProfilePicture = req.file; // Access the uploaded file via req.file
    if (!ProfilePicture) {
      res.status(400).json({ error: 'Image file is missing.' });
      return;
    }
    const imagePath = ProfilePicture.path; // Use the file path provided by multer
    user.ProfilePicture = imagePath;
    const result = await userModel.createUser(user);
    res.status(201).json({ message: 'User created', userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
}

async function updateUser(req, res) {
  try {
    console.log("ProfilePicture");
    const user = req.body;
    const userId = req.params.id;
    const ProfilePicture = req.file; // Access the uploaded file via req.file
    console.log(ProfilePicture);
    var imagePath = null;
    if (ProfilePicture) {
      imagePath = ProfilePicture.path; // Use the file path provided by multer
    }
    const result = await userModel.updateUser(user, userId, imagePath);
    res.status(200).json({ user: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


async function loginUser(req, res) {
  const { username, password } = req.body;
  console.log(username, password);
  try {

    const user = await userModel.getUserByEmailOrUsernameOrPhone(username, username, username);
    if (user.length <= 0) {
      res.status(400).json({ message: 'User Not Found !' });
      return
    }
    console.time("start")
    const validpassword = await bcrypt.compare(password, user[0].Password)
    console.timeEnd("start")
    if (!validpassword) {
      res.status(400).json({ message: 'Password doesnt match !' });
      return
    }
    delete user[0].Password
    const [permissions] = await  permissionModel.getpermissionsById(user[0].UserID)
    const permissionsList = permissions.map((p)=>p.permissionName)
    const token = jwt.sign(user[0], config.secretToken, { expiresIn: '2 days' });
    res.status(200).json({ user: user[0], token: token, permissions: permissionsList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


async function deleteUser(req, res) {
  const userId = req.params.id;
  try {
    const result = await userModel.deleteUser(userId);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json({ message: 'User deleted', userId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'This user has made budget request so it cannot be deleted' });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  loginUser,
  deleteUser,
  getAllUsersInfo,
  fetchUsersNotInProperty
};
