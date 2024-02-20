const db = require('../config/dbConfig');
const config = require('../config/config');

function getAllTenants() {
    return db.promise().query(`SELECT *,CONCAT(FirstName, ' ', MiddleName, ' ', LastName) AS FullName
    FROM tenants`);
}

function createTenant(tenant, ProfilePictureLink, GovernmentIDPictureLink) {
    return db.promise().query('INSERT INTO tenants (FirstName,MiddleName, LastName, Email, PhoneNumber, GovernmentID, ProfilePicture, AdditionalInfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [tenant.FirstName, tenant.MiddleName, tenant.LastName, tenant.Email, tenant.PhoneNumber, ProfilePictureLink, GovernmentIDPictureLink, tenant.AdditionalInfo]);
}

function getTenantById(tenantId) {
    return db.promise().query('SELECT * FROM tenants WHERE TenantID = ?', [tenantId]);
}

function deleteTenant(tenantId) {
    return db.promise().query('DELETE FROM tenants WHERE TenantID = ?', [tenantId]);
}

async function updateTenant(tenant, tenantId, ProfilePicture = null, GovernmentID = null) {
    try {
        console.log(tenant, tenantId, ProfilePicture, GovernmentID)
        const sanitizedTenant = {
            FirstName: tenant.FirstName.trim(),
            MiddleName: tenant.MiddleName.trim(),
            LastName: tenant.LastName.trim(),
            Email: tenant.Email.trim(),
            PhoneNumber: tenant.PhoneNumber.trim(),
            AdditionalInfo: tenant.AdditionalInfo,
        };
        if (ProfilePicture) {
            sanitizedTenant.GovernmentID = GovernmentID;
        }
        if (GovernmentID) {
            sanitizedTenant.ProfilePicture = ProfilePicture;
        }
        const [result] = await db.promise().query('UPDATE tenants SET ? WHERE TenantID = ?', [sanitizedTenant, tenantId]);
        console.log(result)
        return result;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

module.exports = {
    getAllTenants,
    createTenant,
    updateTenant,
    getTenantById,
    deleteTenant,
};
