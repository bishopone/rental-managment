// roleRoute.js
const express = require('express');
const router = express.Router();
const roleController = require('../controller/roleController');
const { checkTokenValidity } = require("../middleware/middleware");

router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);
router.put('/:roleId/permission', roleController.updateRolePermissions);
router.get('/:roleId/permission', roleController.getPermissionsByRole);
router.delete('/:roleId/permission/:permissions', [checkTokenValidity], roleController.deleteRolePermissions);
router.post('/', roleController.createRole);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

module.exports = router;
