import express from 'express';
import { userLoginController,userOrderDeleteController, userRegistrationController, verifyEmailController,userUpdatePasswordController, setNewPassword, userProfileUpdateController, userLogoutController } 
from '../controller/userController.js';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { addToCartController, deleteOrderController, placeOrderController, viewCartController } from '../controller/cartController.js';
import cartSchema from '../model/cartSchema.js';
import userSchema from '../model/userSchema.js';
import orderSchema from '../model/orderSchema.js';
dotenv.config();

var userRouter = express.Router();
const user_secret_key = process.env.USER_SECRET_KEY;

const authenticateJWT = (request,response,next)=>{
    try{
        // console.log("request.cookies ",request.cookies);
        
        const token = request.cookies.user_jwt_token;
        jwt.verify(token,user_secret_key,(error,payload)=>{
            if(error){
                response.render("login",{message:"please login first"})
            }else{
                request.payload = payload;
                next();
            }
        })

    }catch(error){
        console.log("error in jwt token ",error);
        response.render("PageNotFound");
    }
}

userRouter.get("/login",(request,response)=>{
    response.render("login.ejs",{message:""});
});

userRouter.post("/login",userLoginController);

userRouter.get("/register",(request,response)=>{
    response.render("userRegistration",{message:""});
});

userRouter.post("/register",userRegistrationController);

userRouter.get("/verifyEmail",verifyEmailController);

userRouter.get("/browseFood",authenticateJWT,async(request,response)=>{
    const cart = await cartSchema.find({email:request.payload.email});
    const cartCount = cart.length;
    response.render("BrowseFood",{email:request.payload.email,cartCount});
})

userRouter.get("/userHome",authenticateJWT,(request,response)=>{
    response.render("userHome",{email:request.payload.email});
})

userRouter.get("/userProfile",authenticateJWT,async(request,response)=>{
    try {
        const user = await userSchema.findOne({email : request.payload.email});
        response.render("userProfile",{email:request.payload.email,user,message:""});
    } catch (error) {
        console.log("error in userProfile ",error)
    }
})

userRouter.post("/updateProfile",userProfileUpdateController);

userRouter.get("/forgotPassword",(request,response)=>{
    response.render("forgotPassword",{message:""});
})

userRouter.post("/updatePassword",userUpdatePasswordController);

userRouter.get("/setPassword",(request,response)=>{
    console.log("setpassword email ",request.query.email)
    response.render("setPassword",{email:request.query.email});
})

userRouter.post("/setNewPassword",setNewPassword);
userRouter.get("/cart",authenticateJWT,viewCartController);
userRouter.post("/cart/add",authenticateJWT,addToCartController);
userRouter.post("/cart/place",authenticateJWT,placeOrderController);
userRouter.get("/cart/delete",authenticateJWT,deleteOrderController);

userRouter.get("/logout",userLogoutController);

userRouter.get("/order",authenticateJWT,async(request,response)=>{
    const orders = await orderSchema.find({email:request.payload.email});
    response.render("viewOrder",{email:request.payload.email,orders});
});

userRouter.get("/deleteOrder",authenticateJWT,userOrderDeleteController);

export default userRouter;