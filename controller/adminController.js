import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userSchema from '../model/userSchema.js';
import orderSchema from '../model/orderSchema.js';

dotenv.config();

const admin_secret_key = process.env.ADMIN_SECRET_KEY;
export const adminLoginController = (request,response)=>{
    try{
        const email = request.body.email;
        const password = request.body.password;
        
        if(email == "admin@gmail.com" && password == "admin@123"){
            const expireTime = {
                expiresIn:'1d'
            }

            const token = jwt.sign({email:email},admin_secret_key,expireTime);
            if(!token)
                response.render("adminLogin",{message:"something went wrong"});
            response.cookie('admin_jwt_token',token,{maxAge:24*60*60*1000,httpOnly:true});
            response.render("adminHome",{email:request.body.email});
        }else{
            response.render("adminLogin",{message:"email or password wrong"});
        }

    }catch(error){
        console.log("error in admin login ",error);
        response.render("adminLogin",{message:"email or password wrong"});
    }
}

export const adminViewUserController = async(request,response)=>{
    try{
        const userList = await userSchema.find();
        response.render("viewUser",{email:request.payload.email,userList:userList});
    }catch(error){
        console.log("error in admin view user ",error);
        response.render("adminHome",{email:request.payload.email});   
    }
}

export const adminUserUpdateController =  async(request,response)=>{
    try{
        const userEmail = request.query.userEmail;
        console.log("user email ",userEmail);
        const userObj = await userSchema.findOne({email:userEmail});
        console.log("user obj ",userObj);
        response.render("userUpdationForm",{userObj:userObj});
    }catch(error){
        console.log("error in adminUserUpdateController ",error);
        response.render("PageNotFound");
    }
}

export const updateUser = async(request,response)=>{
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
        var updateStatus = {
            $set:{
                name:name,
                email:email,
                password:password,
                phoneNumber:phoneNumber,
                diet:diet,
                age:age,
                address:address
            }
        }
        const result = await userSchema.updateOne({email:email},updateStatus);
        if(result.modifiedCount){
            const userList = await userSchema.find();
            response.render("viewUser",{email:request.payload.email,userList:userList});
        }else{
            response.render("userUpdationForm",{userObj:userObj});
        }
    } catch (error) {
        console.log("error in updateuser ",error);
        response.render("PageNotFound");
    }
    
}

export const adminUserDeleteController = async(request,response)=>{
    const userEmail = request.query.userEmail;

    const result = await userSchema.deleteOne({email:userEmail});
    // console.log("result ",result);
    if(result.deletedCount){
        const userList = await userSchema.find();
        response.render("viewUser",{email:request.payload.email,userList:userList});   
    }else{
        const userList = await userSchema.find();
        response.render("viewUser",{email:request.payload.email,userList:userList});   
    }
}

export const adminLogoutController = (request,response)=>{
    response.clearCookie('admin_jwt_token');
    response.render("adminLogin",{message:"logout successfully"});
}

export const adminOrderManagementController = async(request,response)=>{
    try {
        const orders = await orderSchema.find();
        response.render("adminViewOrder",{orders,message:""});
        
    } catch (error) {
        response.render("PageNotFound");
        console.log("error in adminOrderManagementController ",error);
    }
}

export const adminUpdateOrderStatusController = async(request,response)=>{
    // console.log("request.body ",request.body);
    // response.status(200).send("code runned");
    try {
        const userId = request.body.userId;
        const status = request.body.status;
        const email = request.query.email;

    console.log(`email ${email}, status ${status}, userId ${userId}`);
        const updateStatus = {
            $set:{
                status
            }
        }
        
        const result = await orderSchema.updateOne({userId,email},updateStatus);
        console.log("result ",result);
        if(result.modifiedCount==1){
            const orders = await orderSchema.find();
            response.render("adminViewOrder",{orders,message:"updated Successfully"});
        }else{
            const orders = await orderSchema.find();
            response.render("adminViewOrder",{orders,message:"updated Successfully"});
        }
    } catch (error) {
        console.log("error in adminUpdateOrderStatusController ",error);
        response.render("PageNotFound");
    }
}