const { parse } = require('path');
const db = require('../config/dbConfig');

async function createPayment(paymentData) {
    try {
        console.log("paymentData");
        console.log(paymentData);
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
        const totalAmount = totalPreviousPayments + parseFloat(paymentData.Amount);
        console.log(totalPreviousPayments, totalAmount, contractRent)
        // Check if the total amount exceeds the rent
        if (totalAmount > contractRent) {
            throw new Error('Total payment amount exceeds contract rent');
        }
        let status = 'Pending';
        console.log("totalAmount, contractRent");
        console.log(parseFloat(totalAmount), parseFloat(contractRent));
        console.log(parseFloat(totalAmount) === parseFloat(contractRent));

        if (parseFloat(totalAmount) === parseFloat(contractRent)) {
            status = 'completed';
        }

        // Set PaymentDate to current timestamp
        const query = 'INSERT INTO payments (ContractID, Amount,Month, Description, Status) VALUES (?, ?,?, ?, ?)';
        const params = [paymentData.ContractID, paymentData.Amount, paymentData.Month, paymentData.Description, status];

        // Execute the query
        const [result] = await db.promise().query(query, params);
        return result.insertId;
    } catch (error) {
        throw error;
    }
}

async function getAllPropertiesUserIn(userId) {
    try {
        // Step 1: Query User Properties
        const userPropertiesQuery = `
        SELECT 
        properties.id AS propertyId,
        properties.*, 
        u.ProfilePicture AS UserProfile,
        u.Username,
        r.RoleName,
        SUM(contracts.rent) AS MaxAmount,
        COALESCE(SUM(payments.total_amount), 0) AS CurrentAmount
        FROM userproperty 
        JOIN properties ON userproperty.PropertyID = properties.id 
        JOIN contracts ON properties.id = contracts.PropertyID 
        LEFT JOIN (
        SELECT 
            ContractID,
            SUM(amount) AS total_amount
        FROM 
            payments
        GROUP BY 
            ContractID
        ) AS payments ON contracts.ContractID = payments.ContractID
        LEFT JOIN 
            users u ON u.UserID = properties.owner_id 
            LEFT JOIN 
            roles r ON r.RoleID = u.RoleID
        WHERE 
        userproperty.UserID = ?
        GROUP BY 
        properties.id;

    `;

        const [propertyRows] = await db.promise().query(userPropertiesQuery, [userId]);

        return propertyRows;
    } catch (error) {
        throw error;
    }
}


async function getPayments(userid) {
    try {
        const query = `SELECT p.id AS property_id, 
                              p.name,
                              p.location,
                              u.Username,
                              p.image_url,
                              pay.PaymentID AS payment_id,
                              pay.PaymentDate AS payment_date,
                              pay.Amount AS amount,
                              pay.Status AS status,
                              pay.PaymentType AS payment_type,
                              r.RoomNumber AS room_number
                        FROM payments pay
                        LEFT JOIN contracts c ON c.ContractID = pay.ContractID
                        LEFT JOIN rooms r ON c.RoomID = r.RoomID
                        RIGHT JOIN properties p ON p.id = r.PropertyID
                        RIGHT JOIN users u ON u.UserID = p.owner_id
                        RIGHT JOIN userproperty up ON p.id = up.PropertyID
                        WHERE up.UserID = ?
                        ORDER BY p.id, pay.PaymentID;`;

        const [rows] = await db.promise().query(query, [userid]);

        // Process rows to create the desired JSON object
        const paymentsByProperty = [];
        let currentPropertyId = null;
        let currentProperty = null;
        console.log(rows);
        rows.forEach(row => {
            if (row.property_id !== currentPropertyId) {
                if (currentProperty !== null) {
                    paymentsByProperty.push(currentProperty);
                }
                currentPropertyId = row.property_id;
                currentProperty = {
                    property_id: currentPropertyId,
                    name: row.name,
                    location: row.location,
                    Username: row.Username,
                    image_url: row.image_url,
                    payments: []
                };
            }

        });

        // Push the last property's payments
        if (currentProperty !== null) {
            paymentsByProperty.push(currentProperty);
        }

        return paymentsByProperty;
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
async function getPaymentsLeft(ContractID) {
    try {
        const query = `SELECT Payed, Total, (Total - Payed) AS PaymentLeft
        FROM (
            SELECT c.Rent AS Total, COALESCE(SUM(p.Amount),0) AS Payed
            FROM contracts c
            JOIN payments p ON p.ContractID = c.ContractID
            WHERE c.ContractID = ?
        ) AS subquery;`

        const [rows] = await db.promise().query(query, [ContractID]);
        return rows[0];
    } catch (error) {
        throw error;
    }
}

async function getPaymentTransaction(propertyId) {
    try {
        const query = `
        SELECT p.PaymentID,r.RoomNumber,p.PaymentDate,p.Amount FROM payments p
        JOIN contracts c ON c.ContractID = p.ContractID
        JOIN rooms r ON r.RoomID = c.RoomID AND r.PropertyID = ?
        ORDER BY p.PaymentDate DESC;
        `
        const [rows] = await db.promise().query(query, [propertyId]);
        return rows;
    } catch (error) {
        throw error;
    }
}
async function getAllUpcomingPayments(propertyId) {
    try {
        const query = `SELECT c.ContractID, r.RoomNumber,c.Rent,c.DueDate,CONCAT(t.FirstName, ' ', t.MiddleName, ' ', t.LastName) AS FullName FROM rooms r 
        JOIN contracts c ON c.RoomID = r.RoomID AND r.PropertyID = ? AND c.ContractState = 'running' 
        JOIN tenants t ON t.TenantID = c.TenantID 
        LEFT JOIN payments p ON p.ContractID = c.ContractID 
        WHERE NOT EXISTS 
        ( SELECT 1 FROM payments p2 
            WHERE p2.ContractID = p.ContractID
            AND YEAR(p2.Month) = YEAR(p.Month) 
            AND MONTH(p2.Month) = MONTH(p.Month) 
            AND p2.Status = 'completed' )
            GROUP BY c.ContractID;`
        const [rows] = await db.promise().query(query, [propertyId]);
        return rows;
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
    getPaymentsLeft,
    getPayments,
    updatePayment,
    getPaymentTransaction,
    getAllUpcomingPayments,
    getAllPropertiesUserIn,
    deletePayment
};
