import jwt from "jsonwebtoken"

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                messsage: "User not authenticated",
                success: false
            });
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                messsage: "Token is invalid",
                success: false
            });
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Invalid or expired token",
            success: false
        });
    }
}