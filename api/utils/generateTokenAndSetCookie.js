import jwt from "jsonwebtoken";
const generateTokenAndSetCookie = (res,userId)=>{
    // token
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    });
    // setting cookie in the response
    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict",
        maxAge:7*24*60*60*1000,
    });
    return token;
}
export default generateTokenAndSetCookie;