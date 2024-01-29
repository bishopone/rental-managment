// userRoute.js
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/', userController.getAllUsers);
router.get('/info', userController.getAllUsersInfo);
router.get('/:id', userController.getUserById);
router.post('/login', userController.loginUser);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
