// userRoute.js
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { checkTokenValidity,checkUserPermission } = require("../middleware/middleware");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', userController.getAllUsers);
router.get('/info', userController.getAllUsersInfo);
router.get('/checkToken', checkTokenValidity, (req, res) => res.json(true));
router.get('/notinproperty/:propertyId', userController.fetchUsersNotInProperty);
router.get('/:id', userController.getUserById);
router.post('/login', userController.loginUser);
router.post('/', upload.single('ProfilePicture'), userController.createUser);
router.put('/:id', upload.single('ProfilePicture'), userController.updateUser);

router.delete('/:id', userController.deleteUser);

module.exports = router;
