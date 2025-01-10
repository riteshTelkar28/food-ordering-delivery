import mongoose from "mongoose";
import url from "../database/connection.js";

mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    tls:true
});

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    emailVerify:{
        type:String,
        required:true,
        default:"not verified"
    }

});

export default mongoose.model('userSchema',userSchema,'user')