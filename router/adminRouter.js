import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { adminLoginController,adminUpdateOrderStatusController, adminUserUpdateController, adminViewUserController, updateUser, adminUserDeleteController, adminLogoutController, adminOrderManagementController} from '../controller/adminController.js';
var adminRouter = express.Router();
dotenv.config();

const admin_secret_key = process.env.ADMIN_SECRET_KEY;
const authenticateJWT = (request,response,next)=>{
    try{
        // console.log("request.cookies ",request.cookies);
        
        const token = request.cookies.admin_jwt_token;
        jwt.verify(token,admin_secret_key,(error,payload)=>{
            if(error){
                response.render("login",{message:"please login first"})
            }else{
                request.payload = payload;
                next();
            }
        })

    }catch(error){
        console.log("error in jwt token ",error);
        response.render("login",{message:"something went wrong"});
    }
}

adminRouter.get("/",(request,response)=>{
    response.render("adminLogin",{message:""});
})

adminRouter.post("/login",adminLoginController);

adminRouter.get("/adminUserUpdate",adminUserUpdateController);
adminRouter.get("/viewUser",authenticateJWT,adminViewUserController);

adminRouter.post("/updateUser",authenticateJWT,updateUser);

adminRouter.get("/adminUserDelete",authenticateJWT,adminUserDeleteController);

adminRouter.get("/logout",adminLogoutController);

adminRouter.get("/orderManagement",adminOrderManagementController);

adminRouter.post("/updateStatus",authenticateJWT,adminUpdateOrderStatusController);


export default adminRouter;