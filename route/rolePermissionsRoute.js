const express = require('express');
const rolePermissionsController = require('../controller/rolePermissionsController');
const { checkTokenValidity, checkUserRole, checkUserPermission } = require("../middleware/middleware");

const router = express.Router();

router.get('/', [checkTokenValidity, checkUserRole("provider"), checkUserPermission("VIEW_ALL_ROLE_PERMISSION")], rolePermissionsController.getAllRolePermissions);
router.post('/', [checkTokenValidity, checkUserRole("provider"), checkUserPermission("CREATE_ROLE_PERMISSION")], rolePermissionsController.createRolePermission);
router.get('/:id', [checkTokenValidity, checkUserRole("provider"), checkUserPermission("GET_SINGLE_ROLE_PERMISSION")], rolePermissionsController.getRolePermissionById);
router.delete('/:id', [checkTokenValidity, checkUserRole("provider"), checkUserPermission("DELETE_ROLE_PERMISSION")], rolePermissionsController.deleteRolePermission);

module.exports = router;
