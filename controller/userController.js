import orderSchema from "../model/orderSchema.js";
import userSchema from "../model/userSchema.js";
import mailer from "../router/mailer.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const user_secret_key = process.env.USER_SECRET_KEY;

export const userRegistrationController = (request,response)=>{
    try {
        const {name,email,password,phoneNumber,diet,age,address} = request.body;

        var userObj = {
            name:name,
            email:email,
            password:password,
            phoneNumber:phoneNumber,
            diet:diet,
            age:age,
            address:address
        }
    
        // console.log("userObj ",userObj);
        const mailData = `hello ${email}.This is an verification mail by Food Delivery.Please click the below link for verification <br> <a href='https://food-ordering-delivery.onrender.com/user/verifyEmail?email=${email}'>click here</a>`
    
        mailer.mailer(mailData,email,async(info)=>{
            try{
                if(info){
                    var result = await userSchema.create(userObj);
                    // console.log("result ",result);
                    response.render("login",{message:"email sent please verify"});
                }
                else{
                    response.render("userRegistration",{message:"error while sending mail"});
                }
            }
            catch(error){
                console.log("error while user registration ",error);
                response.render("userRegistration",{message:"email id already exist"});
            }
        })
    } catch (error) {
        console.log("error in userRegistrationController", error);
        response.render("PageNotFound");
    }
}

export const verifyEmailController = async(request,response)=>{
        try{
            const userEmail = request.query.email;
            var updateStatus = {
                $set:{
                    emailVerify:"verified"
                }
            }

            var result = await userSchema.updateOne({email:userEmail},updateStatus);
            response.render("login",{message:"email verified | now you can login"});
        }catch(error){
            response.render("login",{message:"error while verifying email"});
            console.log("error while  verifying email ",error);
        }
}

export const userLoginController = async(request,response)=>{
    try{
        const userEmail = request.body.email;
        const userObj = await userSchema.findOne({email:userEmail});
        const password = userObj.password;
        const isEmailVerified = userObj.emailVerify;
        const status = (password == request.body.password)?true:false;
        if(status && isEmailVerified=="verified"){
            const expireTime = {
                expiresIn:'1d'
            }

            const token = jwt.sign({email:userEmail},user_secret_key,expireTime);
            if(!token)
                response.render("login",{message:"something went wrong"});

            response.cookie('user_jwt_token',token,{maxAge:24*60*60*1000,httpOnly:true});
            response.render("userHome",{email:request.body.email});
        }
        else{
            response.render("login",{message:"wrong password"});
        }
    }catch(error){
        console.log("error while login ",error);
        response.render("login",{message:"email id wrong"});
    }
}

export const userUpdatePasswordController = (request,response)=>{
    try {
        const email = request.body.email;
        const mailData = `hello ${email}.This is an mail for password updation.Please click the below link <br> <a href='https://food-ordering-delivery.onrender.com/user/setPassword?email=${email}'>click here</a>`
    
        mailer.mailer(mailData,email,async(info)=>{
            try{
                if(info){
                    response.render("forgotPassword",{message:"email sent"})
                }
            }catch(error){
                console.log("error while sending mail for password updation ",error);
                response.render("forgotPassword",{message:""});
            }
        })
    
    } catch (error) {
       console.log("error in userUpdatePasswordController ",error);
       response.render("PageNotFound"); 
    }
}

export const setNewPassword = async(request,response)=>{
    try {
        const password = request.body.password;
        console.log("password ",password);
        const email = request.query.email;
        console.log("setNewPassword email ",email);
        
        var updateStatus = {
            $set : {
                password:password
            }
        }
    
        var result = await userSchema.updateOne({email:request.query.email},updateStatus);
        // console.log("result ",result);
        if(result.modifiedCount){
            response.render("forgotPassword",{message:"password updated successfully"})
        }else{
            response.render("forgotPassword",{message:"error in updating password"})
        }
    
    } catch (error) {
        console.log("error in setNewPassword ",error);
        response.render("PageNotFound");
    }
    
}

export const userProfileUpdateController = async(request,response)=>{
    try {
        console.log("request.body ",request.body);
        const {name,email,contactNumber} = request.body;
        console.log("email ",email)
        const updateStatus = {
            $set:{
                name,
                contactNumber
            }
        }
        
        const result = await userSchema.updateOne({email:email},updateStatus);
        console.log("result ",result);
        if(result.modifiedCount){
            const user = await userSchema.findOne({email});
            response.render("userProfile",{email,user,message:"profile updated successfully"});
        }
        else{
            const user = await userSchema.findOne({email});
            response.render("userProfile",{email,user,message:"error while updating user"});
        }    
    } catch (error) {
        console.log("error in userProfileUpdateController ",error);
        const user = await userSchema.findOne({email : request.body.email});
        response.render("userProfile",{email:request.body.email,user,message:""});
    }
}

export const userLogoutController = (request,response)=>{
    response.clearCookie('user_jwt_token');
    response.render("login",{message:"logout successfull"});
}

export const userOrderDeleteController = async(request,response)=>{
    try {
        const userId = request.query.userId;
        // console.log("userId ",userId);
        const email = request.payload.email;
        // console.log("email ",email);
        const result = await orderSchema.deleteOne({email,userId});
        // console.log("result ",result);
        if(result.deletedCount==1){
            const orders = await orderSchema.find({email});
            response.render("viewOrder",{email,orders});
        }
        else{
            response.render("PageNotFound");
        } 
    } catch (error) {
        console.log("error in userOrderDeleteController ",error);
        response.render("PageNotFound");
    }
}