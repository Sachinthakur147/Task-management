
function authorizeRole(...allowedRoles) {
     return (req, res, next) => {
       const { role } = req.user;
   
       if (!allowedRoles.includes(role)) {
         return res.status(403).json({ message: 'Forbidden: You do not have access to this resource.' });
       }
   
       next();
     };
   }
   
   module.exports = authorizeRole;
   