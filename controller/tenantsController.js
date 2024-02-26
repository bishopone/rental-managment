const tenantsModel = require('../model/tenantsModel');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

async function getAllTenants(req, res) {
    try {
        const [rows] = await tenantsModel.getAllTenants();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createTenant(req, res) {
    const tenant = req.body;
    const tenantimage = req.files;
    var ProfilePictureLink = ""
    var GovernmentIDPictureLink = ""
    try {
        console.log(tenantimage)
        if (tenantimage) {
            const governmentidDir = path.join('./uploads/government');
            const profileDir = path.join('./uploads/profiles');
            if (!fs.existsSync(governmentidDir)) {
                fs.mkdirSync(governmentidDir);
            }
            if (!fs.existsSync(profileDir)) {
                fs.mkdirSync(profileDir);
            }
            const governmentidPath = path.join(governmentidDir, tenantimage.GovernmentID.name);
            const profilePath = path.join(profileDir, tenantimage.ProfilePicture.name);

            // Use Promise to wait for both mv operations to complete
            await new Promise((resolve, reject) => {
                tenantimage.ProfilePicture.mv(profilePath, async (err) => {
                    if (err) {
                        res.status(500).json({ error: 'Failed to upload image.' });
                        reject(err);
                        return;
                    }
                    ProfilePictureLink = profilePath;
                    resolve();
                });
            });

            await new Promise((resolve, reject) => {
                tenantimage.GovernmentID.mv(governmentidPath, async (err) => {
                    if (err) {
                        res.status(500).json({ error: 'Failed to upload image.' });
                        reject(err);
                        return;
                    }
                    GovernmentIDPictureLink = governmentidPath;
                    resolve();
                });
            });
            
            await tenantsModel.createTenant(tenant, ProfilePictureLink, GovernmentIDPictureLink);
            res.status(200).json({ message: 'Tenant created' });
        }
        console.log(ProfilePictureLink, GovernmentIDPictureLink)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getTenantById(req, res) {
    const tenantId = req.params.id;
    try {
        const [rows] = await tenantsModel.getTenantById(tenantId);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Tenant not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteTenant(req, res) {
    const tenantId = req.params.id;
    try {
        await tenantsModel.deleteTenant(tenantId);
        res.json({ message: 'Tenant deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


async function updateTenant(req, res) {
    try {
        const tenant = req.body;
        const tenantId = req.params.id;
        const tenantimage = req.files;
        var ProfilePictureLink = null
        var GovernmentIDPictureLink = null
        console.log("updateTenant");
        if (tenantimage) {

            const governmentidDir = path.join('./uploads/government');
            const profileDir = path.join('./uploads/profiles');
            if (!fs.existsSync(governmentidDir)) {
                fs.mkdirSync(governmentidDir);
            }
            if (!fs.existsSync(profileDir)) {
                fs.mkdirSync(profileDir);
            }

            const governmentidPath = tenantimage.GovernmentID?.name
                ? path.join(governmentidDir, tenantimage.GovernmentID.name)
                : null;

            const profilePath = tenantimage.ProfilePicture?.name
                ? path.join(profileDir, tenantimage.ProfilePicture.name)
                : null;

            // Use Promise to wait for both mv operations to complete
            if (tenantimage.ProfilePicture) {
                await new Promise((resolve, reject) => {
                    tenantimage.ProfilePicture.mv(profilePath, async (err) => {
                        if (err) {
                            res.status(500).json({ error: 'Failed to upload image.' });
                            reject(err);
                            return;
                        }
                        ProfilePictureLink = profilePath;
                        resolve();
                    });
                });
            }

            if (tenantimage.GovernmentID) {
                await new Promise((resolve, reject) => {
                    tenantimage.GovernmentID.mv(governmentidPath, async (err) => {
                        if (err) {
                            res.status(500).json({ error: 'Failed to upload image.' });
                            reject(err);
                            return;
                        }
                        GovernmentIDPictureLink = governmentidPath;
                        resolve();
                    });
                });
            }
            console.log(ProfilePictureLink, GovernmentIDPictureLink);

        }
        await tenantsModel.updateTenant(tenant, tenantId, ProfilePictureLink, GovernmentIDPictureLink);
        res.status(200).json({ message: 'Tenant updated' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllTenants,
    createTenant,
    updateTenant,
    getTenantById,
    deleteTenant,
};
