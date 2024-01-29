// userRoute.js
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { checkTokenValidity, checkUserRole, checkUserPermission } = require("../middleware/middleware");

router.get('/', userController.getAllUsers);
router.get('/info', userController.getAllUsersInfo);
router.get('/checkToken', checkTokenValidity, (req, res) => res.json(true));
router.get('/:id', userController.getUserById);
router.post('/login', userController.loginUser);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
