const db = require('../config/dbConfig');

async function createPayment(paymentData) {
    try {
        console.log("paymentData");
        console.log(paymentData);
        const [contractRows] = await db.promise().query('SELECT Rent FROM contracts WHERE ContractID = ?', [paymentData.ContractID]);
        if (contractRows.length === 0) {
            throw new Error('Contract not found');
        }
        console.log('paymentData.Month', paymentData.Month);
        const month = paymentData.MultiplePayment === true ? differenceInMonths(paymentData.StartMonth, paymentData.EndMonth) :differenceInMonths(paymentData.Month, paymentData.Month) ;
        console.log('month', month);
        const contractRent = contractRows[0].Rent;
        await Promise.all(month.map(async (m) => {
            const [previousPaymentRows] = await db.promise().query(`SELECT COALESCE(SUM(Amount), 0) AS Amount FROM payments WHERE ContractID = :contractID AND YEAR(Month) = YEAR(:date) AND MONTH(Month) = MONTH(:date);
            `, { contractID: paymentData.ContractID, date: m });
            let totalPreviousPayments = 0;
            if (previousPaymentRows.length > 0) {
                previousPaymentRows.map((row) => totalPreviousPayments = parseFloat(totalPreviousPayments) + parseFloat(row.Amount));
            }
            const totalAmount = totalPreviousPayments + parseFloat(paymentData.Amount);
            console.log(totalPreviousPayments, totalAmount, contractRent)
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
            const query = 'INSERT INTO payments (ContractID, Amount,Month, Description, Status) VALUES (?, ?,?, ?, ?)';
            const params = [paymentData.ContractID, paymentData.Amount, m, paymentData.Description, status];
            await db.promise().query(query, params);
        }));

        return true;
    } catch (error) {
        throw error;
    }
}
function differenceInMonths(date1, date2) {
    const dates = [];

    // Parse the input dates
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Loop through dates and push them into the array
    let currentDate = new Date(d1);
    while (currentDate <= d2) {
        dates.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return dates;
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
        COALESCE(SUM(contracts.rent),0) AS MaxAmount,
        COALESCE(SUM(payments.total_amount), 0) AS CurrentAmount
        FROM userproperty 
        JOIN properties ON userproperty.PropertyID = properties.id 
        LEFT JOIN contracts ON properties.id = contracts.PropertyID AND contracts.ContractState = 'running'
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

async function getPaymentByContractId(contractID) {
    try {
        const [rows] = await db.promise().query('SELECT * FROM payments WHERE ContractID = ?', [contractID]);
        return rows;
    } catch (error) {
        throw error;
    }
}
async function getPaymentsLeft(ContractID) {
    try {
        const query = `
        SELECT 
    Total,
    (Total - Payed) AS PaymentLeft
FROM (
    SELECT 
        c.Rent AS Total, 
        COALESCE(SUM(p.Amount), 0) AS Payed
    FROM 
        contracts c
    LEFT JOIN 
        payments p ON p.ContractID = c.ContractID 
    WHERE 
        c.ContractID = ?
        AND NOT EXISTS (
            SELECT 1
            FROM payments p2
            WHERE p2.ContractID = c.ContractID
            AND p2.Status = 'completed'
            AND YEAR(p2.Month) = YEAR(p.Month)
            AND MONTH(p2.Month) = MONTH(p.Month)
        )
) AS subquery;

        `

        const [rows] = await db.promise().query(query, [ContractID]);
        return rows[0];
    } catch (error) {
        throw error;
    }
}

async function getPaymentTransaction(propertyId) {
    try {
        const query = `
        SELECT p.PaymentID,r.RoomNumber,p.PaymentDate,p.Amount,p.Month FROM payments p
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
        const query = `
        SELECT
        c.ContractID,
        r.RoomNumber,
        c.Rent,
        CASE WHEN p.Status = 'completed' THEN DATE_ADD(
            LAST_DAY(CURDATE()),
            INTERVAL 1 DAY) -- Next month's due date
            ELSE c.DueDate -- Current month's due date
        END AS DueDate,
        SUM(
            DATEDIFF(
                CASE WHEN p.Status = 'completed' THEN DATE_ADD(
                    LAST_DAY(CURDATE()),
                    INTERVAL 1 DAY) ELSE CONCAT(
                        YEAR(CURDATE()),
                        '-',
                        MONTH(CURDATE()),
                        '-',
                        c.DueDate)
                        END,
                        CURDATE())) AS DaysLeft,
                    CONCAT(
                        t.FirstName,
                        ' ',
                        t.MiddleName,
                        ' ',
                        t.LastName
                    ) AS FullName,
                    CASE WHEN p.Status = 'completed' THEN 'pending' ELSE p.Status
                END AS State
            FROM
                contracts c
            JOIN tenants t ON
                t.TenantID = c.TenantID
            JOIN rooms r ON
                r.RoomID = c.RoomID
            LEFT JOIN payments p ON
                p.ContractID = c.ContractID
            WHERE
                c.PropertyID = ?
            GROUP BY
                c.ContractID;
    `
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
    getPaymentByContractId,
    updatePayment,
    getPaymentTransaction,
    getAllUpcomingPayments,
    getAllPropertiesUserIn,
    deletePayment
};
