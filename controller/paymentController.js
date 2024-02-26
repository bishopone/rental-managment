const paymentModel = require('../model/paymentModel');

async function createPayment(req, res) {
    try {
        const paymentData = req.body;
        const paymentId = await paymentModel.createPayment(paymentData);
        res.status(201).json({ message: 'Payment created successfully', paymentId });
    } catch (error) {
        console.log(error)
        let errorMessage = 'Internal server error';
        if (error.message.includes('Total payment amount exceeds contract rent')) {
            errorMessage = 'Total payment amount exceeds contract rent';
            res.status(400).json({ error: errorMessage });
        } else if (error.message === 'Contract not found') {
            errorMessage = 'Contract not found';
            res.status(404).json({ error: errorMessage });
        } else {
            res.status(500).json({ error: errorMessage });
        }
    }
}

async function getPaymentById(req, res) {
    try {
        const paymentId = req.params.id;
        const payment = await paymentModel.getPaymentById(paymentId);
        if (!payment) {
            res.status(404).json({ error: 'Payment not found' });
            return;
        }
        res.json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function getPaymentTransaction(req, res) {
    try {
        const paymentId = req.params.id;
        const payment = await paymentModel.getPaymentTransaction(paymentId);
        if (!payment) {
            res.status(404).json({ error: 'Payments not found' });
            return;
        }
        res.json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function getPaymentsLeft(req, res) {
    try {
        const contractId = req.params.id;
        const payment = await paymentModel.getPaymentsLeft(contractId);
        if (!payment) {
            res.status(404).json({ error: 'Payments not found' });
            return;
        }
        res.json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAllUpcomingPayments(req, res) {
    try {
        const propertyId = req.params.id;
        const payment = await paymentModel.getAllUpcomingPayments(propertyId);
        if (!payment) {
            res.status(404).json({ error: 'Payment not found' });
            return;
        }
        res.json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAllPropertiesUserIn(req, res) {
    try {
        const properties = await paymentModel.getAllPropertiesUserIn(req.userId);
        res.json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred while fetching properties. Please try again later.' });
    }
}

async function getPayments(req, res) {
    try {
        
        const payment = await paymentModel.getPayments(req.userId);
        res.json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updatePayment(req, res) {
    try {
        const paymentId = req.params.id;
        const paymentData = req.body;
        await paymentModel.updatePayment(paymentId, paymentData);
        res.json({ message: 'Payment updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deletePayment(req, res) {
    try {
        const paymentId = req.params.id;
        await paymentModel.deletePayment(paymentId);
        res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createPayment,
    getPaymentById,
    getPaymentsLeft,
    getAllUpcomingPayments,
    getAllPropertiesUserIn,
    updatePayment,
    deletePayment,
    getPaymentTransaction,
    getPayments
};
