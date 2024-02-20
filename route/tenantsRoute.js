const express = require('express');
const router = express.Router();
const tenantsController = require('../controller/tenantsController');

router.get('/', tenantsController.getAllTenants);
router.post('/', tenantsController.createTenant);
router.get('/:id', tenantsController.getTenantById);
router.delete('/:id', tenantsController.deleteTenant);
router.put('/:id', tenantsController.updateTenant);

module.exports = router;
