
// contractRoute.js
const express = require('express');
const router = express.Router();
const contractController = require('../controller/contractController');
const { checkTokenValidity } = require("../middleware/middleware");

// Create a new contract with attachments
router.get('/filter/:id', [checkTokenValidity], contractController.getContract);
router.get('/pdf/:id', [checkTokenValidity], contractController.getContractPdf);
router.get('/:id', [checkTokenValidity], contractController.getContractById);
router.post('/', [checkTokenValidity], contractController.createContract);
router.put('/:id', [checkTokenValidity], contractController.updateContractById);
router.delete('/:id', [checkTokenValidity], contractController.deleteContractById);
module.exports = router;