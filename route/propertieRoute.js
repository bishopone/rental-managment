const express = require('express');
const router = express.Router();
const propertyController = require('../controller/propertyController');

router.get('/', propertyController.getAllProperties);
router.get('/detail/:id', propertyController.getPropertyDetailById);
router.get('/:id', propertyController.getPropertyById);
router.post('/', propertyController.createProperty);
router.put('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);
router.post('/connect', propertyController.connectUserToProperty);
router.delete('/remove/:userId/:propertyId', propertyController.removeUserFromProperty);

module.exports = router;
