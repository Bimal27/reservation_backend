
import createError from "http-errors";
import jwt from "jsonwebtoken"
import User from "../Models/UserSchema.js";

export const JwtMiddleware= (req,res,next) =>{

    const token = req.headers.authorization;
    if(!token){
        return next(createError(401,"No tokens in headers"))
    }else{

        const token = req.headers.authorization.replace("Bearer ", '')
        // console.log(token)
        
        // jwt.verify(token, process.env.JWT_SECRET,(err,user) =>{
        //     if(err) next(createError(403,"Invalid token"))
        //     req.user = user
        //     next()
        // })

 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded)

        const user = User.findById(decoded.id)

        console.log(user);
        req.user = user
        next()
    }
}

export const verifyAdmin = (req, res, next) => {
  JwtMiddleware(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};