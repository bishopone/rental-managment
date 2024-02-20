const { parse } = require('path');
const db = require('../config/dbConfig');
async function createPayment(paymentData) {
    try {
        // Get contract details
        const [contractRows] = await db.promise().query('SELECT Rent FROM contracts WHERE ContractID = ?', [paymentData.ContractID]);

        // Check if contract exists
        if (contractRows.length === 0) {
            throw new Error('Contract not found');
        }

        // Extract rent amount from contract
        const contractRent = contractRows[0].Rent;

        // Check if there are previous payments
        const [previousPaymentRows] = await db.promise().query('SELECT Amount FROM payments WHERE ContractID = ?', [paymentData.ContractID]);
        let totalPreviousPayments = 0;
        if (previousPaymentRows.length > 0) {
            previousPaymentRows.map((row) => totalPreviousPayments = parseFloat(totalPreviousPayments) + parseFloat(row.Amount));
        }

        // Calculate total amount of payments including the new payment
        const totalAmount = totalPreviousPayments + paymentData.Amount;
        console.log(totalPreviousPayments, totalAmount, contractRent)
        // Check if the total amount exceeds the rent
        if (totalAmount > contractRent) {
            throw new Error('Total payment amount exceeds contract rent');
        }
        let status = 'Pending';
        if (totalAmount === contractRent) {
            status = 'Complete';
        }

        // Set PaymentDate to current timestamp
        const query = 'INSERT INTO payments (ContractID, Amount, Description, Status) VALUES (?, ?, ?, ?)';
        const params = [paymentData.ContractID, paymentData.Amount, paymentData.Description, status];

        // Execute the query
        const [result] = await db.promise().query(query, params);
        return result.insertId;
    } catch (error) {
        throw error;
    }
}


async function getPayments() {
    try {
        const [rows] = await db.promise().query('SELECT * FROM payments');
        return rows;
    } catch (error) {
        throw error;
    }
}
async function getPaymentById(paymentId) {
    try {
        const [rows] = await db.promise().query('SELECT * FROM payments WHERE PaymentID = ?', [paymentId]);
        return rows[0];
    } catch (error) {
        throw error;
    }
}

async function updatePayment(paymentId, paymentData) {
    try {
        await db.promise().query('UPDATE payments SET ? WHERE PaymentID = ?', [paymentData, paymentId]);
    } catch (error) {
        throw error;
    }
}

async function deletePayment(paymentId) {
    try {
        await db.promise().query('DELETE FROM payments WHERE PaymentID = ?', [paymentId]);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createPayment,
    getPaymentById,
    getPayments,
    updatePayment,
    deletePayment
};
