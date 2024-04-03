// contractModel.js
const db = require('../config/dbConfig');
const fs = require('fs');
const path = require('path');
const { generate } = require("@pdfme/generator");
const contractpdf = require('../controller/contract.json')


async function createAttachments(attachments, contractId, tenantId, roomId, userId) {
    try {
        const attachmentsDir = path.join('./uploads/attachments');
        if (!fs.existsSync(attachmentsDir)) {
            fs.mkdirSync(attachmentsDir);
        }

        const attachmentPromises = attachments.map(async (attachment) => {
            const imagePath = path.join(attachmentsDir, attachment.name);
            const date = Date.now();
            await new Promise((resolve, reject) => {
                attachment.mv(imagePath, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            return [contractId, tenantId, roomId, "Contract", attachment.name, imagePath, userId, date];
        });

        return await Promise.all(attachmentPromises);
    } catch (error) {
        throw error;
    }
}
function formatDate(dateString) {
    // Parse the date string into a Date object
    const originalDate = new Date(dateString);

    // Get the year, month, and day components from the Date object
    const year = originalDate.getFullYear(); // Full year (4 digits)
    const month = originalDate.getMonth() + 1; // Month (0-11, adding 1 to get 1-12)
    const day = originalDate.getDate(); // Day of the month (1-31)

    // Ensure month and day are in two-digit format
    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedDay = day < 10 ? '0' + day : day;

    // Construct the formatted date string in yy-mm-dd format
    const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

    return formattedDate;
}

function getDayFromDate(dateString) {
    // Parse the date string into a Date object
    const originalDate = new Date(dateString);

    // Get the day component from the Date object
    const day = originalDate.getDate(); // Day of the month (1-31)

    return day;
}

async function createContractWithAttachments(contractData, attachments, userId) {
    try {
        // Insert contract data into the contracts table
        console.log("contractData");
        console.log(contractData,attachments);
        const [room] = await db.promise().query('SELECT * FROM `rooms` WHERE RoomID = ?', [contractData.RoomID]);
        if(room[0].Status !== "Available"){
            throw 'room not available'
        }
        const [roomoccupy] = await db.promise().query(`UPDATE rooms SET Status = 'Occupied' WHERE rooms.RoomID = ?`, [contractData.RoomID]);
        const [result] = await db.promise().query('INSERT INTO `contracts` (`TenantID`, `RoomID`, `PropertyID`, `ContractState`, `ContractStartDate`, `ContractEndDate`, `Rent`, `DueDate`, `Interest`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)', [contractData.TenantID, contractData.RoomID, room[0].PropertyID, 'running', formatDate(contractData.ContractStartDate), formatDate(contractData.ContractEndDate), contractData.Rent, getDayFromDate(contractData.DueDate), contractData.Interest]);
        const contractId = result.insertId;

        if (attachments && attachments.length > 0) {
            console.log('selam in')
            const attachmentValues = await createAttachments(attachments, contractId, contractData.TenantID, contractData.RoomID, userId);
            console.log(attachmentValues)
            await db.promise().query('INSERT INTO attachments (ContractID, TenantID, RoomID, AttachmentType, AttachmentName, FilePath, UploadedBy, UploadDate) VALUES ?', [attachmentValues]);
        }

        return contractId;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function getContracts(filter, userId) {
    try {
        let query = `
            SELECT c.*,t.*,r.*, GROUP_CONCAT(a.FilePath) AS Attachments 
            FROM contracts c 
            JOIN tenants t ON t.TenantID = c.TenantID
            JOIN rooms r ON r.RoomID = c.RoomID
            LEFT JOIN attachments a ON a.ContractID = c.ContractID 
            JOIN userproperty up ON r.PropertyID = up.PropertyID
            WHERE up.UserID = ?`;

        if (filter !== 'all') {
            query += ` AND c.ContractState = ?`;
        }

        query += ` GROUP BY c.ContractID`;

        const [rows] = await db.promise().query(query, filter !== 'all' ? [filter] : [userId]);

        const contracts = []
        rows.map(row => {
            contracts.push({
                ...row,
                Attachments: row.Attachments !== null ? row.Attachments.split(',') : []
            })
        });

        return contracts;
    } catch (error) {
        throw error;
    }
}



async function getContractsAll() {
    try {
        const [rows] = await db.promise().query('SELECT * FROM contracts  JOIN tenants ON tenants.TenantID = contracts.TenantID WHERE ContractState = "running"');
        return rows;
    } catch (error) {
        throw error;
    }
}

async function changeContractState(ContractID, ContractState) {
    try {
        console.log(ContractID, ContractState);
        const query = `UPDATE contracts SET ContractState = ? WHERE contracts.ContractID = ?`
        const [rows] = await db.promise().query(query, [ ContractState, ContractID]);
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getContractsPdf(contractId) {
    try {
        const [rows] = await db.promise().query('SELECT * FROM contracts WHERE ContractID = ?', [contractId]);
        if (rows.length === 0) {
            throw new Error('Contract not found');
        }
        return rows[0];
    } catch (error) {
        throw error;
    }
}
async function getContractById(contractId) {
    try {
        const [rows] = await db.promise().query('SELECT * FROM contracts WHERE ContractID = ?', [contractId]);
        if (rows.length === 0) {
            throw new Error('Contract not found');
        }
        return rows[0];
    } catch (error) {
        throw error;
    }
}

async function updateContractById(contractId, contractData) {
    try {
        await db.promise().query('UPDATE contracts SET ? WHERE ContractID = ?', [contractData, contractId]);
    } catch (error) {
        throw error;
    }
}

async function getImageAsBase64(url) {
    try {
        var imagePath = path.join(url);
        var parts = url.split('.');
        var extension = parts[parts.length - 1].toLowerCase();
        // Check if the file exists
        if (!fs.existsSync(imagePath)) {
            console.log("not found", imagePath)

            const imagePathurl = "uploads/imagenotfound.png"
            imagePath = path.join(imagePathurl);
            parts = url.split('.');
            extension = parts[parts.length - 1].toLowerCase();
        }


        const data = await fs.promises.readFile(imagePath);

        // Convert the image data to Blob
        const blob = Buffer.from(data, 'binary');
        const base64Data = data?.toString('base64');

        return `data:image/${extension};base64,${base64Data}`;
    } catch (error) {
        console.error('Error reading image file:', error.message);
        throw error; // Re-throw the error to be caught in the calling function
    }
}

async function getContractsPdf(contractId, userid, baseUrl) {
    try {
        const contractQuery = `SELECT c.*, t.*,
                        CONCAT( t.FirstName, ' ', t.MiddleName, ' ', t.LastName) AS TenantFullName, r.*, p.*,u.*,
                        CONCAT(p.name, ' ', r.RoomNumber) AS RoomData
                        FROM contracts c
                        JOIN tenants t ON t.TenantID = c.TenantID
                        JOIN rooms r ON r.RoomID = c.RoomID
                        JOIN properties p ON r.PropertyID = p.id
                        JOIN users u ON u.UserID = p.owner_id
                        WHERE c.ContractID = ?`;
        const attachmentQuery = `SELECT * FROM attachments WHERE ContractID = ?`;

        const [contract] = await db.promise().query(contractQuery, [contractId]);
        const [attachment] = await db.promise().query(attachmentQuery, [contractId]);
        console.log(contract)
        // console.log(attachment)

        const attachimg = await Promise.all(
            attachment.map(async (val) => {
                return await getImageAsBase64(`./${val.FilePath}`);
            })
        );
        // console.log(attachimg)
        const font = {
            Roboto: {
                data: fs.readFileSync('AbyssinicaSIL-Regular.ttf'),
                fallback: true,
            },
        };
        const startdate = contract[0].ContractStartDate
        const enddate = contract[0].ContractEndDate

        const startyear = startdate.getFullYear();
        const startmonth = startdate.getMonth() + 1; // Month is zero-based, so we add 1
        const startday = startdate.getDate();

        const endyear = enddate.getFullYear();
        const endmonth = enddate.getMonth() + 1; // Month is zero-based, so we add 1
        const endday = enddate.getDate();

        const humanReadableStartDate = `${startyear}-${startmonth}-${startday}`;
        const humanReadableEndDate = `${endyear}-${endmonth}-${endday}`;

        const inputs = [
            {
                "qrcode": `${baseUrl}/contracts/pdf/${contractId}`,
                "Owner": contract[0].Username,
                "Tenant_Name": contract[0].TenantFullName,
                "Property Adress": contract[0].location,
                "Room ": contract[0].RoomData,
                "StartDate": humanReadableStartDate,
                "EndDate": humanReadableEndDate,
                "PaymentDueDate": contract[0].DueDate.toString(),
                "Interest": contract[0].Interest,
            }
        ];
        attachimg.map((val) => {
            inputs.push({
                attachment: val ? val : "",
            })
        })
        const pdfdata = await generate({ template: contractpdf, inputs, options: { font } })
        return pdfdata

    } catch (error) {
        throw error;
    }
}

async function deleteContractById(contractId) {
    try {
        await db.promise().query('DELETE FROM contracts WHERE ContractID = ?', [contractId]);
    } catch (error) {
        throw error;
    }
}


module.exports = {
    createContractWithAttachments,
    getContractById,
    getContracts,
    getContractsPdf,
    getContractsAll,
    changeContractState,
    updateContractById,
    deleteContractById,
};
