const express = require('express');
const permissionController = require('../controller/permissionController');
const { checkTokenValidity, checkUserRole, checkUserPermission } = require("../middleware/middleware");

const router = express.Router();

router.get('/',[checkTokenValidity], permissionController.getAllpermissions);
router.post('/',[checkTokenValidity], permissionController.createpermission);
router.post('/many',[checkTokenValidity], permissionController.createpermissions);
router.get('/:id',[checkTokenValidity], permissionController.getpermissionsById);
router.put('/:id',[checkTokenValidity], permissionController.updatepermissions);
router.delete('/:id',[checkTokenValidity], permissionController.deletepermissions);

module.exports = router;
