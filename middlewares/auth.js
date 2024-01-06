import jwt from "jsonwebtoken";

export const authentication = (req,res,next) => {
    try {
        const token = req.headers.authorization;
        const tokenParts = token.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return res.status(401).json({ message: 'Unauthorized: Invalid Authorization header format' });
        }
        const actualToken = tokenParts[1];
        const decodedToken = jwt.decode(actualToken, { complete: true });
        if (!decodedToken || !decodedToken.payload.exp) {
            return res.status(401).json({ message: 'Unauthorized: Token has no expiration claim' });
        }
        const expirationTime = decodedToken.payload.exp;
        if (Date.now() >= expirationTime * 1000) {
            return res.status(401).json({ message: 'Unauthorized: Token has expired' });
        }
        next();
    } catch (error) {
        next(error)
    }
}