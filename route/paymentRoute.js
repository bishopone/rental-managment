// paymentRoute.js

const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');
const { checkTokenValidity,checkUserPermission } = require("../middleware/middleware");

router.post('/',[checkTokenValidity], paymentController.createPayment);
router.get('/',[checkTokenValidity], paymentController.getPayments);
router.get('/users-in', [checkTokenValidity], paymentController.getAllPropertiesUserIn);
router.get('/upcomming/:id', [checkTokenValidity], paymentController.getAllUpcomingPayments);
router.get('/payment_left/:id', [checkTokenValidity], paymentController.getPaymentsLeft);
router.get('/transaction/:id', [checkTokenValidity], paymentController.getPaymentTransaction);
router.get('/:id',[checkTokenValidity], paymentController.getPaymentById);
router.put('/:id',[checkTokenValidity], paymentController.updatePayment);
router.delete('/:id',[checkTokenValidity], paymentController.deletePayment);

module.exports = router;
