import jwt from 'jsonwebtoken';
export const authenticate = (req,res,next)=>{
    const authHeader = req.header('Authorization') || '';
    if(!authHeader) return res.status(401).json({error:"Access Denied"});
    const parts = authHeader.split(' ');
    const token = parts.length===2 ? parts[1] : parts[0];
    try{
        const decoded_data =  jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded_data;
        next();
    }
    catch(err){
        return res.status(401).json({error:"Invalid token"});
    }
}

export const authorize = (roles = []) => (req,res,next) => {
    if(!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (typeof roles === 'string') roles = [roles];
    if (roles.length && !roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
}
