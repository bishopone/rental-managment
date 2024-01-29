const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');
const permissionModel = require('../model/permissionModel');

const config = require('../config/config')

const checkTokenValidity = (req, res, next) => {
  let token = req.headers.authorization || req.query.token;
  // console.log(token)
  if (!token ) {
    return res.status(401).json({ error: 'Bearer token missing' });
  }
  if (token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }
  try {
    const decodedToken = jwt.verify(token, config.secretToken);
    req.userId = decodedToken.UserID;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const checkUserRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      next();
      return
      const [user] = await userModel.getUserRoleById(req.userId);
      const requiredRoleArray = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];
      
      const hasRole = requiredRoleArray.some(role =>{
        console.log(role)
        return user[0].roleName === role}
      );
      if (user && hasRole) {
        next();
      } else {
        res.status(403).json({ error: 'Access forbidden' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

const checkUserPermission = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      next();
      return
      console.log(requiredPermissions)
      const user = await userModel.getUserById(req.userId);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      const [userPermissions] = await permissionModel.getpermissionsById(req.userId);
      const permissions = userPermissions.map((x)=>x.permissionName)
      const requiredPermissionsArray = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      const hasPermission = requiredPermissionsArray.some(permission =>{
        console.log(permissions)
        return permissions.includes(permission)}
      );
      if (!hasPermission) {
        return res.status(403).json({ error: 'Access forbidden' });
      }
      next();
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};


module.exports = {
  checkTokenValidity,
  checkUserRole,
  checkUserPermission
};
